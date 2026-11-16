// Creates a unique local password. Never commits or prints credentials.
const fs = require("node:fs");
const { randomBytes, scryptSync } = require("node:crypto");
const envPath = ".env.local";
const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
if (/^FOCUS_ADMIN_PASSWORD_HASH=/m.test(existing)) {
  console.log("Acesso administrativo já configurado. Para trocar a senha, remova apenas FOCUS_ADMIN_PASSWORD_HASH de .env.local e execute novamente.");
} else {
  const password = randomBytes(24).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  fs.writeFileSync(envPath, `${existing.trimEnd()}\nFOCUS_ADMIN_PASSWORD_HASH=${salt}:${hash}\n`, { mode: 0o600 });
  fs.writeFileSync(".focus-admin-access.local.txt", `Focus News — acesso administrativo local\n\nEndereço: /admin/focus\nSenha: ${password}\n\nNão compartilhe nem publique este arquivo. A senha está armazenada como hash no servidor. Reinicie o servidor após a configuração.\n`, { mode: 0o600 });
  console.log("Acesso criado. Consulte .focus-admin-access.local.txt para obter a senha. Reinicie o servidor.");
}
