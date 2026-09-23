import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { NewsTicker } from "@/components/news-ticker";
import { MarketTicker } from "@/components/market-ticker";
import { MarketSummaryCards } from "@/components/economia/market-summary-cards";
import { MarketCharts } from "@/components/economia/market-charts";
import { StockScoreboards } from "@/components/economia/stock-scoreboards";
import { MarketLiveCards } from "@/components/economia/market-live-cards";
import { SectorHeatmap } from "@/components/economia/sector-heatmap";
import { CryptoPerformance } from "@/components/economia/crypto-performance";
import { EconomySidebar } from "@/components/economia/economy-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Economia - Focus News | Mercado Financeiro Tech",
  description:
    "Acompanhe em tempo real os principais indices, acoes tech, criptomoedas e cambio. Graficos, placares ao vivo e analise de mercado.",
};

export default function EconomiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <NewsTicker />
      <MarketTicker />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-primary" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              ECONOMIA & MERCADOS
            </h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-semibold text-primary">LIVE</span>
          </div>
        </div>

        {/* Market Live Cards - Trading Terminal Style */}
        <MarketLiveCards />

        {/* Live Scoreboards Table */}
        <div className="mt-6">
          <StockScoreboards />
        </div>

        {/* Summary Cards */}
        <div className="mt-4">
          <MarketSummaryCards />
        </div>

        {/* Main Content + Sidebar */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          {/* Left Content */}
          <div className="flex flex-col gap-4 lg:w-[68%]">
            <MarketCharts />
            <SectorHeatmap />
            <CryptoPerformance />
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[32%]">
            <EconomySidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
