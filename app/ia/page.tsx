import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroIA } from "@/components/ia/hero-ia";
import { AITools } from "@/components/ia/ai-tools";
import { IASidebar } from "@/components/ia/ia-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA - Focus News | Inteligencia Artificial, LLMs e Agentes",
  description:
    "Acompanhe os avancos em inteligencia artificial, modelos de linguagem, agentes autonomos, etica e regulacao.",
};

export default function IAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-violet-500" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              INTELIGENCIA ARTIFICIAL
            </h1>
          </div>
          <span className="rounded-full border border-violet-400/30 px-3 py-1 text-xs font-semibold text-violet-400">
            FRONTEIRA
          </span>
        </div>

        {/* Hero */}
        <HeroIA />

        {/* Main Content + Sidebar */}
        <div className="mt-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-violet-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                AVANCOS & FERRAMENTAS
              </h2>
            </div>
            <AITools sidebar={<IASidebar />} />
          </div>
        </div>
      </main>
    </div>
  );
}
