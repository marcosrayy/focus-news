import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { REMOTE_ENABLED, remoteCommand } from "@/utils/storage";
import { defaultFocusContent, focusContentSchema, type FocusContent, type FocusDocument } from "@/lib/focus-content";

const directory = path.join(process.cwd(), "data", "focus-cms");
const key = "focus-news:focus-cms:published";
function file(name: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(name)) throw new Error("Invalid storage key");
  return path.join(directory, `${name}.json`);
}
export async function readFocusRecord<T>(name: string): Promise<T | null> {
  if (REMOTE_ENABLED) {
    const value = await remoteCommand(["GET", `focus-news:focus-cms:${name}`]);
    return typeof value === "string" ? JSON.parse(value) : null;
  }
  try { return JSON.parse(await fs.readFile(file(name), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export async function writeFocusRecord(name: string, value: unknown, ttl?: number) {
  if (REMOTE_ENABLED) {
    await remoteCommand(["SET", `focus-news:focus-cms:${name}`, JSON.stringify(value), ...(ttl ? ["EX", ttl] : [])]); return;
  }
  await fs.mkdir(directory, { recursive: true });
  const temporary = `${file(name)}.${randomUUID()}.tmp`;
  try { await fs.writeFile(temporary, JSON.stringify(value), { mode: 0o600 }); await fs.rename(temporary, file(name)); }
  finally { await fs.unlink(temporary).catch(() => {}); }
}
export async function readFocusDocument(): Promise<FocusDocument> {
  const saved = await readFocusRecord<FocusDocument>("published");
  if (!saved) return { revision: 0, publishedAt: null, content: defaultFocusContent };
  return { ...saved, content: focusContentSchema.parse(saved.content) };
}
export async function consumeLoginAttempt() {
  if (REMOTE_ENABLED) {
    const count = await remoteCommand(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],300) end; return n", 1, "focus-news:focus-cms:login-budget"]);
    return typeof count === "number" && count <= 10;
  }
  await fs.mkdir(directory, { recursive: true });
  const lockPath = path.join(directory, "login.lock");
  const lock = await fs.open(lockPath, "wx").catch(error => {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") return null;
    throw error;
  });
  if (!lock) return false;
  try {
    const now = Date.now();
    const state = await readFocusRecord<{ count: number; until: number }>("login-attempts");
    if (state && state.until > now && state.count >= 10) return false;
    const next = state && state.until > now ? { ...state, count: state.count + 1 } : { count: 1, until: now + 300000 };
    await writeFocusRecord("login-attempts", next);
    return true;
  } finally { await lock.close(); await fs.unlink(lockPath); }
}
export class PublishConflict extends Error {}
export async function publishFocus(content: FocusContent, revision: number): Promise<FocusDocument> {
  const document = { revision: revision + 1, publishedAt: new Date().toISOString(), content: focusContentSchema.parse(content) };
  if (REMOTE_ENABLED) {
    const result = await remoteCommand(["EVAL", "local current=redis.call('GET',KEYS[1]); local rev=0; if current then rev=cjson.decode(current).revision end; if rev~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1", 1, key, revision, JSON.stringify(document)]);
    if (result !== 1) throw new PublishConflict();
    return document;
  }
  await fs.mkdir(directory, { recursive: true });
  // Cross-process lock, so two open editors cannot silently overwrite each other.
  const lock = await fs.open(path.join(directory, "publish.lock"), "wx").catch(error => {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new PublishConflict();
    throw error;
  });
  try {
    if ((await readFocusDocument()).revision !== revision) throw new PublishConflict();
    await writeFocusRecord("published", document);
    return document;
  } finally { await lock.close(); await fs.unlink(path.join(directory, "publish.lock")); }
}
