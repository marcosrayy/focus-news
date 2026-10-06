"use client";

import { NewsCardsGrid } from "@/components/news-cards-grid";
import { LoadMoreNews } from "@/components/load-more-news";
import { getCategoryNewsSections, useCategoryNewsFeed } from "@/components/category-news-feed";
import { CategoryMoreNews } from "@/components/category-more-news";

export function EconomyNews() {
  const feed = useCategoryNewsFeed();
  const { latestArticles: articles, moreArticles } = getCategoryNewsSections(feed.articles);
  const { hasMore, loadMore, isValidating } = feed;

  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          ÚLTIMAS NOTÍCIAS
        </h2>
      </div>
      {articles.length > 0 && <NewsCardsGrid news={articles} />}
      <CategoryMoreNews articles={moreArticles} />
      <LoadMoreNews onLoadMore={loadMore} hasMore={hasMore} isLoading={isValidating} />
    </section>
  );
}
