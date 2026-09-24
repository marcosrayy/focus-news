"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUpRight, ArrowDownRight, Globe } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

interface StockData {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const initialStocks: StockData[] = [
  { symbol: "AAPL", price: "$228.45", change: "+1.45%", isPositive: true },
  { symbol: "MSFT", price: "$415.10", change: "-0.23%", isPositive: false },
  { symbol: "NVDA", price: "$132.80", change: "+4.12%", isPositive: true },
  { symbol: "GOOGL", price: "$178.40", change: "+0.85%", isPositive: true },
];

export function BigTechSidebar() {
  const [stocks, setStocks] = useState(initialStocks);
  const [pulse, setPulse] = useState(false);

  const fetchStocks = useCallback(async () => {
    try {
      setPulse(true);
      const res = await fetch('/api/home-market');
      const data = await res.json();
      if (data.bigTech) {
        setStocks(data.bigTech.map((item: any) => ({
          symbol: item.id,
          price: item.priceStr || "$0.00",
          change: item.changeStr || "0.00%",
          isPositive: item.isPositive ?? true
        })));
      }
      setTimeout(() => setPulse(false), 500);
    } catch (e) {
      console.error(e);
      setPulse(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return (
    <SidebarCardsModal title="BIG TECH" items={["Mercado agora", "Ações tech"]}>
      <aside className="rounded-2xl border border-border bg-card p-4 shadow-card lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-heading text-lg font-bold tracking-wide text-foreground">
            BIG TECH
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold text-primary">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className={`group cursor-pointer rounded-xl border border-border bg-secondary/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover lg:p-4 ${
              pulse ? "animate-pulse" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {stock.symbol}
              </span>
              {stock.isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="font-heading text-lg font-bold text-foreground lg:text-xl">
              {stock.price}
            </p>
            <p
              className={`mt-0.5 text-xs font-semibold ${
                stock.isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {stock.change}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-xl bg-foreground py-3 text-center text-sm font-bold tracking-wider text-background transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:shadow-foreground/10">
        ABRIR TERMINAL
      </button>
      </aside>
    </SidebarCardsModal>
  );
}
