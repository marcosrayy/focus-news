"use client";

import { useEffect, useState } from "react";

interface Sector {
  name: string;
  change: number;
  weight: number;
}

const initialSectors: Sector[] = [
  { name: "Tecnologia", change: 2.85, weight: 4 },
  { name: "Financeiro", change: -0.42, weight: 3 },
  { name: "Energia", change: 1.23, weight: 3 },
  { name: "Saude", change: -1.68, weight: 2 },
  { name: "Consumo", change: 0.95, weight: 2 },
  { name: "Industrial", change: -0.31, weight: 2 },
  { name: "Materiais", change: 1.45, weight: 2 },
  { name: "Telecom", change: -2.12, weight: 1 },
  { name: "Utilidades", change: 0.56, weight: 1 },
  { name: "Imobiliario", change: -0.78, weight: 1 },
];

function getHeatColor(change: number): string {
  if (change >= 2) return "bg-emerald-600";
  if (change >= 1) return "bg-emerald-600/70";
  if (change >= 0) return "bg-emerald-600/40";
  if (change >= -1) return "bg-red-600/40";
  if (change >= -2) return "bg-red-600/70";
  return "bg-red-600";
}

export function SectorHeatmap() {
  const [sectors, setSectors] = useState(initialSectors);

  useEffect(() => {
    const interval = setInterval(() => {
      setSectors((prev) =>
        prev.map((s) => ({
          ...s,
          change: parseFloat((s.change + (Math.random() * 1 - 0.5)).toFixed(2)),
        }))
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
          MAPA DE CALOR - SETORES
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-600" />
            Alta
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-600" />
            Baixa
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {sectors.map((sector) => (
          <div
            key={sector.name}
            className={`${getHeatColor(sector.change)} flex flex-col items-center justify-center rounded-xl p-3 transition-all duration-500 lg:p-4`}
          >
            <span className="text-[10px] font-semibold text-foreground/90">
              {sector.name}
            </span>
            <span className="mt-1 font-heading text-sm font-bold tabular-nums text-foreground">
              {sector.change >= 0 ? "+" : ""}{sector.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
