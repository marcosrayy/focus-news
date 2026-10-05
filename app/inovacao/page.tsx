import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { CategoryNewsCarousel } from "@/components/category-news-carousel";
import { InnovationCases } from "@/components/inovacao/innovation-cases";
import { InovacaoSidebar } from "@/components/inovacao/inovacao-sidebar";
import type { NewsArticle } from "@/types/news";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inovacao - Focus News | Casos Inspiradores e Modelos Inovadores",
  description:
    "Descubra casos inspiradores, modelos de negocios inovadores, entrevistas com fundadores e o futuro em construcao.",
};

export default function InovacaoPage() {
  const tickerNews: NewsArticle[] = [
    { id: "inovacao-1", title: "Modelos de negócio com impacto social ganham mais atenção no mercado.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Inovacao" },
    { id: "inovacao-2", title: "Projetos de pesquisa passam a receber mais capital de risco.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Inovacao" },
    { id: "inovacao-3", title: "Setores como energia e saúde impulsionam novas soluções de escala.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Inovacao" },
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
            <div className="h-6 w-1.5 rounded-full bg-cyan-500" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              INOVACAO
            </h1>
          </div>
          <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs font-semibold text-cyan-400">
            INSPIRACAO
          </span>
        </div>

        {/* Hero */}
        <CategoryNewsCarousel category="inovacao" />

        {/* Main Content + Sidebar */}
        <div className="mt-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-cyan-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground uppercase">
                Últimas Notícias
              </h2>
            </div>
            <InnovationCases sidebar={<InovacaoSidebar />} />
          </div>
        </div>
      </main>
    </div>
  );
}
