import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/focus-auth";
import { readFocusDocument } from "@/lib/focus-store";
import { FocusAdmin } from "@/components/focus/admin/focus-admin";
export const dynamic = "force-dynamic";
export const metadata = { title: "Administração Focus | Focus News", robots: { index: false, follow: false } };
export default async function FocusAdminPage() {
  if (!await isAdmin()) redirect("/admin/focus/login");
  return <FocusAdmin initial={await readFocusDocument()} />;
}
