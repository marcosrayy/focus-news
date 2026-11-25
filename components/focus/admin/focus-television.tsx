"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrainCircuit, BriefcaseBusiness, ChartNoAxesCombined, ChevronRight, Code2, Cpu, House, Maximize, Menu, Minimize, Rocket, Terminal, X } from "lucide-react";
import { navItems } from "@/components/navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NewsResponse } from "@/types/news";

const SLIDE_DURATION = 6000;
const timeZone = "America/Sao_Paulo";
const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit", minute: "2-digit", timeZone,
});
const sectionIcons: Record<string, typeof House> = {
  "/": House,
  "/tecnologia": Cpu,
  "/dev": Code2,
  "/startups": Rocket,
  "/economia": ChartNoAxesCombined,
  "/ia": BrainCircuit,
  "/business": BriefcaseBusiness,
};
const sections = navItems.filter(({ href }) => href !== "/focus").map(({ href, label }) => ({
  icon: sectionIcons[href],
  category: label === "IA" ? label : label[0] + label.slice(1).toLowerCase(),
}));

type NewsSlide = NewsResponse["articles"][number];

function getArticleExcerpt(article: NewsSlide) {
  const title = article.title.trim().toLowerCase();
  const source = article.source.trim().toLowerCase();

  for (const text of [article.description, article.content]) {
    const excerpt = text?.replace(/<[^>]+>/g, " ").split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .find((line) => {
        const normalized = line.toLowerCase();
        return normalized !== title && normalized !== source
          && !/^(?:acompanhe notícias sobre|matéria exclusiva para assinantes|o post |leia também|continua após)/i.test(line)
          && /\p{L}/u.test(line);
      });

    if (excerpt) {
      const sentences = excerpt.match(/^.*?[.!?](?=\s|$)/u);
      const opening = sentences?.[0] && sentences[0].length >= 45 ? sentences[0] : excerpt;
      if (opening.length <= 210) return opening;
      return opening.slice(0, 210).replace(/\s+\S*$/, "").trimEnd() + "…";
    }
  }

  return "";
}

