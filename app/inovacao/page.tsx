import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroInovacao } from "@/components/inovacao/hero-inovacao";
import { InnovationCases } from "@/components/inovacao/innovation-cases";
import { InovacaoSidebar } from "@/components/inovacao/inovacao-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inovacao - Focus News | Casos Inspiradores e Modelos Inovadores",
  description:
    "Descubra casos inspiradores, modelos de negocios inovadores, entrevistas com fundadores e o futuro em construcao.",
};

export default function InovacaoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />

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
        <HeroInovacao />

        {/* Main Content + Sidebar */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-[68%]">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-cyan-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground uppercase">
                Últimas Notícias
              </h2>
            </div>
            <InnovationCases />
          </div>
          <div className="lg:w-[32%]">
            <InovacaoSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
