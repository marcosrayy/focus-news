"use client";

import { Scale, Globe, Brain, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const ethicsTopics = [
  { title: "UE aprova AI Act com regras rigorosas para modelos fundacionais", status: "Vigente", impact: "Alto" },
  { title: "Brasil debate marco legal de IA no Senado com votacao prevista para marco", status: "Em tramite", impact: "Alto" },
  { title: "OpenAI cria comite de seguranca com veto sobre lancamentos de modelos", status: "Ativo", impact: "Medio" },
  { title: "Debate: IA deve ter personalidade juridica? Juristas divergem", status: "Discussao", impact: "Medio" },
];

const globalTrends = [
  { region: "EUA", trend: "Investimento recorde de US$ 120B em IA em 2025", growth: "+67%" },
  { region: "China", trend: "DeepSeek R2 desafia dominio ocidental em LLMs", growth: "+45%" },
  { region: "Europa", trend: "Foco em IA responsavel e soberana com Mistral", growth: "+38%" },
  { region: "Brasil", trend: "Hub de IA em SP atrai talentos e investimento global", growth: "+52%" },
];

const aiApplications = [
  { area: "Saude", example: "Diagnostico precoce de Alzheimer via IA com 95% de precisao", tag: "REAL" },
  { area: "Juridico", example: "IA reduz tempo de analise contratual de dias para minutos", tag: "REAL" },
  { area: "Financas", example: "Trading algoritmico com LLMs supera fundos tradicionais em 23%", tag: "REAL" },
];

export function IASidebarContent() {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Scale className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ETICA & REGULACAO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {ethicsTopics.map((topic) => (
            <div key={topic.title} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-violet-400/30">
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-violet-400">{topic.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-violet-400">{topic.status}</span>
                <span className="text-[10px] text-muted-foreground">&middot;</span>
                <span className={`text-[10px] font-semibold ${topic.impact === "Alto" ? "text-red-400" : "text-amber-400"}`}>Impacto {topic.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Globe className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">TENDENCIAS GLOBAIS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {globalTrends.map((trend) => (
            <div key={trend.region} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-violet-400/30">
              <div>
                <p className="text-xs font-bold text-foreground">{trend.region}</p>
                <p className="text-[10px] text-muted-foreground">{trend.trend}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-500">{trend.growth}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Sparkles className="h-4 w-4 text-violet-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">IA NA PRATICA</h3>
        </div>
        <div className="flex flex-col gap-2">
          {aiApplications.map((app) => (
            <div key={app.area} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-violet-400/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-violet-400">{app.area}</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">{app.tag}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-foreground transition-colors duration-300 group-hover:text-violet-400">{app.example}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-violet-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/20">
        EXPLORAR IA
      </button>
    </>
  );
}

export function IASidebar() {
  return (
    <SidebarCardsModal title="INTELIGÊNCIA ARTIFICIAL" items={["Ética e regulação", "Tendências globais", "IA na prática"]}>
      <IASidebarContent />
    </SidebarCardsModal>
  );
}
