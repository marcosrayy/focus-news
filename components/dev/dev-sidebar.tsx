"use client";

import { Code2, BookOpen, Tag, ArrowRight, Terminal, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const tags = [
  { key: "frontend", name: "Frontend", count: 128 },
  { key: "backend", name: "Backend", count: 95 },
  { key: "mobile", name: "Mobile", count: 67 },
  { key: "devops", name: "DevOps", count: 54 },
  { key: "ai-dev", name: "IA/ML", count: 82 },
  { key: "web3", name: "Web3", count: 31 },
];

const tutorials = [
  { key: "trpc", title: "Construindo APIs type-safe com tRPC e Next.js 16", difficulty: "Intermediario", readTime: "15 min" },
  { key: "rust", title: "Guia pratico de Rust para desenvolvedores TypeScript", difficulty: "Avancado", readTime: "25 min" },
  { key: "playwright", title: "Testes E2E com Playwright: do zero a CI/CD", difficulty: "Iniciante", readTime: "12 min" },
  { key: "mf", title: "Micro-frontends com Module Federation 2.0", difficulty: "Avancado", readTime: "20 min" },
];

const codeOfWeek = {
  title: "Hook useOptimistic para forms em React 19",
  language: "TypeScript",
  stars: 342,
  snippet: `function TodoForm() {\n  const [optimistic, addOptimistic]\n    = useOptimistic(todos);\n  // ...\n}`,
};

export function DevSidebarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilter = (filterKey: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!filterKey || filterKey === "all") {
      params.delete("topic");
    } else {
      params.set("topic", filterKey);
    }
    const queryString = params.toString();
    router.push(queryString ? `/dev?${queryString}` : "/dev");
  };

  const currentTopic = searchParams.get("topic");

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CODIGO DA SEMANA</h3>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400">{codeOfWeek.language}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] text-muted-foreground">{codeOfWeek.stars}</span>
            </div>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-muted-foreground">
            <code>{codeOfWeek.snippet}</code>
          </pre>
          <p className="mt-2 text-xs font-semibold text-foreground">{codeOfWeek.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Tag className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">TAGS POPULARES</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = currentTopic === tag.key;
            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => applyFilter(tag.key)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  active ? "border-emerald-400/50 bg-emerald-500/5 text-emerald-400" : "border-border bg-secondary/40 text-foreground hover:border-emerald-400/30 hover:text-emerald-400"
                }`}
              >
                <Code2 className="h-3 w-3" />
                {tag.name}
                <span className="text-[10px] text-muted-foreground">({tag.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">TUTORIAIS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {tutorials.map((tutorial) => (
            <button
              key={tutorial.title}
              type="button"
              onClick={() => applyFilter(tutorial.key)}
              className="group w-full cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-emerald-400/30"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-emerald-400">{tutorial.title}</p>
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-[10px] font-semibold ${
                  tutorial.difficulty === "Avancado" ? "text-red-400" : tutorial.difficulty === "Intermediario" ? "text-amber-400" : "text-emerald-400"
                }`}>{tutorial.difficulty}</span>
                <span className="text-[10px] text-muted-foreground">&middot;</span>
                <span className="text-[10px] text-muted-foreground">{tutorial.readTime}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => applyFilter("all")}
        className="w-full rounded-xl bg-emerald-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
      >
        VER TODOS OS TUTORIAIS
      </button>
    </>
  );
}

export function DevSidebar() {
  return (
    <SidebarCardsModal title="DESENVOLVIMENTO" items={["Código da semana", "Tags populares", "Tutoriais"]}>
      <DevSidebarContent />
    </SidebarCardsModal>
  );
}
