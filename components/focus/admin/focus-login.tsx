"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function FocusLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const password = new FormData(event.currentTarget).get("password");
    try {
      const response = await fetch("/api/admin/focus/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.replace("/admin/focus"); router.refresh();
    } catch (error) { setError((error as Error).message || "Não foi possível entrar."); }
    finally { setPending(false); }
  }
  return <main className="flex min-h-[90vh] items-center justify-center bg-background px-4 py-12">
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-card">
      <img src="/focus-news-logo.png" alt="Focus News" className="mb-8 hidden w-44 dark:block" />
      <img src="/focus-news-logo-light.png" alt="Focus News" className="mb-8 w-44 dark:hidden" />
      <LockKeyhole className="mb-4 h-8 w-8 text-primary" />
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Área administrativa</p>
      <h1 className="mt-2 font-heading text-2xl font-bold">Conteúdo da Focus</h1>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">Entre para gerenciar banners, cards e galeria.</p>
      {!configured && <p role="alert" className="mb-4 text-sm text-destructive">O administrador precisa configurar o acesso no servidor.</p>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">Senha administrativa<Input name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2" disabled={!configured || pending} /></label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={pending || !configured} className="w-full">{pending ? "Entrando…" : "Entrar"}<ArrowRight /></Button>
      </form>
      <Link href="/focus" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">Voltar para a aba Focus</Link>
    </div>
  </main>;
}
