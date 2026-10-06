"use client";

import { Suspense } from "react";
import { TrendingUp, BarChart3, Award, ArrowUpRight, Users, Briefcase } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarCardsModal, useCloseExploreModal } from "@/components/sidebar-cards-modal";

const marketLeaders = [
  { key: "fintech", name: "Nubank", sector: "FinTech", valuation: "US$ 45B", change: "+12%" },
  { key: "foodtech", name: "iFood", sector: "FoodTech", valuation: "US$ 8.5B", change: "+8%" },
  { key: "commerce", name: "VTEX", sector: "E-commerce", valuation: "US$ 3.2B", change: "+15%" },
  { key: "wellbeing", name: "Gympass", sector: "Wellbeing", valuation: "US$ 2.4B", change: "+22%" },
  { key: "payments", name: "Ebanx", sector: "Payments", valuation: "US$ 2.1B", change: "+6%" },
];

const ceoAgenda = [
  { key: "ai", topic: "Reducao de custos com IA", priority: "Alta", ceos: "78%" },
  { key: "expansion", topic: "Expansao internacional", priority: "Media", ceos: "62%" },
  { key: "mna", topic: "M&A estrategico", priority: "Alta", ceos: "54%" },
  { key: "esg", topic: "ESG e sustentabilidade", priority: "Media", ceos: "49%" },
];

const upcomingEvents = [
  { key: "events", name: "Web Summit Rio", date: "Mar 15-18", type: "Conferencia" },
  { key: "networking", name: "Latam Founders Summit", date: "Abr 8-9", type: "Networking" },
  { key: "roadshow", name: "Brazil at Silicon Valley", date: "Mai 22", type: "Roadshow" },
];

export function BusinessSidebarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const closeExplore = useCloseExploreModal();

  const applyFilter = (filterKey: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!filterKey || filterKey === "all") {
      params.delete("topic");
    } else {
      params.set("topic", filterKey);
    }
    const queryString = params.toString();
    router.push(queryString ? `/business?${queryString}` : "/business");
    closeExplore();
  };

  const currentTopic = searchParams.get("topic");

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">LIDERES DE MERCADO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {marketLeaders.map((company, i) => {
            const active = currentTopic === company.key;
            return (
              <div
                key={company.name}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                  active ? "border-amber-400/50 bg-amber-500/5" : "border-border bg-secondary/40 hover:border-amber-400/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10 text-[9px] font-bold text-amber-500">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{company.name}</p>
                    <p className="text-[10px] text-muted-foreground">{company.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-foreground">{company.valuation}</p>
                  <p className="text-[10px] font-semibold text-emerald-500">{company.change}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Briefcase className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">AGENDA DO CEO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {ceoAgenda.map((item) => (
            <div
              key={item.topic}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-amber-400/30"
            >
              <div>
                <p className="text-xs font-bold text-foreground">{item.topic}</p>
                <p className="text-[10px] text-muted-foreground">Prioridade {item.priority}</p>
              </div>
              <span className="text-xs font-semibold text-amber-400">{item.ceos}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">EVENTOS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.name}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-emerald-500/30"
            >
              <div>
                <p className="text-xs font-bold text-foreground">{event.name}</p>
                <p className="text-[10px] text-muted-foreground">{event.type}</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500">{event.date}</span>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export function BusinessSidebar() {
  return (
    <Suspense fallback={null}>
      <BusinessSidebarInner />
    </Suspense>
  );
}

function BusinessSidebarInner() {
  return (
    <SidebarCardsModal title="BUSINESS" items={["Líderes de mercado", "Agenda do CEO", "Eventos"]}>
      <BusinessSidebarContent />
    </SidebarCardsModal>
  );
}
