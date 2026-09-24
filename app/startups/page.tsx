import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroStartup } from "@/components/startups/hero-startup";
import { InvestmentRounds } from "@/components/startups/investment-rounds";
import { StartupSidebar } from "@/components/startups/startup-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startups - Focus News | Ecossistema de Inovacao",
  description:
    "Acompanhe rodadas de investimento, unicornios, aceleradoras e as startups mais promissoras do ecossistema de inovacao.",
};

export default function StartupsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-blue-600" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              STARTUPS & VENTURE CAPITAL
            </h1>
          </div>
          <span className="rounded-full border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-500">
            ECOSSISTEMA
          </span>
        </div>

        {/* Hero */}
        <HeroStartup />

        {/* Main Content + Sidebar */}
        <div className="mt-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-blue-600" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                RODADAS DE INVESTIMENTO
              </h2>
            </div>
            <InvestmentRounds sidebar={<StartupSidebar />} />
          </div>
        </div>
      </main>
    </div>
  );
}
