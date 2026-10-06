"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUpRight, ArrowDownRight, Flame, DollarSign, Globe } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

interface TopMover {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

const initialGainers: TopMover[] = [
  { symbol: "NVDA", name: "Nvidia", price: "$132.80", change: 4.12 },
  { symbol: "WEGE3", name: "WEG ON", price: "R$52.30", change: 3.45 },
  { symbol: "META", name: "Meta Platforms", price: "$582.30", change: 2.67 },
  { symbol: "PETR4", name: "Petrobras PN", price: "R$38.45", change: 2.18 },
  { symbol: "TSM", name: "TSMC", price: "$185.20", change: 1.89 },
];

const initialLosers: TopMover[] = [
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.50", change: -3.18 },
  { symbol: "AMZN", name: "Amazon", price: "$198.15", change: -1.32 },
  { symbol: "ITUB4", name: "Itau Uni.", price: "R$45.50", change: -1.41 },
  { symbol: "VALE3", name: "Vale ON", price: "R$62.10", change: -1.05 },
  { symbol: "BBDC4", name: "Bradesco", price: "R$14.85", change: -0.88 },
];

interface Currency {
  pair: string;
  value: string;
  change: number;
}

const initialCurrencies: Currency[] = [
  { pair: "USD/BRL", value: "R$ 5,22", change: 0.66 },
  { pair: "EUR/BRL", value: "R$ 5,68", change: 0.32 },
  { pair: "GBP/BRL", value: "R$ 6,54", change: -0.15 },
  { pair: "JPY/BRL", value: "R$ 0,035", change: -0.42 },
];

export function EconomySidebarContent({
  gainers = initialGainers,
  losers = initialLosers,
  currencies = initialCurrencies,
}: {
  gainers?: TopMover[];
  losers?: TopMover[];
  currencies?: Currency[];
}) {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Flame className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MAIORES ALTAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {gainers.map((s, i) => (
            <div key={s.symbol} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-emerald-500/30">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-emerald-500 bg-emerald-500/10">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{s.symbol}</p>
                  <p className="text-[10px] text-muted-foreground">{s.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tabular-nums text-foreground">{s.price}</p>
                <div className="flex items-center justify-end gap-0.5 text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-[10px] font-semibold tabular-nums">+{s.change.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <Flame className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MAIORES BAIXAS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {losers.map((s, i) => (
            <div key={s.symbol} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-red-500/30">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-red-500 bg-red-500/10">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{s.symbol}</p>
                  <p className="text-[10px] text-muted-foreground">{s.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tabular-nums text-foreground">{s.price}</p>
                <div className="flex items-center justify-end gap-0.5 text-red-500">
                  <ArrowDownRight className="h-3 w-3" />
                  <span className="text-[10px] font-semibold tabular-nums">{s.change.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CAMBIO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {currencies.map((c) => (
            <div key={c.pair} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-primary/30">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">{c.pair}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold tabular-nums text-foreground">{c.value}</span>
                <span className={`min-w-[48px] text-right text-[10px] font-semibold tabular-nums ${
                  c.change >= 0 ? "text-emerald-500" : "text-red-500"
                }`}>
                  {c.change >= 0 ? "+" : ""}{c.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export function EconomySidebar() {
  const [gainers, setGainers] = useState(initialGainers);
  const [losers, setLosers] = useState(initialLosers);
  const [currencies, setCurrencies] = useState(initialCurrencies);

  const fetchSidebarData = useCallback(async () => {
    try {
      const res = await fetch('/api/economia-page');
      const data = await res.json();
      if (data.currencies) {
        setCurrencies(data.currencies.map((c: any) => ({
          pair: c.id,
          value: c.priceStr,
          change: c.changeNum
        })));
      }
      if (data.gainers) {
        setGainers(data.gainers.map((g: any) => ({
          symbol: g.id,
          name: g.name,
          price: g.priceStr,
          change: g.changeNum
        })));
      }
      if (data.losers) {
        setLosers(data.losers.map((l: any) => ({
          symbol: l.id,
          name: l.name,
          price: l.priceStr,
          change: l.changeNum
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchSidebarData();
    const interval = setInterval(fetchSidebarData, 60000);
    return () => clearInterval(interval);
  }, [fetchSidebarData]);

  return (
    <SidebarCardsModal title="ECONOMIA" items={["Maiores altas", "Maiores baixas", "Câmbio"]}>
      <EconomySidebarContent gainers={gainers} losers={losers} currencies={currencies} />
    </SidebarCardsModal>
  );
}
