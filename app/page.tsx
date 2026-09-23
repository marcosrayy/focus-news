"use client";

import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { SectionHeader } from "@/components/section-header";
import { HeroTech } from "@/components/tecnologia/hero-tech";
import { BigTechSidebar } from "@/components/big-tech-sidebar";
import { DigitalAssets } from "@/components/digital-assets";
import { NewsCardsGrid } from "@/components/news-cards-grid";
import { MarketOverview } from "@/components/market-overview";
import { useNews } from "@/hooks/useNews";
import { NewsUpdateBanner } from "@/components/news-update-banner";

export default function Home() {
  // Fetch news using the useNews hook for different sections
  // Using generic terms as requested
  const { articles: heroArticles, isLoading: heroLoading } = useNews("Tecnologia OR Empreendedorismo OR IA", "Tecnologia", 1, 0);
  const { 
    articles: gridArticles, 
    hasUpdates, 
    newCount, 
    triggerUpdate, 
    lastSyncRelative 
  } = useNews("Empreendedorismo OR Startups OR Tech", "Home", 12, 0);
  const { articles: tickerArticles } = useNews("Tecnologia OR Empreendedorismo OR Inovacao", "Destaques", 10, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />
      <NewsTicker news={tickerArticles} />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <SectionHeader />

        <div className="mt-2 h-[350px] lg:h-[450px]">
          <HeroTech article={heroArticles[0]} isLoading={heroLoading} />
        </div>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row">
          {/* Notícias aparecem PRIMEIRO no mobile (order-1), depois no desktop voltam ao normal */}
          <div className="order-1 lg:order-1 lg:w-[68%]">
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
            <NewsCardsGrid news={gridArticles} />
          </div>
          {/* Mercado aparece DEPOIS no mobile (order-2) */}
          <div className="order-2 flex flex-col gap-4 lg:order-2 lg:w-[32%]">
            <BigTechSidebar />
            <DigitalAssets />
            <div className="mt-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="h-5 w-1.5 rounded-full bg-primary shadow-glow-sm" />
                <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                  MERCADO AGORA
                </h2>
              </div>
              <MarketOverview />
            </div>
          </div>
        </div>
      </main>

      <NewsUpdateBanner hasUpdates={hasUpdates} newCount={newCount} onUpdate={triggerUpdate} />
    </div>
  );
}
