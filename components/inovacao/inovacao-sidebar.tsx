"use client";

import { Suspense } from "react";
import { Mic, Sparkles, Lightbulb, ArrowRight, Globe } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const founderInterviews = [
  { key: "cleantech", name: "Maria Fernanda", company: "SolarPure", topic: "Dessalinizacao solar", tag: "CleanTech" },
  { key: "biotech", name: "Joao Victor", company: "NeuroBridge", topic: "Interface cerebro-computador", tag: "BioTech" },
  { key: "agtech", name: "Camila Dias", company: "UrbanFarm AI", topic: "Agricultura vertical com IA", tag: "AgTech" },
  { key: "edtech", name: "Rafael Gomes", company: "EduVR", topic: "Realidade virtual educacional", tag: "EdTech" },
];

const innovativeModels = [
  { key: "cooperativism", name: "Platform Cooperativism", description: "Cooperativas digitais de propriedade dos usuarios", trend: "Em alta" },
  { key: "impact-as-service", name: "Impact-as-a-Service", description: "Modelos de receita atrelados a impacto social", trend: "Emergente" },
  { key: "open-hardware", name: "Open Hardware", description: "Hardware de codigo aberto para democratizar tecnologia", trend: "Crescendo" },
];

const futureBuilding = [
  { key: "urbanismo", title: "Cidades inteligentes: o modelo brasileiro de Ubatuba", category: "URBANISMO", readTime: "10 min" },
  { key: "sustentabilidade", title: "Bioeconomia na Amazonia: startups que geram valor sem desmatar", category: "SUSTENTABILIDADE", readTime: "15 min" },
  { key: "educacao", title: "Educacao 5.0: como a IA personaliza o ensino publico", category: "EDUCACAO", readTime: "8 min" },
];

export function InovacaoSidebarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilter = (filterKey: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!filterKey || filterKey === "all") {
      params.delete("topic");
    } else {
      params.set("topic", filterKey);
    }
    const queryString = params.toString();
    router.push(queryString ? `/inovacao?${queryString}` : "/inovacao");
  };

  const currentTopic = searchParams.get("topic");

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Mic className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ENTREVISTAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {founderInterviews.map((interview) => (
            <button
              key={interview.name}
              type="button"
              onClick={() => applyFilter(interview.key)}
              className={`group w-full cursor-pointer rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                currentTopic === interview.key ? "border-cyan-400/50 bg-cyan-500/5" : "border-border bg-secondary/40 hover:border-cyan-400/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-400">{interview.name}</p>
                  <p className="text-[10px] text-muted-foreground">{interview.company} &middot; {interview.topic}</p>
                </div>
                <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">{interview.tag}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MODELOS INOVADORES</h3>
        </div>
        <div className="flex flex-col gap-2">
          {innovativeModels.map((model) => (
            <button
              key={model.name}
              type="button"
              onClick={() => applyFilter(model.key)}
              className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-cyan-400/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">{model.name}</p>
                <span className="text-[10px] font-semibold text-cyan-400">{model.trend}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{model.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">FUTURO EM CONSTRUCAO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {futureBuilding.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => applyFilter(item.key)}
              className="group w-full cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-cyan-400/30"
            >
              <span className="mb-0.5 inline-block text-[9px] font-bold tracking-wider text-cyan-400">{item.category}</span>
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-400">{item.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{item.readTime} de leitura</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => applyFilter("all")}
        className="w-full rounded-xl bg-cyan-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        EXPLORAR INOVACOES
      </button>
    </>
  );
}

export function InovacaoSidebar() {
  return (
    <Suspense fallback={null}>
      <InovacaoSidebarInner />
    </Suspense>
  );
}

function InovacaoSidebarInner() {
  return (
    <SidebarCardsModal title="INOVAÇÃO" items={["Entrevistas", "Modelos inovadores", "Futuro em construção"]}>
      <InovacaoSidebarContent />
    </SidebarCardsModal>
  );
}
