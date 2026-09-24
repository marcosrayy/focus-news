"use client";

import { Rocket, Users, Award, Building, Zap, Globe, Code } from "lucide-react";

const milestones = [
  {
    year: "2026",
    date: "Jan 2026",
    title: "Focus AI Assistant - Lancamento SaaS",
    description: "Lancamento do primeiro produto SaaS de IA da Focus, com 15 clientes beta no primeiro mes.",
    icon: Zap,
    highlight: true,
  },
  {
    year: "2025",
    date: "Nov 2025",
    title: "100 Empresas Atendidas",
    description: "Marco historico: Focus alcanca a marca de 100 empresas atendidas em tecnologia e automacao.",
    icon: Building,
    highlight: false,
  },
  {
    year: "2025",
    date: "Ago 2025",
    title: "Parceria com AWS",
    description: "Focus torna-se parceira oficial da Amazon Web Services no programa de startups do Nordeste.",
    icon: Globe,
    highlight: false,
  },
  {
    year: "2025",
    date: "Mai 2025",
    title: "Expansao da Equipe - 50 Colaboradores",
    description: "Equipe quintuplica de tamanho com contratacoes nas areas de desenvolvimento, IA e design.",
    icon: Users,
    highlight: false,
  },
  {
    year: "2024",
    date: "Set 2024",
    title: "Primeiro Workshop Focus Labs",
    description: "Inicio do programa educacional com workshops gratuitos sobre IA e automacao para a comunidade.",
    icon: Award,
    highlight: false,
  },
  {
    year: "2024",
    date: "Mar 2024",
    title: "Primeiro Grande Contrato",
    description: "Focus fecha primeiro contrato enterprise com grande varejista do Nordeste para transformacao digital.",
    icon: Rocket,
    highlight: false,
  },
  {
    year: "2023",
    date: "Jun 2023",
    title: "Fundacao da Focus",
    description: "Nasce a Focus com a missao de transformar negocios atraves de tecnologia, automacao e inovacao.",
    icon: Code,
    highlight: true,
  },
];

export function FocusTimeline() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          LINHA DO TEMPO
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 hidden h-full w-px bg-border sm:block" />

        <div className="flex flex-col gap-6">
          {milestones.map((ms, i) => {
            const Icon = ms.icon;
            return (
              <div key={ms.title} className="group relative flex gap-4 sm:gap-6">
                {/* Icon circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:shadow-lg ${
                    ms.highlight
                      ? "border-primary bg-primary/20 shadow-primary/20 group-hover:shadow-primary/30"
                      : "border-border bg-card group-hover:border-primary/40"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${ms.highlight ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                </div>

                {/* Content */}
                <div
                  className={`flex flex-1 flex-col gap-1.5 rounded-xl border p-4 transition-all duration-300 group-hover:shadow-md ${
                    ms.highlight
                      ? "border-primary/30 bg-primary/5 group-hover:shadow-primary/10"
                      : "border-border bg-card group-hover:border-primary/30 group-hover:shadow-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {ms.date}
                    </span>
                    {ms.highlight && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">
                        MARCO
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                    {ms.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {ms.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
