"use client";

import { Rocket, TrendingUp, Users, ArrowUpRight, Target, Lightbulb } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const activeInvestors = [
  { name: "Sequoia Capital", deals: 12, focus: "FinTech, SaaS" },
  { name: "Andreessen Horowitz", deals: 9, focus: "IA, DeepTech" },
  { name: "SoftBank Latin America", deals: 7, focus: "Marketplace, Logistica" },
  { name: "Kaszek Ventures", deals: 15, focus: "FinTech, EdTech" },
  { name: "Valor Capital", deals: 8, focus: "SaaS, HealthTech" },
];

const hotSectors = [
  { name: "FinTech", growth: "+42%", deals: 87 },
  { name: "HealthTech", growth: "+38%", deals: 53 },
  { name: "AgTech", growth: "+31%", deals: 41 },
  { name: "EdTech", growth: "+28%", deals: 35 },
  { name: "CleanTech", growth: "+25%", deals: 29 },
];

const topStartups = [
  { name: "QuintoAndar", valuation: "US$ 5.1B", sector: "PropTech", logo: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://quintoandar.com.br&size=128" },
  { name: "Creditas", valuation: "US$ 4.8B", sector: "FinTech", logo: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://creditas.com&size=128" },
  { name: "Loggi", valuation: "US$ 2.0B", sector: "LogTech", logo: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://loggi.com&size=128" },
  { name: "Wellhub", valuation: "US$ 2.4B", sector: "HealthTech", logo: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://gympass.com&size=128" },
  { name: "Alice", valuation: "US$ 800M", sector: "HealthTech", logo: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://alice.com.br&size=128" },
];

export function StartupSidebar() {
  return (
    <SidebarCardsModal title="STARTUPS" items={["Maiores startups", "Investidores ativos", "Setores em alta"]}>
      {/* Maiores Startups */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Rocket className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MAIORES STARTUPS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {topStartups.map((startup) => (
            <div key={startup.name} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-white p-0.5">
                  <img src={startup.logo} alt={startup.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{startup.name}</p>
                  <p className="text-[10px] text-muted-foreground">{startup.sector}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-amber-500">{startup.valuation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Investors */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">INVESTIDORES ATIVOS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {activeInvestors.map((investor, i) => (
            <div key={investor.name} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-blue-500/30">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 text-[9px] font-bold text-blue-500">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{investor.name}</p>
                  <p className="text-[10px] text-muted-foreground">{investor.focus}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-blue-500">{investor.deals} deals</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Sectors */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">SETORES EM ALTA</h3>
        </div>
        <div className="flex flex-col gap-2">
          {hotSectors.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-emerald-500/30">
              <div>
                <p className="text-xs font-bold text-foreground">{sector.name}</p>
                <p className="text-[10px] text-muted-foreground">{sector.deals} deals no trimestre</p>
              </div>
              <span className="text-xs font-semibold text-emerald-500">{sector.growth}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-blue-600 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20">
        VER TODAS AS RODADAS
      </button>
    </SidebarCardsModal>
  );
}
