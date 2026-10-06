"use client";

import { CategoryNewsCarousel } from "@/components/category-news-carousel";
import { HomeMarketSidebar } from "@/components/home-market-sidebar";
import { LoadMoreNews } from "@/components/load-more-news";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import { getCategoryNewsSections, useCategoryNewsFeed } from "@/components/category-news-feed";
import { CategoryMoreNews } from "@/components/category-more-news";

export function HomeNewsSections() {
  const feed = useCategoryNewsFeed();
  const { latestArticles, moreArticles } = getCategoryNewsSections(feed.articles);

  return (
    <>
      <div className="mt-2">
        <CategoryNewsCarousel category="home" />
      </div>

      <div className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-1.5 rounded-full bg-primary shadow-glow-sm" />
            <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
              ULTIMAS NOTICIAS
            </h2>
          </div>
          {feed.lastSyncRelative && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground animate-pulse">
              Atualizado {feed.lastSyncRelative}
            </span>
          )}
        </div>
        <NewsCardsGrid
          news={latestArticles}
          variant="three"
          sidebar={<HomeMarketSidebar />}
        />
        <CategoryMoreNews articles={moreArticles} />
        <LoadMoreNews
          onLoadMore={feed.loadMore}
          hasMore={feed.hasMore}
          isLoading={feed.isValidating}
        />
      </div>
    </>
  );
}
