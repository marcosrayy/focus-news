import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { CategoryNewsCarousel } from "@/components/category-news-carousel";
import { GrowthStrategies } from "@/components/business/growth-strategies";
import { BusinessSidebar } from "@/components/business/business-sidebar";
import type { NewsArticle } from "@/types/news";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business - Focus News | Estrategia e Lideranca",
  description:
    "Estrategias de crescimento, lideranca corporativa, cases de sucesso e tendencias de gestao no ecossistema tech.",
};

export default function BusinessPage() {
  const tickerNews: NewsArticle[] = [
    { id: "business-1", title: "Grandes empresas aceleram investimentos em IA para produtividade.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Business" },
    { id: "business-2", title: "Fundadores ajustam modelos de negócio para crescer sem perder eficiência.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Business" },
    { id: "business-3", title: "Mercado de software B2B segue com demanda forte em automação.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Business" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />
      <NewsTicker news={tickerNews} />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-amber-500" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              BUSINESS & ESTRATEGIA
            </h1>
          </div>
          <span className="rounded-full border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-500">
            LIDERANCA
          </span>
        </div>

        {/* Hero */}
        <CategoryNewsCarousel category="business" />

        {/* Main Content + Sidebar */}
        <div className="mt-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-amber-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                ESTRATEGIAS DE CRESCIMENTO
              </h2>
            </div>
            <GrowthStrategies sidebar={<BusinessSidebar />} />
          </div>
        </div>
      </main>
    </div>
  );
}
