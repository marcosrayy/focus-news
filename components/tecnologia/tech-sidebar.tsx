"use client";

import { Cpu, Brain, Cloud, Shield, Blocks, Zap, ArrowRight } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const categories = [
  { name: "Inteligencia Artificial", icon: <Brain className="h-4 w-4" />, count: 45, color: "text-violet-400" },
  { name: "Cloud Computing", icon: <Cloud className="h-4 w-4" />, count: 32, color: "text-sky-400" },
  { name: "Ciberseguranca", icon: <Shield className="h-4 w-4" />, count: 28, color: "text-red-400" },
  { name: "Blockchain & Web3", icon: <Blocks className="h-4 w-4" />, count: 19, color: "text-amber-400" },
  { name: "Hardware & Chips", icon: <Cpu className="h-4 w-4" />, count: 15, color: "text-sky-400" },
];

const comparisons = [
  { title: "M4 Ultra vs Snapdragon X Elite", views: "12.4K", tag: "PROCESSADORES" },
  { title: "AWS vs Azure vs GCP 2026", views: "9.8K", tag: "CLOUD" },
  { title: "GPT-5 vs Claude 4 vs Gemini 2", views: "18.2K", tag: "IA" },
];

const deepAnalysis = [
  { title: "O futuro da computacao quantica: onde estamos em 2026", author: "Dr. Ana Beatriz", readTime: "12 min" },
  { title: "Como a IA generativa esta transformando o desenvolvimento de software", author: "Marcos Vieira", readTime: "8 min" },
  { title: "Edge Computing: a proxima revolucao apos a nuvem", author: "Carolina Matos", readTime: "10 min" },
];

export function TechSidebarContent() {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
            <Cpu className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CATEGORIAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div key={cat.name} className="group flex cursor-pointer items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-sky-400/30">
              <div className="flex items-center gap-2.5">
                <span className={cat.color}>{cat.icon}</span>
                <span className="text-xs font-semibold text-foreground">{cat.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{cat.count} artigos</span>
                <ArrowRight className="h-3 w-3 text-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">COMPARATIVOS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {comparisons.map((comp) => (
            <div key={comp.title} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-sky-400/30">
              <span className="mb-1 inline-block text-[9px] font-bold tracking-wider text-sky-400">{comp.tag}</span>
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{comp.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{comp.views} visualizacoes</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
            <Brain className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ANALISES PROFUNDAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {deepAnalysis.map((item) => (
            <div key={item.title} className="group cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-sky-400/30">
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{item.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{item.author}</span>
                <span className="text-[10px] text-muted-foreground">&middot;</span>
                <span className="text-[10px] text-sky-400">{item.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-sky-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/20">
        EXPLORAR TECNOLOGIA
      </button>
    </>
  );
}

export function TechSidebar() {
  return (
    <SidebarCardsModal title="TECNOLOGIA" items={["Categorias", "Comparativos", "Análises profundas"]}>
      <TechSidebarContent />
    </SidebarCardsModal>
  );
}
