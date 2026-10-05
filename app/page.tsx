"use client";

import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { SectionHeader } from "@/components/section-header";
import { CategoryNewsCarousel } from "@/components/category-news-carousel";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import { HomeMarketSidebar } from "@/components/home-market-sidebar";
import { useNews } from "@/hooks/useNews";

export default function Home() {
  // Fetch news using the useNews hook for different sections
  // Using generic terms as requested
  const { articles: heroArticles } = useNews("Tecnologia OR Empreendedorismo OR IA", "Tecnologia", 4, 0);
  const { 
    articles: gridArticles, 
    lastSyncRelative 
  } = useNews("Empreendedorismo OR Startups OR Tech", "Home", 24, 0);
  const { articles: tickerArticles } = useNews("Tecnologia OR Empreendedorismo OR Inovacao", "Destaques", 10, 0);
  const heroArticleIds = new Set(heroArticles.map((article) => article.id));
  const gridArticlesWithoutHero = gridArticles.filter((article) => !heroArticleIds.has(article.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />
      <NewsTicker news={tickerArticles} />

      <main className="mx-auto max-w-7xl px-2 py-3 sm:px-4 sm:py-4 lg:px-6">
        <SectionHeader />

        <div className="mt-2">
          <CategoryNewsCarousel category="home" />
        </div>

        <div className="mt-4">
          {/* Notícias aparecem PRIMEIRO no mobile (order-1), depois no desktop voltam ao normal */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-1.5 rounded-full bg-primary shadow-glow-sm" />
                <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                  ULTIMAS NOTICIAS
                </h2>
              </div>
              {lastSyncRelative && (
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider animate-pulse">
                  Atualizado {lastSyncRelative}
                </span>
              )}
            </div>
            <NewsCardsGrid
              news={gridArticlesWithoutHero}
              variant="three"
              sidebar={<HomeMarketSidebar />}
            />
          </div>
        </div>
      </main>

    </div>
  );
}
