"use client";

import { Mic, Sparkles, Lightbulb, ArrowRight, Globe } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const founderInterviews = [
  { name: "Maria Fernanda", company: "SolarPure", topic: "Dessalinizacao solar", tag: "CleanTech" },
  { name: "Joao Victor", company: "NeuroBridge", topic: "Interface cerebro-computador", tag: "BioTech" },
  { name: "Camila Dias", company: "UrbanFarm AI", topic: "Agricultura vertical com IA", tag: "AgTech" },
  { name: "Rafael Gomes", company: "EduVR", topic: "Realidade virtual educacional", tag: "EdTech" },
];

const innovativeModels = [
  { name: "Platform Cooperativism", description: "Cooperativas digitais de propriedade dos usuarios", trend: "Em alta" },
  { name: "Impact-as-a-Service", description: "Modelos de receita atrelados a impacto social", trend: "Emergente" },
  { name: "Open Hardware", description: "Hardware de codigo aberto para democratizar tecnologia", trend: "Crescendo" },
];

const futureBuilding = [
  { title: "Cidades inteligentes: o modelo brasileiro de Ubatuba", category: "URBANISMO", readTime: "10 min" },
  { title: "Bioeconomia na Amazonia: startups que geram valor sem desmatar", category: "SUSTENTABILIDADE", readTime: "15 min" },
  { title: "Educacao 5.0: como a IA personaliza o ensino publico", category: "EDUCACAO", readTime: "8 min" },
];

export function InovacaoSidebar() {
  return (
    <SidebarCardsModal title="INOVAÇÃO" items={["Entrevistas", "Modelos inovadores", "Futuro em construção"]}>
      {/* Founder Interviews */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Mic className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ENTREVISTAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {founderInterviews.map((interview) => (
            <div key={interview.name} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-cyan-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-400">{interview.name}</p>
                  <p className="text-[10px] text-muted-foreground">{interview.company} &middot; {interview.topic}</p>
                </div>
                <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">{interview.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Innovative Models */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MODELOS INOVADORES</h3>
        </div>
        <div className="flex flex-col gap-2">
          {innovativeModels.map((model) => (
            <div key={model.name} className="rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-cyan-400/30">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">{model.name}</p>
                <span className="text-[10px] font-semibold text-cyan-400">{model.trend}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Futuro em Construcao */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">FUTURO EM CONSTRUCAO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {futureBuilding.map((item) => (
            <div key={item.title} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-cyan-400/30">
              <span className="mb-0.5 inline-block text-[9px] font-bold tracking-wider text-cyan-400">{item.category}</span>
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-cyan-400">{item.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{item.readTime} de leitura</p>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-cyan-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20">
        EXPLORAR INOVACOES
      </button>
    </SidebarCardsModal>
  );
}
