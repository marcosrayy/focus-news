import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { HeroDev } from "@/components/dev/hero-dev";
import { FrameworkNews } from "@/components/dev/framework-news";
import { DevSidebar } from "@/components/dev/dev-sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev - Focus News | Desenvolvimento, Frameworks e Tutoriais",
  description:
    "Artigos tecnicos, tutoriais, noticias de frameworks e ferramentas para desenvolvedores.",
};

export default function DevPage() {
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
              DEV
            </h1>
          </div>
          <span className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-400">
            PARA DEVS
          </span>
        </div>

        {/* Hero */}
        <HeroDev />

        {/* Main Content + Sidebar */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-[68%]">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-emerald-500" />
              <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
                FRAMEWORKS & FERRAMENTAS
              </h2>
            </div>
            <FrameworkNews />
          </div>
          <div className="lg:w-[32%]">
            <DevSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
