"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Terminal } from "lucide-react";
import { getCategoryNewsSections, useCategoryNewsFeed } from "@/components/category-news-feed";

export function HeroDev() {
  return (
    <Suspense fallback={null}>
      <HeroDevCarousel />
    </Suspense>
  );
}

function HeroDevCarousel() {
  const feed = useCategoryNewsFeed();
  const { featuredArticles: articles } = getCategoryNewsSections(feed.articles);
  const { isLoading } = feed;
  const [current, setCurrent] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [autoplayReset, setAutoplayReset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const slides = useMemo(() => {
    const seenTitles = new Set<string>();
    return articles.filter((article) => {
      const normalizedTitle = article.title
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
      if (!normalizedTitle || seenTitles.has(normalizedTitle)) return false;
      seenTitles.add(normalizedTitle);
      return true;
    });
  }, [articles]);
  const article = slides[current] ?? slides[0];

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timeout = setTimeout(() => {
      setCurrent((previous) => previous >= slides.length - 1 ? slides.length : previous + 1);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [autoplayReset, slides.length]);

  const goTo = (index: number) => {
    if (index < 0) {
      setCurrent(slides.length - 1);
      return;
    }
    setCurrent(Math.min(index, slides.length));
  };

  const navigateTo = (index: number) => {
    goTo(index);
    setAutoplayReset((previous) => previous + 1);
  };

  const resetAfterLastSlide = () => {
    if (current !== slides.length) return;
    setTransitionEnabled(false);
    setCurrent(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  if (isLoading && !article) {
    return (
      <article className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card sm:aspect-[3/1]">
        <div className="relative h-full animate-pulse p-3 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-8 w-32 rounded bg-muted" />
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-background p-3 sm:p-6">
            <div className="mb-4 h-6 w-1/4 rounded bg-muted" />
            <div className="mb-3 h-10 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        </div>
      </article>
    );
  }

  if (!article) {
    return (
      <article className="group relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-3 sm:aspect-[3/1] sm:p-6">
        <div className="w-full rounded-xl border border-emerald-500/20 bg-background p-6 font-mono">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">~/focus-news/dev</span>
            <span className="text-xs text-muted-foreground">main</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Nenhuma notícia de desenvolvimento disponível no momento.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card sm:aspect-[3/1]"
      onClick={() => {
        if (article.url && article.url !== "#") window.open(article.url, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="relative flex h-full min-h-0 flex-col p-3 sm:p-6">
        <div className="mb-2 flex justify-end sm:mb-4">
          {slides.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Notícia anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  navigateTo(current - 1);
                }}
                className="rounded-full border border-emerald-500/30 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Próxima notícia"
                onClick={(event) => {
                  event.stopPropagation();
                  navigateTo(current + 1);
                }}
                className="rounded-full border border-emerald-500/30 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          className="min-h-0 flex-1 overflow-hidden rounded-xl border border-emerald-500/20 bg-background font-mono transition-colors hover:border-emerald-500/50"
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (startX === null || endX === undefined || slides.length < 2) return;
            const swipeDistance = endX - startX;
            if (Math.abs(swipeDistance) < 40) return;
            navigateTo(current + (swipeDistance < 0 ? 1 : -1));
          }}
        >
          <div
            onTransitionEnd={resetAfterLastSlide}
            className={`flex h-full ${transitionEnabled ? "transition-transform duration-1000 ease-in-out" : ""}`}
            style={{
              width: `${(slides.length + 1) * 100}%`,
              transform: `translateX(-${(current * 100) / (slides.length + 1)}%)`,
            }}
          >
            {[...slides, slides[0]].map((slide, index) => (
              <div
                key={`${slide.id}-${index}`}
                className="h-full shrink-0 p-3 sm:p-6"
                style={{ width: `${100 / (slides.length + 1)}%` }}
              >
                <div className="mb-2 flex items-center gap-2 border-b border-border pb-2 sm:mb-3 sm:pb-3">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="hidden text-xs text-emerald-400 sm:inline">
                    ~/focus-news/{slide.source.toLowerCase().replace(/\s/g, "")}
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">main</span>
                </div>
                <div className="mb-2 sm:mb-4">
                  <span className="text-xs text-emerald-400">$ </span>
                  <span className="text-xs text-muted-foreground">cat destaque.md</span>
                </div>
                <span className="mb-1 hidden text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase sm:mb-2 sm:inline-block">
                  {slide.source}
                </span>
                <h2 className="line-clamp-3 font-heading text-base font-bold leading-tight text-foreground sm:line-clamp-none sm:text-2xl lg:text-3xl xl:text-4xl">
                  <span className="text-balance">{slide.title}</span>
                </h2>
                <p className="mt-3 hidden max-w-3xl text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:block lg:text-base">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}
