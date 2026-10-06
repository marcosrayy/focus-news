"use client";

import { Suspense } from "react";
import { Cpu, Brain, Cloud, Shield, Blocks, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarCardsModal, useCloseExploreModal } from "@/components/sidebar-cards-modal";
import { useNews } from "@/hooks/useNews";
import { technologyTopicQueries } from "@/config/technology-topics";
import { formatRelativeTime } from "@/lib/news-service";

const categories = [
  { key: "ai", name: "Inteligencia Artificial", icon: <Brain className="h-4 w-4" />, color: "text-violet-400" },
  { key: "cloud", name: "Cloud Computing", icon: <Cloud className="h-4 w-4" />, color: "text-sky-400" },
  { key: "cyber", name: "Ciberseguranca", icon: <Shield className="h-4 w-4" />, color: "text-red-400" },
  { key: "web3", name: "Blockchain & Web3", icon: <Blocks className="h-4 w-4" />, color: "text-amber-400" },
  { key: "hardware", name: "Hardware & Chips", icon: <Cpu className="h-4 w-4" />, color: "text-sky-400" },
];

const hardwareComparisonQuery =
  '"processador" OR "processadores" OR "CPU" OR "chip" OR "chips" OR "GPU" OR "placa de video" OR "placas de video" OR "NVIDIA" OR "GeForce RTX" OR "AMD Radeon" OR "Intel Core Ultra" OR "AMD Ryzen" OR "Snapdragon" OR "MacBook" OR "notebook" OR "laptop" OR "smartphone"';

function getHardwareComparisonLabel(title: string, description: string) {
  const text = `${title} ${description}`
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  if (/\b(gpu|rtx|geforce|radeon|placas? de video|intel arc)\b/.test(text)) {
    return "GRAFICOS";
  }
  if (/\b(processador|cpu|chip|m[134]\b|snapdragon|ryzen|intel core|core ultra)\b/.test(text)) {
    return "PROCESSADORES";
  }
  return "DISPOSITIVOS";
}

function isHardwareComparison(article: { title: string; description: string }) {
  const text = `${article.title} ${article.description}`
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return /\b(processador(?:es)?|cpu|chip(?:s)?|gpu|rtx|geforce|radeon|placas? de video|intel arc|snapdragon|ryzen|core ultra|macbook|notebook|laptop|smartphone)\b/.test(text);
}

export function TechSidebarContent() {
  const router = useRouter();
  const closeExplore = useCloseExploreModal();
  const {
    articles: comparisonArticles,
    isLoading: comparisonsLoading,
    isError: comparisonsError,
  } = useNews(hardwareComparisonQuery, "Geral", 18);
  const { articles: analysisArticles, isLoading: analysisLoading, isError: analysisError } = useNews(
    `${technologyTopicQueries.quantum} OR ${technologyTopicQueries["ai-dev"]} OR ${technologyTopicQueries.edge}`,
    "Tecnologia",
    8,
  );
  const uniqueArticles = (articles: typeof comparisonArticles) => {
    const seen = new Set<string>();
    return articles.filter((article) => {
      const normalizedTitle = article.title
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
      if (!normalizedTitle || !article.url || article.url === "#" || seen.has(normalizedTitle)) return false;
      seen.add(normalizedTitle);
      return true;
    });
  };
  const liveComparisons = uniqueArticles(comparisonArticles)
    .filter(isHardwareComparison)
    .slice(0, 3);
  const liveAnalysis = uniqueArticles(analysisArticles).slice(0, 3);

  const searchCategory = (category: (typeof categories)[number]) => {
    const params = new URLSearchParams({
      q: category.name,
      topic: category.key,
    });
    router.push(`/search?${params.toString()}`);
    closeExplore();
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
            <Cpu className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CATEGORIAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => searchCategory(cat)}
                className="group flex w-full items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-sky-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div className="flex items-center gap-2.5">
                  <span className={cat.color}>{cat.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Ver notícias</span>
                  <ArrowRight className="h-3 w-3 text-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">COMPARATIVOS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {liveComparisons.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-secondary/40 px-3 py-3 transition-all duration-300 hover:border-sky-400/30"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                {getHardwareComparisonLabel(article.title, article.description)}
              </p>
              <p className="mt-1 text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{article.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {article.source || "Fonte de tecnologia"}
                {article.publishedAt && ` · ${formatRelativeTime(article.publishedAt)}`}
              </p>
            </a>
          ))}
          {liveComparisons.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              {comparisonsLoading ? "Carregando notícias..." : comparisonsError ? "Não foi possível atualizar os comparativos." : "Nenhum comparativo disponível no momento."}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
            <Brain className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ANALISES PROFUNDAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {liveAnalysis.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-sky-400/30"
            >
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{article.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{article.source}</span>
                <span className="text-[10px] text-muted-foreground">&middot;</span>
                <span className="text-[10px] text-sky-400">Análise</span>
              </div>
            </a>
          ))}
          {liveAnalysis.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              {analysisLoading ? "Carregando notícias..." : analysisError ? "Não foi possível atualizar as análises." : "Nenhuma análise disponível no momento."}
            </p>
          )}
        </div>
      </div>

    </>
  );
}

export function TechSidebar() {
  return (
    <Suspense fallback={null}>
      <TechSidebarInner />
    </Suspense>
  );
}

function TechSidebarInner() {
  return (
    <SidebarCardsModal title="TECNOLOGIA" items={["Categorias", "Comparativos", "Análises profundas"]}>
      <TechSidebarContent />
    </SidebarCardsModal>
  );
}
