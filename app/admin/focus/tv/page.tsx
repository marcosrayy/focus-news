import { redirect } from "next/navigation";
import { FocusTelevision } from "@/components/focus/admin/focus-television";
import { isAdmin } from "@/lib/focus-auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Modo televisão | Focus News",
  robots: { index: false, follow: false },
};

export default async function FocusTelevisionPage() {
  if (!await isAdmin()) redirect("/admin/focus/login");
  return <FocusTelevision />;
}
