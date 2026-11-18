import "server-only";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { readFocusRecord, writeFocusRecord, consumeLoginAttempt } from "@/lib/focus-store";

export const SESSION_COOKIE = "focus_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;
export function adminConfigured() { return /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.FOCUS_ADMIN_PASSWORD_HASH || ""); }
export function verifyPassword(password: string) {
  if (!adminConfigured() || password.length > 256) return false;
  const [salt, hash] = process.env.FOCUS_ADMIN_PASSWORD_HASH!.split(":");
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, "hex"));
}
function sessionKey(token: string) { return `session-${createHash("sha256").update(token).digest("hex")}`; }
export async function newSession() {
  const token = randomBytes(32).toString("hex");
  await writeFocusRecord(sessionKey(token), { expires: Date.now() + SESSION_SECONDS * 1000, credential: credentialVersion() }, SESSION_SECONDS);
  return token;
}
function credentialVersion() { return createHash("sha256").update(process.env.FOCUS_ADMIN_PASSWORD_HASH || "").digest("hex"); }
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const session = await readFocusRecord<{ expires: number; credential: string }>(sessionKey(token));
  return !!session && session.expires > Date.now() && session.credential === credentialVersion();
}
export async function endSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) await writeFocusRecord(sessionKey(token), null, 1);
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}
export async function authorizeMutation(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Origem não permitida." }, { status: 403 });
  if (!await isAdmin()) return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
  return null;
}

// Persisted global attempt budget also works across restarts and serverless instances.
export async function loginAllowed() {
  return consumeLoginAttempt();
}
