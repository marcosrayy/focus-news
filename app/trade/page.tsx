import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { NewsTicker } from "@/components/news-ticker";
import { CategoryNewsFeed } from "@/components/category-news-feed";
import { CategoryNewsCarousel } from "@/components/category-news-carousel";
import { TradeArticles } from "@/components/trade/trade-articles";
import { TradeSidebar } from "@/components/trade/trade-sidebar";
import type { NewsArticle } from "@/types/news";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade - Focus News | Mercados e Operacoes",
  description:
    "Analises tecnicas, cotacoes ao vivo, sinais de trade e cobertura completa dos mercados financeiros globais.",
};

export default function TradePage() {
  const tickerNews: NewsArticle[] = [
    { id: "trade-1", title: "Ibovespa reage às expectativas de juros e fluxo internacional.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Trade" },
    { id: "trade-2", title: "Dólar e juros seguem em foco para traders de curto prazo.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Trade" },
    { id: "trade-3", title: "Criptos e bolsas globais mantêm volatilidade alta nesta semana.", description: "", content: "", image: "/news-focus.jpg", source: "Focus News", author: "Focus", publishedAt: new Date().toISOString(), url: "#", category: "Trade" },
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
            <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              TRADE & MERCADOS
            </h1>
          </div>
          <span className="rounded-full border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-500">
            AO VIVO
          </span>
        </div>

        <CategoryNewsFeed category="trade">
          <CategoryNewsCarousel category="trade" />

          <div className="mt-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-emerald-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                ULTIMAS DO MERCADO
              </h2>
            </div>
            <TradeArticles sidebar={<TradeSidebar />} />
          </div>
        </CategoryNewsFeed>
      </main>
    </div>
  );
}
