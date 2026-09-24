"use client";

import { Calendar, GraduationCap } from "lucide-react";

const focusEvents = [
  { type: "evento", label: "TEDx Fortaleza 2026 - Palestra sobre IA e Automacao", date: "15 Mar" },
  { type: "workshop", label: "Workshop: React Avancado com Next.js 16", date: "22 Mar" },
  { type: "evento", label: "Focus Summit 2026 - Inovacao e Tecnologia", date: "05 Abr" },
  { type: "workshop", label: "Treinamento: Cloud Computing com AWS", date: "12 Abr" },
  { type: "evento", label: "Hackathon Focus - IA Generativa Aplicada", date: "19 Abr" },
  { type: "workshop", label: "Workshop: UX Research e Design Thinking", date: "28 Abr" },
  { type: "evento", label: "Meetup Focus - Comunidade de Desenvolvedores", date: "03 Mai" },
  { type: "workshop", label: "Treinamento: Lideranca e Gestao de Produtos", date: "10 Mai" },
];

export function FocusEventsTicker() {
  return (
    <div className="flex items-center gap-4 overflow-hidden border-b border-border bg-background/50 px-4 py-2">
      <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
        <Calendar className="h-3 w-3" />
        AGENDA
      </span>
      <div className="relative overflow-hidden">
        <div className="flex animate-news whitespace-nowrap">
          {[...focusEvents, ...focusEvents].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 px-4 text-xs text-muted-foreground lg:text-sm"
            >
              <span className="text-primary/40">{"â¢"}</span>
              {item.type === "workshop" ? (
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              ) : (
                <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              )}
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                {item.date}
              </span>
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
