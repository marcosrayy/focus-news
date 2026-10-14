"use client";

import { GraduationCap, Users, Calendar, ExternalLink, MapPin } from "lucide-react";
import { getDistinctCover } from "@/lib/utils";

const tagColors: Record<string, string> = {
  Marketing: "bg-pink-600/20 text-pink-400 dark:bg-pink-600/20 dark:text-pink-400",
  IA: "bg-primary/20 text-primary",
  Automacao: "bg-emerald-600/20 text-emerald-500 dark:text-emerald-400",
  Desenvolvimento: "bg-blue-600/20 text-blue-500 dark:text-blue-400",
  Growth: "bg-amber-600/20 text-amber-500 dark:text-amber-400",
};

const workshops = [
  {
    title: "De zero ao MVP",
    image: "/workshop.jpg",
    type: "Workshop",
    date: "05 out 2026",
    location: "Fortaleza, CE",
    participants: 10,
    tags: ["Desenvolvimento", "Tecnologia"],
    status: "Realizado",
  },
  {
    title: "Automacao de Processos com N8N e Zapier",
    image: getDistinctCover("workshop-automation"),
    type: "Treinamento Corporativo",
    date: "05 Fev 2026",
    location: "São Paulo, SP",
    participants: 32,
    tags: ["Automacao", "Growth"],
    status: "Realizado",
  },
  {
    title: "Desenvolvimento Full-Stack com Next.js 16",
    image: getDistinctCover("workshop-full-stack"),
    type: "Capacitacao Interna",
    date: "12 Fev 2026",
    location: "Fortaleza, CE",
    participants: 24,
    tags: ["Desenvolvimento"],
    status: "Realizado",
  },
];

export function WorkshopsTrainings() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          WORKSHOPS & TREINAMENTOS
        </h2>
        <GraduationCap className="ml-1 h-4 w-4 text-primary" />
      </div>

      <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workshops.map((ws) => (
          <article
            key={ws.title}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={ws.image}
                alt={ws.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                  {ws.type}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    ws.status === "Realizado"
                      ? "bg-muted text-muted-foreground"
                      : ws.status === "Inscricoes Abertas"
                        ? "bg-emerald-600/20 text-emerald-500 dark:text-emerald-400"
                        : "bg-primary/20 text-primary"
                  }`}
                >
                  {ws.status}
                </span>
              </div>

              <h3 className="font-heading text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {ws.title}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {ws.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${tagColors[tag] || "bg-secondary text-muted-foreground"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[11px]">{ws.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[11px]">{ws.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="text-[11px]">{ws.participants} participantes</span>
                  </div>
                </div>
                {ws.status === "Inscricoes Abertas" && (
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
