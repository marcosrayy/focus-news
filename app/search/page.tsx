"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import { Search, ArrowLeft, ChevronDown, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import type { NewsArticle, NewsResponse } from "@/types/news";

const SEARCH_PAGE_SIZE = 18;

const searchFetcher = async (url: string): Promise<NewsResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch search results");
  return response.json();
};

const sortOptions = [
  { value: "relevance", label: "Mais relevantes" },
  { value: "recent", label: "Mais recentes" },
] as const;

const periodOptions = [
  { value: "all", label: "Tudo" },
  { value: "hour", label: "Última hora" },
  { value: "day", label: "Hoje" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
] as const;

function getPeriodMs(value: (typeof periodOptions)[number]["value"]) {
  if (value === "all") return Infinity;
  const map = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  } as const;

  return map[value];
}

function getQueryScore(article: any, query: string) {
  const values = [
    article.title || "",
    article.description || "",
    article.category || "",
    article.source || "",
  ].join(" ").toLowerCase();

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.replace(/[\W_]+/g, ""))
    .filter(Boolean);

  if (!tokens.length) return 0;

  const score = tokens.reduce((total, token) => {
    const regex = new RegExp(token, "gi");
    const matches = values.match(regex);
    return total + (matches ? matches.length : 0);
  }, 0);

  return score + (values.includes(normalizedQuery) ? 10 : 0);
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const normalizedQuery = query.trim();
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>("relevance");
  const [period, setPeriod] = useState<(typeof periodOptions)[number]["value"]>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<NewsResponse>(
    (pageIndex) => {
      if (!normalizedQuery) return null;
      const searchParams = new URLSearchParams({
        query: normalizedQuery,
        category: "Geral",
        max: String(SEARCH_PAGE_SIZE),
        offset: String(pageIndex * SEARCH_PAGE_SIZE),
        retentionDays: "90",
      });
      return `/api/news?${searchParams.toString()}`;
    },
    searchFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true, refreshInterval: 60000, dedupingInterval: 15000 },
  );

  const articles = useMemo(() => {
    const uniqueArticles = new Map<string, NewsArticle>();
    for (const page of data ?? []) {
      for (const article of page.articles) {
        uniqueArticles.set(String(article.id || article.url || article.title), article);
      }
    }
    return [...uniqueArticles.values()];
  }, [data]);
  const isError = !!error;
  const lastSyncRelative = data?.[0]?.lastSyncRelative;
  const lastPage = data?.[data.length - 1];
  const hasMore = !!lastPage && lastPage.articles.length === SEARCH_PAGE_SIZE;

  const visibleArticles = useMemo(() => {
    const list = [...articles];
    const maxAge = getPeriodMs(period);

    const filtered = list.filter((article) => {
      if (period === "all") return true;
      const publishedAt = new Date(article.publishedAt).getTime();
      if (!Number.isFinite(publishedAt)) return true;
      return Date.now() - publishedAt <= maxAge;
    });

    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }

      const scoreDiff = getQueryScore(b, normalizedQuery) - getQueryScore(a, normalizedQuery);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return filtered;
  }, [articles, normalizedQuery, period, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-4 lg:px-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground">{normalizedQuery || "Todas as notícias"}</span>
            </div>
          </div>

          {lastSyncRelative && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Atualizado {lastSyncRelative}
            </span>
          )}
        </div>

        {!normalizedQuery && (
          <div className="mb-5 rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
            Digite um tema na busca para ver notícias relacionadas.
          </div>
        )}

        {isError && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
            Não foi possível carregar os resultados da busca agora.
          </div>
        )}

        {normalizedQuery ? (
          <div>
            <div className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-card">
              <button
                type="button"
                aria-expanded={filtersOpen}
                aria-controls="search-filters-panel"
                onClick={() => setFiltersOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Ordenar e filtrar
                </span>
                <ChevronDown className={`h-4 w-4 text-primary transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>

              {filtersOpen && (
                <div id="search-filters-panel" className="mt-4 flex flex-col gap-4 border-t border-border/70 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSortBy(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          sortBy === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {periodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPeriod(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                          period === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h1 className="mb-4 font-heading text-2xl font-bold tracking-tight text-foreground">
              Resultados para “{normalizedQuery}”
            </h1>

            <div className="max-w-5xl space-y-4">
              {visibleArticles.map((article) => (
                <a
                  key={article.id || `${article.url}-${article.title}`}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
                >
                  <div className="relative h-32 w-40 shrink-0 overflow-hidden sm:h-36 sm:w-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
                      {article.category || "Notícia"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <span>{article.source || "Portal"}</span>
                        <span>•</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <h2 className="line-clamp-3 text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                        {article.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {article.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {article.author || "Equipe"}
                      </span>
                      <span>Leia a matéria</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {hasMore && (
              <div className="max-w-5xl py-6 text-center">
                <button
                  type="button"
                  onClick={() => setSize(size + 1)}
                  disabled={isValidating}
                  className="rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-wait disabled:opacity-60"
                >
                  {isValidating ? "Carregando..." : "Veja mais"}
                </button>
              </div>
            )}

            {!isLoading && visibleArticles.length === 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Nenhuma notícia foi encontrada para esse tema nesse período.
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
