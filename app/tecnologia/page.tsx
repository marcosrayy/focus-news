import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroTech } from "@/components/tecnologia/hero-tech";
import { TrendingTech } from "@/components/tecnologia/trending-tech";
import { TechSidebar } from "@/components/tecnologia/tech-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tecnologia - Focus News | Lancamentos, Tendencias e Analises",
  description:
    "Acompanhe lancamentos, tendencias emergentes, analises profundas e comparativos no mundo da tecnologia.",
};

export default function TecnologiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-sky-500" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              TECNOLOGIA
            </h1>
          </div>
          <span className="rounded-full border border-sky-400/30 px-3 py-1 text-xs font-semibold text-sky-400">
            TENDENCIAS
          </span>
        </div>

        {/* Hero */}
        <HeroTech />

        {/* Main Content + Sidebar */}
        <div className="mt-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-sky-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                ULTIMAS EM TECNOLOGIA
              </h2>
            </div>
            <TrendingTech sidebar={<TechSidebar />} />
          </div>
        </div>
      </main>
    </div>
  );
}
