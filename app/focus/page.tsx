import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { MarketTicker } from "@/components/market-ticker";
import { FocusEventsTicker } from "@/components/focus/focus-events-ticker";
import { HeroFocus } from "@/components/focus/hero-focus";
import { ImpactFocus } from "@/components/focus/impact-focus";
import { UpcomingEvents } from "@/components/focus/upcoming-events";
import { WorkshopsTrainings } from "@/components/focus/workshops-trainings";
import { FocusTimeline } from "@/components/focus/focus-timeline";
import { FocusGallery } from "@/components/focus/focus-gallery";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus - Hub Institucional | Focus News",
  description:
    "O hub oficial da Focus: noticias internas, eventos, workshops, treinamentos, lancamentos, parcerias e projetos especiais.",
};

export default function FocusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <MarketTicker />
      <FocusEventsTicker />

      <main className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        {/* Page Title */}
        <div className="mb-4 flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-primary" />
            <h1 className="font-heading text-xl font-bold tracking-wider text-foreground lg:text-2xl">
              FOCUS
            </h1>
          </div>
        </div>

        <div className="mb-1 flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h2 className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-primary sm:text-sm">
            Novidades da Focus
          </h2>
        </div>
        <HeroFocus />

        {/* Proximos Eventos */}
        <div className="mt-8">
          <UpcomingEvents />
        </div>

        {/* Workshops & Treinamentos */}
        <div className="mt-8">
          <WorkshopsTrainings />
        </div>

        {/* Impacto Focus - Dashboard */}
        <div className="mt-8">
          <ImpactFocus />
        </div>

        {/* Timeline + Galeria side by side on desktop */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[45%]">
            <FocusTimeline />
          </div>
          <div className="lg:w-[55%]">
            <FocusGallery />
          </div>
        </div>
      </main>
    </div>
  );
}
