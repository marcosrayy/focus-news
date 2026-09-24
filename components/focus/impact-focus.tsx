"use client";

import { useEffect, useState, useRef } from "react";
import { Building, Calendar, GraduationCap, FolderCheck } from "lucide-react";

const metrics = [
  { label: "Empresas Atendidas", value: 127, suffix: "+", icon: Building },
  { label: "Eventos Participados", value: 48, suffix: "", icon: Calendar },
  { label: "Alunos Treinados", value: 1240, suffix: "+", icon: GraduationCap },
  { label: "Projetos Entregues", value: 312, suffix: "+", icon: FolderCheck },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-bold tabular-nums text-foreground lg:text-4xl">
      {count.toLocaleString("pt-BR")}
      {suffix && <span className="text-primary">{suffix}</span>}
    </div>
  );
}

export function ImpactFocus() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-1 rounded-full bg-primary" />
        <h2 className="font-heading text-sm font-bold tracking-wider text-foreground">
          IMPACTO FOCUS
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Glow effect */}
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />

              <div className="relative flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <AnimatedNumber target={metric.value} suffix={metric.suffix} />
                <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                  {metric.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
