export async function boundedBody(request: Request, maximum: number) {
  if (Number(request.headers.get("content-length")) > maximum) throw new Error("TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > maximum) { await reader.cancel(); throw new Error("TOO_LARGE"); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
