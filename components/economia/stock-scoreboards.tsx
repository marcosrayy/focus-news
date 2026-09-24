"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StockScore {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  sector: string;
}

const initialStocks: StockScore[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 228.45, change: 1.45, volume: "58.2M", marketCap: "$3.52T", sector: "Tech" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.10, change: -0.23, volume: "22.1M", marketCap: "$3.08T", sector: "Tech" },
  { symbol: "NVDA", name: "Nvidia Corp.", price: 132.80, change: 4.12, volume: "312.5M", marketCap: "$3.26T", sector: "Semicond." },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 178.40, change: 0.85, volume: "24.7M", marketCap: "$2.19T", sector: "Tech" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 198.15, change: -1.32, volume: "45.3M", marketCap: "$2.07T", sector: "E-commerce" },
  { symbol: "META", name: "Meta Platforms", price: 582.30, change: 2.67, volume: "18.9M", marketCap: "$1.47T", sector: "Social" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -3.18, volume: "98.4M", marketCap: "$791B", sector: "EV" },
  { symbol: "TSM", name: "TSMC", price: 185.20, change: 1.89, volume: "14.2M", marketCap: "$958B", sector: "Semicond." },
];

function randomizeStock(stock: StockScore): StockScore {
  const delta = (Math.random() * 4 - 2);
  const newChange = parseFloat(delta.toFixed(2));
  const priceChange = stock.price * (newChange / 100);
  return {
    ...stock,
    price: parseFloat((stock.price + priceChange).toFixed(2)),
    change: newChange,
  };
}

export function StockScoreboards() {
  const [stocks, setStocks] = useState(initialStocks);
  const [flash, setFlash] = useState<Record<string, "up" | "down" | null>>({});

  const updateStocks = useCallback(() => {
    setStocks((prev) => {
      const updated = prev.map(randomizeStock);
      const newFlash: Record<string, "up" | "down" | null> = {};
      updated.forEach((s) => {
        newFlash[s.symbol] = s.change >= 0 ? "up" : "down";
      });
      setFlash(newFlash);
      return updated;
    });
    setTimeout(() => setFlash({}), 800);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateStocks, 5000);
    return () => clearInterval(interval);
  }, [updateStocks]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
            PLACARES AO VIVO
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-500">LIVE</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ativo</th>
              <th className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Setor</th>
              <th className="pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preco</th>
              <th className="pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Variacao</th>
              <th className="pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Volume</th>
              <th className="pb-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr
                key={stock.symbol}
                className={`border-b border-border/50 transition-colors duration-500 ${
                  flash[stock.symbol] === "up"
                    ? "bg-emerald-500/5"
                    : flash[stock.symbol] === "down"
                      ? "bg-red-500/5"
                      : ""
                }`}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-primary">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{stock.symbol}</p>
                      <p className="text-[10px] text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {stock.sector}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="font-heading text-sm font-bold tabular-nums text-foreground">
                    ${stock.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 ${
                    stock.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  }`}>
                    {stock.change >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    <span className="text-xs font-semibold tabular-nums">
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right text-xs tabular-nums text-muted-foreground">
                  {stock.volume}
                </td>
                <td className="py-3 text-right text-xs font-semibold tabular-nums text-foreground">
                  {stock.marketCap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
