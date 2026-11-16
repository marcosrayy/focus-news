import { redirect } from "next/navigation";
import { isAdmin, adminConfigured } from "@/lib/focus-auth";
import { FocusLogin } from "@/components/focus/admin/focus-login";
export const dynamic = "force-dynamic";
export const metadata = { title: "Acesso administrativo | Focus News", robots: { index: false, follow: false } };
export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/focus");
  return <FocusLogin configured={adminConfigured()} />;
}
