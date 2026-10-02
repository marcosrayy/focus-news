"use client";

import { Suspense } from "react";
import { Cpu, Brain, Cloud, Shield, Blocks, Zap, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const categories = [
  { key: "ai", name: "Inteligencia Artificial", icon: <Brain className="h-4 w-4" />, count: 45, color: "text-violet-400", query: "Inteligencia Artificial OR IA OR ChatGPT OR OpenAI OR LLM" },
  { key: "cloud", name: "Cloud Computing", icon: <Cloud className="h-4 w-4" />, count: 32, color: "text-sky-400", query: "Cloud Computing OR AWS OR Azure OR GCP OR Kubernetes" },
  { key: "cyber", name: "Ciberseguranca", icon: <Shield className="h-4 w-4" />, count: 28, color: "text-red-400", query: "Ciberseguranca OR Cybersecurity OR segurança digital OR ransomware" },
  { key: "web3", name: "Blockchain & Web3", icon: <Blocks className="h-4 w-4" />, count: 19, color: "text-amber-400", query: "Blockchain OR Web3 OR cripto OR Ethereum OR Bitcoin" },
  { key: "hardware", name: "Hardware & Chips", icon: <Cpu className="h-4 w-4" />, count: 15, color: "text-sky-400", query: "Hardware OR chip OR processador OR GPU OR CPU OR smartphone" },
];

const comparisons = [
  { key: "m4-vs-snapdragon", title: "M4 Ultra vs Snapdragon X Elite", views: "12.4K", tag: "PROCESSADORES", query: "M4 Ultra OR Snapdragon X Elite OR processadores" },
  { key: "cloud-compare", title: "AWS vs Azure vs GCP 2026", views: "9.8K", tag: "CLOUD", query: "AWS OR Azure OR GCP OR Cloud Computing" },
  { key: "ai-models", title: "GPT-5 vs Claude 4 vs Gemini 2", views: "18.2K", tag: "IA", query: "GPT-5 OR Claude 4 OR Gemini 2 OR IA generativa" },
];

const deepAnalysis = [
  { key: "quantum", title: "O futuro da computacao quantica: onde estamos em 2026", author: "Dr. Ana Beatriz", readTime: "12 min", query: "computacao quantica OR quantum computing" },
  { key: "ai-dev", title: "Como a IA generativa esta transformando o desenvolvimento de software", author: "Marcos Vieira", readTime: "8 min", query: "IA generativa OR desenvolvimento de software OR copilots" },
  { key: "edge", title: "Edge Computing: a proxima revolucao apos a nuvem", author: "Carolina Matos", readTime: "10 min", query: "edge computing OR computacao em periferia" },
];

export function TechSidebarContent() {
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
    router.push(queryString ? `/tecnologia?${queryString}` : "/tecnologia");
  };

  const currentTopic = searchParams.get("topic");

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
          {categories.map((cat) => {
            const active = currentTopic === cat.key;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => applyFilter(cat.key)}
                className={`group flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                  active ? "border-sky-400/50 bg-sky-500/5" : "border-border bg-secondary/40 hover:border-sky-400/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cat.color}>{cat.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{cat.count} artigos</span>
                  <ArrowRight className={`h-3 w-3 text-sky-400 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </div>
              </button>
            );
          })}
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
            <button
              key={comp.title}
              type="button"
              onClick={() => applyFilter(comp.key)}
              className="group w-full cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-sky-400/30"
            >
              <span className="mb-1 inline-block text-[9px] font-bold tracking-wider text-sky-400">{comp.tag}</span>
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{comp.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{comp.views} visualizacoes</p>
            </button>
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
            <button
              key={item.title}
              type="button"
              onClick={() => applyFilter(item.key)}
              className="group w-full cursor-pointer rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-left transition-all duration-300 hover:border-sky-400/30"
            >
              <p className="text-xs font-bold text-foreground transition-colors duration-300 group-hover:text-sky-400">{item.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{item.author}</span>
                <span className="text-[10px] text-muted-foreground">&middot;</span>
                <span className="text-[10px] text-sky-400">{item.readTime}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => applyFilter("all")}
        className="w-full rounded-xl bg-sky-500 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/20"
      >
        EXPLORAR TECNOLOGIA
      </button>
    </>
  );
}

export function TechSidebar() {
  return (
    <Suspense fallback={null}>
      <TechSidebarInner />
    </Suspense>
  );
}

function TechSidebarInner() {
  return (
    <SidebarCardsModal title="TECNOLOGIA" items={["Categorias", "Comparativos", "Análises profundas"]}>
      <TechSidebarContent />
    </SidebarCardsModal>
  );
}
