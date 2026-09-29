"use client";

import { useCallback, useEffect, useState } from "react";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const initialTickers: TickerItem[] = [
  { symbol: "ITUB4", price: "R$45,50", change: "-1.41%", isPositive: false },
  { symbol: "ABEV3", price: "R$14,85", change: "+0.61%", isPositive: true },
  { symbol: "GGBR4", price: "R$22,42", change: "-1.41%", isPositive: false },
  {
    symbol: "IBOVESPA",
    price: "181.363pts",
    change: "-0.97%",
    isPositive: false,
  },
  { symbol: "DOLAR", price: "R$5,22", change: "+0.66%", isPositive: true },
  {
    symbol: "BITCOIN",
    price: "R$410.438,00",
    change: "-7.01%",
    isPositive: false,
  },
  { symbol: "IFIX", price: "3.860pts", change: "+0.47%", isPositive: true },
  { symbol: "MGLU3", price: "R$9,78", change: "+0.72%", isPositive: true },
  { symbol: "PETR4", price: "R$38,12", change: "-3.54%", isPositive: false },
];

function randomizePrice(item: TickerItem): TickerItem {
  const changeVal = (Math.random() * 4 - 2).toFixed(2);
  const isPositive = parseFloat(changeVal) >= 0;
  return {
    ...item,
    change: `${isPositive ? "+" : ""}${changeVal}%`,
    isPositive,
  };
}

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(initialTickers);
  const [countdown, setCountdown] = useState(60);

  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch("/api/market");
      const data = await res.json();
      if (data.tickers && data.tickers.length > 0) {
        setTickers(data.tickers);
      }
    } catch (err) {
      console.error("Failed to fetch tickers", err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchTickers();
  }, [fetchTickers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchTickers();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  return (
    <div className="w-full overflow-hidden border-b border-border bg-background/80">
      <div className="flex w-full animate-ticker whitespace-nowrap">
        {[...tickers, ...tickers].map((item, i) => (
          <div
            key={`${item.symbol}-${i}`}
            className="flex shrink-0 items-center gap-2 px-4 py-2 lg:px-6"
          >
            <span className="text-xs font-bold text-foreground lg:text-sm">
              {item.symbol}
            </span>
            <span className="text-xs text-muted-foreground lg:text-sm">
              {item.price}
            </span>
            <span
              className={`text-xs font-semibold lg:text-sm ${
                item.isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SyncBar() {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
      <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
        <svg
          className="h-3.5 w-3.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="truncate">Sincronizando: {countdown}s</span>
      </div>
      <button className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[10px] text-muted-foreground transition-colors duration-300 hover:border-primary hover:text-primary sm:px-3 sm:text-xs">
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        Atualizar
      </button>
    </div>
  );
}
