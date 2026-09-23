import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroTrade } from "@/components/trade/hero-trade";
import { TradeArticles } from "@/components/trade/trade-articles";
import { TradeSidebar } from "@/components/trade/trade-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade - Focus News | Mercados e Operacoes",
  description:
    "Analises tecnicas, cotacoes ao vivo, sinais de trade e cobertura completa dos mercados financeiros globais.",
};

export default function TradePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />

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

        {/* Hero */}
        <HeroTrade />

        {/* Main Content + Sidebar */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-[68%]">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-emerald-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                ULTIMAS DO MERCADO
              </h2>
            </div>
            <TradeArticles />
          </div>
          <div className="lg:w-[32%]">
            <TradeSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
