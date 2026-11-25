"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, PanelsTopLeft, Camera, Plus, ArrowUp, ArrowDown, Trash2, Upload, Save, ExternalLink, LogOut, ShieldCheck, CheckCircle2, Loader2, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultFocusContent, focusContentSchema, type FocusContent, type FocusDocument, type FocusBanner, type FocusCard, type FocusPhoto } from "@/lib/focus-content";
import { UpcomingEvents } from "@/components/focus/upcoming-events";
import { WorkshopsTrainings } from "@/components/focus/workshops-trainings";

type Area = keyof FocusContent;
type Message = { error: boolean; text: string } | null;
const areas = [{ key: "banners" as const, label: "Banners", icon: ImageIcon, description: "Imagens de destaque na abertura da aba Focus." }, { key: "cards" as const, label: "Cards", icon: PanelsTopLeft, description: "Eventos, workshops e treinamentos da Focus." }, { key: "gallery" as const, label: "Galeria", icon: Camera, description: "Fotos e registros da equipe, na ordem que você escolher." }];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2 text-xs font-semibold text-muted-foreground">{label}{children}</label>;
}
function PreviewImage({ src, alt, portrait = false }: { src: string; alt: string; portrait?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return <div className={`flex items-center justify-center overflow-hidden rounded-xl border border-border bg-black ${portrait ? "mx-auto aspect-[4/5] w-full max-w-[280px]" : "aspect-[3/1] w-full"}`}>
    {src && !failed ? <img src={src} alt={alt} onError={() => setFailed(true)} className="h-full w-full object-contain" /> : <p className="px-4 text-center text-xs text-zinc-400">{failed ? "Não foi possível carregar esta imagem." : "Escolha uma imagem para visualizar."}</p>}
  </div>;
}
export function FocusAdmin({ initial }: { initial: FocusDocument }) {
  const router = useRouter();
  const [published, setPublished] = useState(initial);
  const [draft, setDraft] = useState<FocusContent>(initial.content);
  const [area, setArea] = useState<Area>("banners");
  const [selectedId, setSelectedId] = useState(initial.content.banners[0]?.id || "");
  const [message, setMessage] = useState<Message>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(published.content);
  const busy = saving || uploading;
  const current = areas.find(a => a.key === area)!;
  const selected = draft[area].find(item => item.id === selectedId);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty || uploading) event.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploading]);

  function changeArea(next: Area) { setArea(next); setSelectedId(draft[next][0]?.id || ""); }
  function update<T extends FocusBanner | FocusCard | FocusPhoto>(patch: Partial<T>) {
    setDraft(value => ({ ...value, [area]: value[area].map(item => item.id === selectedId ? { ...item, ...patch } : item) }));
    setMessage(null);
  }
  function add() {
    const id = crypto.randomUUID();
    const item = area === "banners" ? { ...defaultFocusContent.banners[0], id, title: "Novo banner", image: "", mobileImage: "", link: "", active: true } : area === "cards" ? { ...defaultFocusContent.cards[0], id, title: "Novo card", text: "", image: "", link: "", date: "", targetDate: "", location: "", type: "Evento" } : { id, src: "", alt: "Nova imagem da Focus", label: "Nova imagem", span: "col-span-1 row-span-1", fit: "cover" };
    setDraft(value => ({ ...value, [area]: [...value[area], item] })); setSelectedId(id); setMessage(null);
  }
  function remove(id: string) {
    if (!window.confirm("Remover este item do rascunho? A mudança só entra no site ao publicar.")) return;
    setMessage(null);
    const remaining = draft[area].filter(item => item.id !== id);
    setDraft(value => ({ ...value, [area]: remaining })); if (selectedId === id) setSelectedId(remaining[0]?.id || "");
  }
  function move(index: number, step: number) {
    setMessage(null);
    setDraft(value => { const items = [...value[area]]; [items[index], items[index + step]] = [items[index + step], items[index]]; return { ...value, [area]: items }; });
  }
  async function upload(file: File, field: "image" | "mobileImage" | "src") {
    const itemId = selectedId; const itemArea = area;
    setUploading(true); setMessage(null);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("Envie uma imagem de até 5 MB.");
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/admin/focus/upload", { method: "POST", body: form });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setDraft(value => ({ ...value, [itemArea]: value[itemArea].map(item => item.id === itemId ? { ...item, [field]: result.url } : item) }));
      setMessage({ error: false, text: "Imagem enviada para o rascunho. Salve e publique para exibi-la na aba Focus." });
    } catch (error) { setMessage({ error: true, text: (error as Error).message }); }
    finally { setUploading(false); }
  }
  async function publish() {
    const parsed = focusContentSchema.safeParse(draft);
    if (!parsed.success) { setMessage({ error: true, text: parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ") }); return; }
    setSaving(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/focus", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ revision: published.revision, content: parsed.data }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setPublished(result); setDraft(result.content); setMessage({ error: false, text: "Alterações publicadas com sucesso na aba Focus." }); router.refresh();
    } catch (error) { setMessage({ error: true, text: (error as Error).message || "Não foi possível publicar." }); }
    finally { setSaving(false); }
  }
  async function logout() {
    if (dirty && !window.confirm("Sair e descartar as alterações não publicadas?")) return;
    try { const response = await fetch("/api/admin/focus/session", { method: "DELETE" }); if (!response.ok) throw new Error(); router.replace("/admin/focus/login"); router.refresh(); }
    catch { setMessage({ error: true, text: "Não foi possível sair. Tente novamente." }); }
  }
  function imageField(label: string, field: "image" | "mobileImage" | "src", value: string) {
    return <div className="space-y-2"><Field label={label}><Input value={value} onChange={e => update({ [field]: e.target.value })} placeholder="URL HTTPS ou caminho da imagem" /></Field>
      <label className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 text-xs font-semibold text-primary ${busy ? "pointer-events-none opacity-50" : "hover:bg-primary/10"}`}><Upload className="h-4 w-4" />{uploading ? "Enviando…" : "Enviar ou substituir imagem"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file, field); e.target.value = ""; }} aria-label={`Enviar ${label.toLowerCase()}`} /></label>
    </div>;
  }
  const banner = area === "banners" ? selected as FocusBanner | undefined : undefined;
  const card = area === "cards" ? selected as FocusCard | undefined : undefined;
  const photo = area === "gallery" ? selected as FocusPhoto | undefined : undefined;
  return <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between border-b border-border p-5"><div><img src="/focus-news-logo.png" alt="Focus News" className="hidden w-40 dark:block" /><img src="/focus-news-logo-light.png" alt="Focus News" className="w-40 dark:hidden" /><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Administração</p></div><ShieldCheck className="h-5 w-5 text-primary" /></div>
      <nav aria-label="Áreas administrativas" className="flex gap-1 p-3 lg:flex-col"><p className="mb-3 hidden px-3 pt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground lg:block">Conteúdo da Focus</p>{areas.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => changeArea(key)} aria-current={area === key ? "page" : undefined} className={`flex min-h-12 flex-1 items-center gap-2 rounded-xl px-3 text-sm font-semibold lg:flex-none ${area === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}><Icon className="h-4 w-4" />{label}<span className="ml-auto hidden rounded-md bg-secondary px-2 py-0.5 text-[10px] sm:block">{draft[key].length}</span></button>)}</nav>
      <div className="hidden space-y-3 border-t border-border p-5 lg:mt-auto lg:block"><p className="text-xs leading-relaxed text-muted-foreground">Gerencie a presença da Focus em um só lugar.</p><Button variant="ghost" onClick={logout} disabled={busy} className="w-full justify-start"><LogOut />Sair do painel</Button></div>
    </aside>
    <main className="min-w-0">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md sm:px-7">
        <div><p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Painel editorial</p><h1 className="font-heading text-xl font-bold">Aba Focus</h1></div>
        <div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link href="/admin/focus/tv" target="_blank" rel="noopener"><MonitorPlay />Ativar modo televisão</Link></Button><Button asChild variant="outline" size="sm"><Link href="/focus" target="_blank">Ver aba Focus<ExternalLink /></Link></Button><Button size="sm" onClick={publish} disabled={busy || !dirty}>{saving ? <Loader2 className="animate-spin" /> : <Save />} {saving ? "Publicando…" : "Salvar e publicar"}</Button><Button variant="ghost" size="icon" onClick={logout} disabled={busy} className="lg:hidden" aria-label="Sair do painel"><LogOut /></Button></div>
      </header>
      <div className="space-y-6 p-4 sm:p-7">
        {message && <div role={message.error ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${message.error ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>{message.text}</div>}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${dirty ? "text-amber-500" : "text-emerald-500"}`} />{dirty ? "Você tem alterações não publicadas" : "Conteúdo sincronizado com a aba Focus"}</span><span>{published.publishedAt ? `Última publicação: ${new Date(published.publishedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}` : "Conteúdo original do site"}</span></div>
        <div className="flex items-center justify-between gap-3"><div><h2 className="font-heading text-2xl font-bold">{current.label}</h2><p className="mt-1 text-sm text-muted-foreground">{current.description}</p></div><Button onClick={add} disabled={busy} variant="outline"><Plus />Adicionar</Button></div>
        <div className="grid items-start gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <section aria-label={`Ordem de ${current.label.toLowerCase()}`} className="rounded-2xl border border-border bg-card p-3"><p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ordem de exibição</p>
            {!draft[area].length && <p className="p-4 text-sm text-muted-foreground">Nenhum item. Adicione o primeiro para começar.</p>}
            <div className="max-h-[340px] space-y-2 overflow-y-auto xl:max-h-[calc(100vh-15rem)]">{draft[area].map((item, index) => <div key={item.id} className={`rounded-xl border p-2 ${item.id === selectedId ? "border-primary/40 bg-primary/5" : "border-border"}`}>
              <button onClick={() => setSelectedId(item.id)} className="flex w-full items-center gap-3 text-left"><span className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><img src={"src" in item ? item.src || "/placeholder.svg" : item.image || "/placeholder.svg"} alt="" className="h-10 w-14 rounded-md bg-secondary object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{"label" in item ? item.label : item.title}</span>{"active" in item && <span className="text-[10px] text-muted-foreground">{item.active ? "Ativo" : "Desativado"}</span>}{"section" in item && <span className="text-[10px] text-muted-foreground">{item.section === "events" ? "Evento" : "Workshop / treinamento"}</span>}</span></button>
              <div className="mt-2 flex justify-end gap-1"><Button size="icon" variant="ghost" className="h-8 w-8" aria-label={`Mover item ${index + 1} para cima`} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUp /></Button><Button size="icon" variant="ghost" className="h-8 w-8" aria-label={`Mover item ${index + 1} para baixo`} disabled={busy || index === draft[area].length - 1} onClick={() => move(index, 1)}><ArrowDown /></Button><Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label={`Remover item ${index + 1}`} disabled={busy} onClick={() => remove(item.id)}><Trash2 /></Button></div>
            </div>)}</div>
          </section>
          {selected && <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-4"><span className="h-2 w-2 rounded-full bg-primary" /><h3 className="text-sm font-bold">Editar {area === "banners" ? "banner" : area === "cards" ? "card" : "imagem"}</h3><span className="ml-auto text-[10px] text-muted-foreground">Prévia em tempo real</span></div>
            <fieldset disabled={busy} className="grid min-w-0 gap-6 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_minmax(240px,0.9fr)]">
              <div className="min-w-0 space-y-4">
                {banner && <><Field label="Título do banner"><Input value={banner.title} onChange={e => update<FocusBanner>({ title: e.target.value })} /></Field>{imageField("Imagem desktop", "image", banner.image)}{imageField("Imagem mobile (4:5)", "mobileImage", banner.mobileImage)}<Field label="Link do banner"><Input value={banner.link} onChange={e => update<FocusBanner>({ link: e.target.value })} placeholder="https://…" /></Field><label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={banner.active} onChange={e => update<FocusBanner>({ active: e.target.checked })} className="h-4 w-4 accent-primary" />Banner ativo</label></>}
                {card && <><Field label="Exibir em"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground" value={card.section} onChange={e => update<FocusCard>({ section: e.target.value as FocusCard["section"] })}><option value="events">Próximos eventos</option><option value="workshops">Workshops & treinamentos</option></select></Field><Field label="Título do card"><Input value={card.title} onChange={e => update<FocusCard>({ title: e.target.value })} /></Field><Field label="Texto do card"><Textarea value={card.text} onChange={e => update<FocusCard>({ text: e.target.value })} rows={3} /></Field>{imageField("Imagem do card", "image", card.image)}<Field label="Link do card"><Input value={card.link} onChange={e => update<FocusCard>({ link: e.target.value })} placeholder="https://…" /></Field><div className="grid gap-3 sm:grid-cols-2"><Field label="Tipo"><Input value={card.type} onChange={e => update<FocusCard>({ type: e.target.value })} /></Field><Field label="Data exibida"><Input value={card.date} onChange={e => update<FocusCard>({ date: e.target.value })} /></Field></div><Field label="Local"><Input value={card.location} onChange={e => update<FocusCard>({ location: e.target.value })} /></Field>
                  {card.section === "events" ? <><Field label="Data do contador (horário de Brasília)"><Input type="datetime-local" value={card.targetDate ? new Date(new Date(card.targetDate).getTime() - 3 * 3600000).toISOString().slice(0, 16) : ""} onChange={e => update<FocusCard>({ targetDate: e.target.value ? new Date(`${e.target.value}:00-03:00`).toISOString() : "" })} /></Field><Field label="Cor do tipo"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground" value={card.typeColor} onChange={e => update<FocusCard>({ typeColor: e.target.value as FocusCard["typeColor"] })}><option value="bg-primary">Cor principal</option><option value="bg-emerald-600">Verde</option></select></Field></> : <><div className="grid gap-3 sm:grid-cols-2"><Field label="Status"><Input value={card.status} onChange={e => update<FocusCard>({ status: e.target.value })} /></Field><Field label="Participantes"><Input type="number" min={0} value={card.participants} onChange={e => update<FocusCard>({ participants: Number(e.target.value) })} /></Field></div><Field label="Tags (separadas por vírgula)"><Input value={card.tags.join(", ")} onChange={e => update<FocusCard>({ tags: e.target.value.split(",").map(t => t.trim()) })} /></Field></>}
                </>}
                {photo && <>{imageField("Imagem da galeria", "src", photo.src)}<Field label="Legenda"><Input value={photo.label} onChange={e => update<FocusPhoto>({ label: e.target.value })} /></Field><Field label="Descrição da imagem (acessibilidade)"><Textarea value={photo.alt} onChange={e => update<FocusPhoto>({ alt: e.target.value })} /></Field><Field label="Tamanho na galeria"><select value={photo.span} onChange={e => update<FocusPhoto>({ span: e.target.value as FocusPhoto["span"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"><option value="col-span-1 row-span-1">Padrão</option><option value="col-span-2 row-span-1">Largo</option><option value="col-span-2 row-span-2">Destaque</option></select></Field><Field label="Enquadramento"><select value={photo.fit} onChange={e => update<FocusPhoto>({ fit: e.target.value as FocusPhoto["fit"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"><option value="cover">Preencher com recorte</option><option value="contain">Mostrar imagem inteira</option></select></Field></>}
              </div>
              <div className="min-w-0 space-y-4 rounded-xl bg-secondary/30 p-3 sm:p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prévia</p>
                {banner && <><div className="flex gap-2"><Button type="button" size="sm" variant={mobilePreview ? "outline" : "secondary"} onClick={() => setMobilePreview(false)}>Desktop</Button><Button type="button" size="sm" variant={mobilePreview ? "secondary" : "outline"} onClick={() => setMobilePreview(true)}>Mobile</Button></div><PreviewImage src={mobilePreview ? banner.mobileImage : banner.image} alt={banner.title} portrait={mobilePreview} /><p className="text-xs text-muted-foreground">{banner.active ? "Este banner será exibido na posição definida ao lado." : "Este banner está desativado e não aparecerá na aba Focus."}</p></>}
                {card && <div>{card.section === "events" ? <UpcomingEvents cards={[card]} preview /> : <WorkshopsTrainings cards={[card]} preview />}</div>}
                {photo && <figure><div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-black"><img src={photo.src || "/placeholder.svg"} alt={photo.alt} className={`h-full w-full ${photo.fit === "contain" ? "object-contain" : "object-cover"}`} /></div><figcaption className="mt-3 text-sm font-semibold">{photo.label}</figcaption></figure>}
              </div>
            </fieldset>
          </section>}
        </div>
      </div>
    </main>
  </div>;
}
