"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedNewsCarousel } from "@/components/news-section-layout";

interface Article {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  source: { name: string };
  url: string;
}

interface NewsResponse {
  articles: Article[];
  isFallback: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `ha ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `ha ${diffHours}h`;
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }
}

function NewsCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border/50 bg-card ${
        featured ? "col-span-full lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <Skeleton className={`w-full ${featured ? "h-64 lg:h-80" : "h-40"}`} />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-24" />
        <Skeleton className={`mb-2 ${featured ? "h-8" : "h-6"} w-full`} />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function NewsCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          featured ? "h-64 lg:h-80" : "h-40"
        }`}
      >
        <img
          src={imgError ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" : article.image}
          alt={article.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* External link indicator */}
        <div className="absolute right-3 top-3 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <ExternalLink className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Source */}
        <span className="mb-2 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary">
          {article.source.name}
        </span>

        {/* Title */}
        <h3
          className={`mb-2 line-clamp-2 font-heading font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary ${
            featured ? "text-xl lg:text-2xl" : "text-sm"
          }`}
        >
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p
            className={`mb-3 line-clamp-2 text-muted-foreground ${
              featured ? "text-sm" : "text-xs"
            }`}
          >
            {article.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1 text-primary">
            Ler mais
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/0 transition-all duration-300 group-hover:ring-primary/20" />
    </a>
  );
}

export function FocusNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("/api/gnews");
      if (!res.ok) throw new Error("Failed to fetch");

      const data: NewsResponse = await res.json();
      setArticles(data.articles);
      setIsFallback(data.isFallback);
      setError(false);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleRefresh = () => {
    setLoading(true);
    fetchNews();
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-primary">
            Focus News
          </h2>
          {isFallback && !loading && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              Offline
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Atualizado {formatDate(lastUpdate.toISOString())}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && !loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-8 text-center">
          <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nao foi possivel carregar as noticias agora.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NewsCardSkeleton featured />
          {[...Array(4)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* News Grid */}
      {!loading && articles.length > 0 && (
        <FeaturedNewsCarousel
          label="Focus News"
          gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          slideClassName={(index) => index === 0 ? "sm:col-span-full lg:col-span-2 lg:row-span-2" : ""}
        >
          {articles.map((article, index) => (
            <NewsCard
              key={article.url || index}
              article={article}
              featured={index === 0}
            />
          ))}
        </FeaturedNewsCarousel>
      )}
    </section>
  );
}
