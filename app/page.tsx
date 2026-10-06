"use client";

import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { SectionHeader } from "@/components/section-header";
import { CategoryNewsFeed } from "@/components/category-news-feed";
import { HomeNewsSections } from "@/components/home-news-sections";
import { useNews } from "@/hooks/useNews";

export default function Home() {
  const { articles: tickerArticles } = useNews("Tecnologia OR Empreendedorismo OR Inovacao", "Destaques", 10, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />
      <NewsTicker news={tickerArticles} />

      <main className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4 lg:px-6">
        <SectionHeader />

        <CategoryNewsFeed category="home">
          <HomeNewsSections />
        </CategoryNewsFeed>
      </main>

    </div>
  );
}
