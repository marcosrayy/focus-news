"use client";

import { Suspense } from "react";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import { LoadMoreNews } from "@/components/load-more-news";
import { getCategoryNewsSections, useCategoryNewsFeed } from "@/components/category-news-feed";
import { CategoryMoreNews } from "@/components/category-more-news";
import type { ReactNode } from "react";

export function InvestmentRounds({ sidebar }: { sidebar?: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <InvestmentRoundsContent sidebar={sidebar} />
    </Suspense>
  );
}

function InvestmentRoundsContent({ sidebar }: { sidebar?: ReactNode }) {
  const feed = useCategoryNewsFeed();
  const { latestArticles: apiNews, moreArticles } = getCategoryNewsSections(feed.articles);
  const { hasMore, loadMore, isValidating, lastSyncRelative } = feed;
  
  return (
    <>
      {lastSyncRelative && (
        <div className="mb-3 flex justify-end">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">
            Atualizado {lastSyncRelative}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {apiNews.length > 0 && (
          <div className="mt-2">
            <h2 className="text-xl font-bold font-heading text-foreground mb-4">Últimas Notícias do Setor</h2>
            <NewsCardsGrid news={apiNews} sidebar={sidebar} />
          </div>
        )}
        <CategoryMoreNews articles={moreArticles} />
        <LoadMoreNews onLoadMore={loadMore} hasMore={hasMore} isLoading={isValidating} />
      </div>
    </>
  );
}
