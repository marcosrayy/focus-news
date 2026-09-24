"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Bitcoin } from "lucide-react";

interface SummaryCard {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  sparkline: number[];
}

const fallbackSparkline = [48, 52, 49, 55, 51, 58, 54, 61, 57, 64, 60, 66];

const initialCards: SummaryCard[] = [
  { label: "IBOVESPA", value: "181.363", change: -0.97, icon: BarChart3, sparkline: fallbackSparkline },
  { label: "DOLAR", value: "5,22", change: 0.66, icon: DollarSign, prefix: "R$", sparkline: fallbackSparkline },
  { label: "BITCOIN", value: "97.452", change: 2.34, icon: Bitcoin, prefix: "$", sparkline: fallbackSparkline },
  { label: "SELIC", value: "13,25", change: 0, icon: Activity, prefix: "", sparkline: fallbackSparkline },
];

function MiniMarketChart({ label, values, isPositive }: { label: string; values: number[]; isPositive: boolean }) {
  const width = 180;
  const height = 54;
  const padding = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `${padding},${height} ${points} ${width - padding},${height}`;
  const color = isPositive ? "#10b981" : "#ef4444";
  const gradientId = `market-area-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div className="mt-5 w-full" aria-label={`Gráfico intradiário de ${label}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full overflow-visible" role="img">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="market-sparkline-line"
        />
      </svg>
    </div>
  );
}

export function MarketSummaryCards() {
  const [cards, setCards] = useState(initialCards);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/economia-page');
      const data = await res.json();
      if (data.summary) {
        setCards((prev) =>
          prev.map((c) => {
            if (c.label === "SELIC") return c; // keep SELIC mock
            const item = data.summary.find((x: any) => x.id === c.label);
            if (item) {
              const newVal = item.priceNum;
              const formattedVal = item.id === "IBOVESPA" 
                  ? newVal.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) 
                  : item.id === "BITCOIN" ? newVal.toLocaleString("en-US", { maximumFractionDigits: 0 }) 
                  : newVal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              return {
                ...c,
                value: formattedVal,
                change: item.changeNum,
                sparkline: item.sparkline?.length > 1 ? item.sparkline : c.sparkline,
              };
            }
            return c;
          })
        );
        // Flash random card just to keep the feeling of live updates if wanted, or just flash changed ones
        setFlashIdx(Math.floor(Math.random() * 3));
        setTimeout(() => setFlashIdx(null), 600);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  return (
    <div className="grid h-full grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        return (
          <div
            key={card.label}
            className={`flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-all duration-500 lg:p-5 ${
              flashIdx === i
                ? isPositive
                  ? "border-emerald-500/40 shadow-md shadow-emerald-500/10"
                  : "border-red-500/40 shadow-md shadow-red-500/10"
                : "hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="mt-5 text-center text-[10px] font-semibold tracking-wider text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-center font-heading text-xl font-bold tabular-nums text-foreground lg:text-2xl">
              {card.prefix}{card.value}
            </p>
            <MiniMarketChart label={card.label} values={card.sparkline} isPositive={isPositive} />
            <div className={`mt-auto inline-flex items-center gap-1 self-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
              isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {isPositive ? "+" : ""}{card.change.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
