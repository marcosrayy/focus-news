import { authorizeMutation, isAdmin } from "@/lib/focus-auth";
import { readFocusDocument, publishFocus, PublishConflict } from "@/lib/focus-store";
import { focusContentSchema } from "@/lib/focus-content";
import { boundedBody } from "@/lib/focus-http";
import { revalidatePath } from "next/cache";
import { z } from "zod";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!await isAdmin()) return Response.json({ error: "Acesso restrito." }, { status: 401 });
  return Response.json(await readFocusDocument(), { headers: { "Cache-Control": "no-store" } });
}
export async function PUT(request: Request) {
  const denied = await authorizeMutation(request); if (denied) return denied;
  try {
    const input = z.object({ revision: z.number().int().min(0), content: focusContentSchema }).strict().parse(JSON.parse((await boundedBody(request, 1024 * 1024)).toString()));
    const document = await publishFocus(input.content, input.revision);
    revalidatePath("/focus");
    return Response.json(document, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof PublishConflict) return Response.json({ error: "Outra publicação foi salva. Recarregue o painel antes de editar novamente." }, { status: 409 });
    if (error instanceof z.ZodError) return Response.json({ error: error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
    if (error instanceof SyntaxError) return Response.json({ error: "Conteúdo inválido." }, { status: 400 });
    if ((error as Error).message === "TOO_LARGE") return Response.json({ error: "Conteúdo excede 1 MB." }, { status: 413 });
    console.error("Focus publish failed", error);
    return Response.json({ error: "Não foi possível publicar. Suas edições continuam no painel." }, { status: 500 });
  }
}