export function FocusTelevision() {
  const screenRef = useRef<HTMLElement>(null);
  const [category, setCategory] = useState("Home");
  const [now, setNow] = useState<Date>();
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);

  const advanceSection = useCallback(() => {
    setCategory((previous) => {
      const index = sections.findIndex((section) => section.category === previous);
      return sections[(index + 1) % sections.length].category;
    });
  }, []);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    const updateFullscreen = () => setFullscreen(document.fullscreenElement === screenRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, []);

  async function toggleFullscreen() {
    const screen = screenRef.current;
    if (!screen) return;
    setFullscreenError(false);
    try {
      if (document.fullscreenElement === screen) await document.exitFullscreen();
      else await screen.requestFullscreen();
    } catch {
      setFullscreenError(true);
    }
  }

  const controlClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-1.5 text-sm font-medium hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:px-3";
  const fullscreenLabel = fullscreen ? "Sair da tela cheia" : "Tela cheia";

  return (
    <main ref={screenRef} className="fixed inset-0 z-50 isolate flex flex-col overflow-hidden bg-slate-950 text-white">
      <TelevisionSlides key={category} category={category} now={now} onComplete={advanceSection} />
      <header className="z-10 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-border/60 bg-background/85 px-2 py-3 text-foreground backdrop-blur-md sm:px-7">
        <div className="col-start-2">
          <img src="/focus-news-logo-light.png" alt="Focus News" className="h-auto w-28 dark:hidden sm:w-44" />
          <img src="/focus-news-logo.png" alt="Focus News" className="hidden h-auto w-28 dark:block sm:w-44" />
        </div>
        <div className="col-start-3 flex items-center justify-self-end gap-1">
          <Sheet>
            <SheetTrigger className={controlClass} aria-label="Abrir menu de navegação">
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" container={fullscreen ? screenRef.current : undefined} className="flex h-dvh w-[84vw] max-w-[340px] flex-col gap-0 border-border/60 p-0 pt-[env(safe-area-inset-top)] [&>button]:top-[calc(1rem+env(safe-area-inset-top))] [&>button]:grid [&>button]:size-9 [&>button]:place-items-center [&>button]:rounded-xl [&>button]:bg-secondary [&>button]:text-foreground [&>button]:opacity-100 [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-primary">
              <SheetHeader className="border-b border-border/60 px-5 py-6 pr-16 text-left">
                <SheetTitle className="sr-only">Menu do Focus News</SheetTitle>
                <SheetDescription className="sr-only">Selecione uma seção do modo televisão.</SheetDescription>
                <img src="/focus-news-logo-light.png" alt="Focus News" className="h-auto w-40 dark:hidden" />
                <img src="/focus-news-logo.png" alt="Focus News" className="hidden h-auto w-40 dark:block" />
              </SheetHeader>
              <nav aria-label="Seções do modo televisão" className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Menu</p>
                <div className="flex flex-col gap-1.5">
                  {sections.map(({ category: section, icon: Icon }) => {
                    const isActive = section === category;
                    return (
                      <SheetClose asChild key={section}>
                        <button
                          type="button"
                          onClick={() => setCategory(section)}
                          aria-current={isActive ? "true" : undefined}
                          className={`flex min-h-12 items-center gap-3.5 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? "border-primary/20 bg-primary/10 text-primary" : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                        >
                          <Icon aria-hidden="true" className="size-[19px] shrink-0" strokeWidth={1.6} />
                          <span className="flex-1">{section}</span>
                          {isActive && <ChevronRight aria-hidden="true" className="size-4" />}
                        </button>
                      </SheetClose>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <button type="button" onClick={toggleFullscreen} className={controlClass} aria-label={fullscreenLabel}>
            {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            <span className="hidden sm:inline">{fullscreenLabel}</span>
          </button>
          <Link href="/admin/focus" className={controlClass} aria-label="Sair do modo televisão">
            <X className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </Link>
        </div>
      </header>
      {fullscreenError && <p role="status" className="z-10 self-end bg-background px-4 py-2 text-sm text-foreground">O navegador não conseguiu abrir a tela cheia.</p>}
    </main>
  );
}

function TelevisionSlides({ category, now, onComplete }: { category: string; now: Date | undefined; onComplete: () => void }) {
  const [articles, setArticles] = useState<NewsSlide[] | null>(null);
  const [error, setError] = useState(false);
  const [current, setCurrent] = useState(0);
  const slides = articles ?? [];
  const total = slides.length;
  const active = slides[current];
  const next = slides[current + 1];
  const loaded = articles !== null || error;
  const isDev = category === "Dev";
  const excerpt = active ? getArticleExcerpt(active) : "";
  const articleLink = active && /^https?:\/\//i.test(active.url) && (
    <a
      href={active.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir matéria em uma nova aba: ${active.title}`}
      className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary"
    />
  );

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ category, max: "12" });

    async function load() {
      try {
        const response = await fetch(`/api/news?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("News request failed");
        const { articles }: { articles: NewsSlide[] } = await response.json();
        if (!controller.signal.aborted) setArticles(articles);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }

    void load();
    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    if (!loaded) return;
    const timer = window.setTimeout(() => {
      if (current + 1 < total) setCurrent(current + 1);
      else onComplete();
    }, total > 0 ? SLIDE_DURATION : 2000);
    return () => window.clearTimeout(timer);
  }, [current, loaded, onComplete, total]);

  return (
    <>
      {active && !isDev && (
        <picture key={active.image} className="absolute inset-0 -z-20 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-700">
          <img src={active.image} alt="" className="h-full w-full object-cover" />
        </picture>
      )}
      {next && !isDev && (
        <picture hidden>
          <img src={next.image} alt="" />
        </picture>
      )}
      <div aria-hidden="true" className={isDev
        ? "absolute inset-0 -z-10 bg-card"
        : "absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/40"} />
      {!isDev && articleLink}
      {!active && !isDev && (
        <p role="status" className={`absolute inset-x-5 top-1/2 -translate-y-1/2 text-center text-lg ${isDev ? "text-muted-foreground" : "text-slate-200"}`}>
          {error ? "Não foi possível carregar as notícias." : articles === null
            ? "Carregando notícias…" : "Nenhuma notícia disponível nesta seção."}
        </p>
      )}
      <div className={isDev
        ? "absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5 sm:px-10 lg:px-16"
        : "pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-10 sm:px-10 sm:pb-14 lg:px-16"}>
          <div className={isDev
            ? "relative mx-auto max-w-7xl rounded-xl border border-emerald-500/20 bg-background p-4 font-mono text-foreground sm:p-8"
            : "min-w-0 drop-shadow-lg"}>
            {isDev && articleLink}
            {isDev ? (
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
                {active && (
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <Terminal aria-hidden="true" className="size-4 shrink-0" />
                      <span className="truncate">~/focus-news/{active.source.toLowerCase().replace(/\s/g, "")}</span>
                      <span className="text-muted-foreground">main</span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground"><span className="text-emerald-400">$ </span>cat destaque.md</p>
                  </div>
                )}
                {now && (
                  <time dateTime={now.toISOString()} className="ml-auto shrink-0 font-heading text-2xl leading-none text-[#ff5f03] tabular-nums sm:text-4xl">
                    {timeFormat.format(now)}
                  </time>
                )}
              </div>
            ) : now && (
              <time dateTime={now.toISOString()} className="block font-heading text-[clamp(2.75rem,7vw,6rem)] leading-none font-light tracking-tight text-[#ff5f03] tabular-nums">
                {timeFormat.format(now)}
              </time>
            )}
            {active && <h2 className={isDev
              ? "mt-2 line-clamp-3 font-heading text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl"
              : "mt-1 line-clamp-2 max-w-5xl text-lg font-medium sm:text-2xl"}>{active.title}</h2>}
            {excerpt && (
              <p className={isDev
                ? "mt-3 hidden max-w-3xl text-sm leading-relaxed text-muted-foreground sm:line-clamp-2"
                : "mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-lg"}>
                {excerpt}
              </p>
            )}
            {isDev && !active && (
              <p role="status" className="text-sm text-muted-foreground">
                {error ? "Não foi possível carregar as notícias." : articles === null
                  ? "Carregando notícias…" : "Nenhuma notícia disponível nesta seção."}
              </p>
            )}
          </div>
      </div>
    </>
  );
}
