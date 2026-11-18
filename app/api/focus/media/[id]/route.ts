import { readFocusRecord } from "@/lib/focus-store";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const media = await readFocusRecord<{ data: string; type: string }>(`media-${id}`);
  if (!media) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(Buffer.from(media.data, "base64")), { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
