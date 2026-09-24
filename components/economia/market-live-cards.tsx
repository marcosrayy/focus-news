"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, Rocket, AlertTriangle } from "lucide-react";

interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  type: "stock" | "crypto" | "index";
  sparkline: number[];
}

// Static initial sparklines to avoid hydration mismatch
const staticSparklines: Record<string, number[]> = {
  AAPL: [45, 48, 42, 55, 52, 58, 54, 60, 56, 62, 58, 65],
  MSFT: [50, 47, 52, 48, 55, 51, 58, 54, 50, 53, 49, 52],
  NVDA: [40, 45, 50, 55, 52, 60, 65, 70, 68, 75, 72, 78],
  GOOGL: [55, 52, 48, 50, 46, 48, 44, 46, 42, 45, 41, 43],
  BTC: [50, 55, 58, 52, 60, 65, 62, 68, 72, 70, 75, 78],
  ETH: [48, 52, 55, 50, 58, 62, 58, 65, 68, 65, 70, 72],
  NASDAQ: [50, 52, 55, 58, 55, 60, 62, 58, 65, 68, 65, 70],
  "S&P500": [52, 54, 56, 55, 58, 60, 58, 62, 64, 62, 65, 67],
};

const initialAssets: Asset[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 228.45, change: 1.45, volume: "58.2M", marketCap: "$3.52T", type: "stock", sparkline: staticSparklines.AAPL },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.10, change: -0.23, volume: "22.1M", marketCap: "$3.08T", type: "stock", sparkline: staticSparklines.MSFT },
  { symbol: "NVDA", name: "Nvidia Corp.", price: 132.80, change: 4.12, volume: "312.5M", marketCap: "$3.26T", type: "stock", sparkline: staticSparklines.NVDA },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 178.40, change: -1.85, volume: "24.7M", marketCap: "$2.19T", type: "stock", sparkline: staticSparklines.GOOGL },
  { symbol: "BTC", name: "Bitcoin", price: 97452.30, change: 2.34, volume: "32.1B", marketCap: "$1.91T", type: "crypto", sparkline: staticSparklines.BTC },
  { symbol: "ETH", name: "Ethereum", price: 3842.15, change: 1.89, volume: "18.4B", marketCap: "$462B", type: "crypto", sparkline: staticSparklines.ETH },
  { symbol: "NASDAQ", name: "NASDAQ Composite", price: 19478.50, change: 1.23, volume: "â", marketCap: "â", type: "index", sparkline: staticSparklines.NASDAQ },
  { symbol: "S&P500", name: "S&P 500 Index", price: 6012.30, change: 0.54, volume: "â", marketCap: "â", type: "index", sparkline: staticSparklines["S&P500"] },
];

function Sparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const width = 80;
  const height = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${isPositive ? "up" : "down"}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${isPositive ? "up" : "down"})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketLiveCards() {
  const [assets, setAssets] = useState(initialAssets);
  const [flashingCards, setFlashingCards] = useState<Record<string, "up" | "down" | null>>({});

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/economy');
      const data = await res.json();
      if (data.assets && data.assets.length > 0) {
        setAssets((prev) => {
          const updated = prev.map((asset) => {
            const fetched = data.assets.find((a: any) => a.symbol === asset.symbol);
            if (fetched) {
              const oldPrice = asset.price;
              const newPrice = fetched.price;
              const newSparkline = [...asset.sparkline.slice(1), newPrice >= oldPrice ? asset.sparkline[asset.sparkline.length - 1] + (Math.random() * 5) : asset.sparkline[asset.sparkline.length - 1] - (Math.random() * 5)];
              return {
                ...asset,
                price: parseFloat(fetched.price.toFixed(2)),
                change: parseFloat(fetched.change.toFixed(2)),
                volume: fetched.volume,
                sparkline: newSparkline,
              };
            }
            return asset;
          });

          const newFlash: Record<string, "up" | "down" | null> = {};
          updated.forEach((a, i) => {
            if (a.price !== prev[i].price) {
              newFlash[a.symbol] = a.price >= prev[i].price ? "up" : "down";
            }
          });
          setFlashingCards(newFlash);
          return updated;
        });
        setTimeout(() => setFlashingCards({}), 1000);
      }
    } catch (err) {
      console.error("Failed to fetch economy assets", err);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    const interval = setInterval(fetchAssets, 60000);
    return () => clearInterval(interval);
  }, [fetchAssets]);

  const topGainer = assets.reduce((a, b) => (a.change > b.change ? a : b));
  const topLoser = assets.reduce((a, b) => (a.change < b.change ? a : b));

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-primary">
            Market Live
          </h2>
          <span className="text-xs text-muted-foreground">
            Mercado financeiro em tempo real
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-bold text-red-500">LIVE</span>
        </div>
      </div>

      {/* Market Movement Highlight */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
            <Rocket className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">Alta do Dia</p>
            <p className="text-sm font-bold text-foreground">{topGainer.symbol} <span className="text-emerald-500">+{topGainer.change.toFixed(2)}%</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-red-500">Queda do Dia</p>
            <p className="text-sm font-bold text-foreground">{topLoser.symbol} <span className="text-red-500">{topLoser.change.toFixed(2)}%</span></p>
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((asset) => {
          const isPositive = asset.change >= 0;
          const isFlashing = flashingCards[asset.symbol];
          const priceChangeValue = (asset.price * (asset.change / 100)).toFixed(2);
          const isHighVolatility = Math.abs(asset.change) > 3;

          return (
            <div
              key={asset.symbol}
              className={`
                relative overflow-hidden rounded-xl border bg-card p-4 transition-all duration-500
                ${isFlashing === "up" ? "border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]" : ""}
                ${isFlashing === "down" ? "border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)]" : ""}
                ${!isFlashing ? "border-border hover:border-primary/30" : ""}
              `}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${
                isFlashing === "up" ? "bg-gradient-to-br from-emerald-500/20 to-transparent" : ""
              } ${isFlashing === "down" ? "bg-gradient-to-br from-red-500/20 to-transparent" : ""}`} />

              {/* Header */}
              <div className="relative mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">{asset.symbol}</span>
                    {isHighVolatility && (
                      <span className={`animate-pulse rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                        isPositive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        {isPositive ? "ALTA" : "QUEDA"}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{asset.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                  </span>
                  <span className="text-[8px] font-semibold text-red-500">LIVE</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="relative mb-3">
                <p className={`font-heading text-2xl font-bold tabular-nums transition-all duration-300 ${
                  isFlashing ? (isFlashing === "up" ? "text-emerald-500" : "text-red-500") : "text-foreground"
                }`}>
                  {asset.type === "crypto" && asset.symbol === "BTC" 
                    ? `$${Math.round(asset.price).toLocaleString("en-US")}`
                    : `$${asset.price.toFixed(2)}`
                  }
                </p>
                <div className={`flex items-center gap-1.5 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span className="text-sm font-semibold tabular-nums">
                    {isPositive ? "+" : ""}{asset.change.toFixed(2)}%
                  </span>
                  <span className="text-xs tabular-nums opacity-70">
                    ({isPositive ? "+" : ""}${Math.abs(parseFloat(priceChangeValue)).toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="mb-3">
                <Sparkline data={asset.sparkline} isPositive={isPositive} />
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between border-t border-border/50 pt-2">
                <div>
                  <p className="text-[8px] uppercase text-muted-foreground">Volume</p>
                  <p className="text-[10px] font-semibold text-foreground">{asset.volume}</p>
                </div>
                {asset.marketCap !== "â" && (
                  <div className="text-right">
                    <p className="text-[8px] uppercase text-muted-foreground">Market Cap</p>
                    <p className="text-[10px] font-semibold text-foreground">{asset.marketCap}</p>
                  </div>
                )}
                <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${
                  asset.type === "stock" ? "bg-blue-500/20 text-blue-400" :
                  asset.type === "crypto" ? "bg-amber-500/20 text-amber-400" :
                  "bg-purple-500/20 text-purple-400"
                }`}>
                  {asset.type === "stock" ? "ACAO" : asset.type === "crypto" ? "CRIPTO" : "INDICE"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
