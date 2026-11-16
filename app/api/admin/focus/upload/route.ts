import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { authorizeMutation } from "@/lib/focus-auth";
import { boundedBody } from "@/lib/focus-http";
import { writeFocusRecord } from "@/lib/focus-store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const denied = await authorizeMutation(request); if (denied) return denied;
  try {
    const body = await boundedBody(request, 5 * 1024 * 1024 + 16384);
    const form = await new Request(request.url, { method: "POST", headers: { "Content-Type": request.headers.get("content-type") || "" }, body }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) return Response.json({ error: "Envie uma imagem de até 5 MB." }, { status: 400 });
    const raw = Buffer.from(await file.arrayBuffer());
    const decoder = sharp(raw, { limitInputPixels: 25000000, animated: false });
    const metadata = await decoder.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || "")) return Response.json({ error: "Use imagens JPEG, PNG ou WebP." }, { status: 400 });
    const bytes = await decoder.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
    const id = randomUUID();
    await writeFocusRecord(`media-${id}`, { data: bytes.toString("base64"), type: "image/webp" });
    return Response.json({ url: `/api/focus/media/${id}` }, { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message === "TOO_LARGE" ? "Arquivo excede 5 MB." : "Falha no envio. Confira o arquivo e tente novamente." }, { status: (error as Error).message === "TOO_LARGE" ? 413 : 400 });
  }
}
