import { NextResponse } from "next/server";
import { adminConfigured, sameOrigin, loginAllowed, verifyPassword, newSession, endSession, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/focus-auth";
import { boundedBody } from "@/lib/focus-http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  if (!adminConfigured()) return NextResponse.json({ error: "Acesso administrativo não configurado no servidor." }, { status: 503 });
  try {
    if (!await loginAllowed()) return NextResponse.json({ error: "Muitas tentativas. Aguarde cinco minutos." }, { status: 429 });
    const body = JSON.parse((await boundedBody(request, 4096)).toString());
    if (typeof body.password !== "string" || !verifyPassword(body.password)) return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, await newSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production" || new URL(request.url).protocol === "https:", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch { return NextResponse.json({ error: "Não foi possível entrar." }, { status: 400 }); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  await endSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return response;
}
