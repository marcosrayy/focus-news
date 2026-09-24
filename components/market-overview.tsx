"use client";

import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  DollarSign,
  Flame,
} from "lucide-react";

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const initialIndices: MarketIndex[] = [
  { name: "IBOVESPA", value: "181.363", change: "-0.97%", isPositive: false },
  { name: "S&P 500", value: "6.012", change: "+0.54%", isPositive: true },
  { name: "NASDAQ", value: "19.478", change: "+1.23%", isPositive: true },
  { name: "DOW JONES", value: "44.298", change: "+0.12%", isPositive: true },
];

interface CurrencyPair {
  pair: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const initialCurrencies: CurrencyPair[] = [
  { pair: "USD/BRL", value: "R$ 5,22", change: "+0.66%", isPositive: true },
  { pair: "EUR/BRL", value: "R$ 5,68", change: "+0.32%", isPositive: true },
  { pair: "GBP/BRL", value: "R$ 6,54", change: "-0.15%", isPositive: false },
  { pair: "BTC/USD", value: "$97.452", change: "+2.34%", isPositive: true },
];

interface TrendingStock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume: string;
}

const initialTrendingStocks: TrendingStock[] = [
  {
    symbol: "PETR4",
    name: "Petrobras PN",
    price: "R$ 38,45",
    change: "+2.18%",
    isPositive: true,
    volume: "42.3M",
  },
  {
    symbol: "VALE3",
    name: "Vale ON",
    price: "R$ 62,10",
    change: "-1.05%",
    isPositive: false,
    volume: "38.1M",
  },
  {
    symbol: "ITUB4",
    name: "Itau Unibanco",
    price: "R$ 45,50",
    change: "-1.41%",
    isPositive: false,
    volume: "27.8M",
  },
  {
    symbol: "WEGE3",
    name: "WEG ON",
    price: "R$ 52,30",
    change: "+3.45%",
    isPositive: true,
    volume: "15.2M",
  },
  {
    symbol: "BBDC4",
    name: "Bradesco PN",
    price: "R$ 14,85",
    change: "+0.61%",
    isPositive: true,
    volume: "22.6M",
  },
];

export function MarketOverview() {
  const [indices, setIndices] = useState(initialIndices);
  const [currencies, setCurrencies] = useState(initialCurrencies);
  const [trending, setTrending] = useState(initialTrendingStocks);

  const fetchMarket = useCallback(async () => {
    try {
      const res = await fetch('/api/home-market');
      const data = await res.json();
      
      if (data.indices) {
        setIndices(data.indices.map((i: any) => ({
          name: i.id, value: i.priceStr, change: i.changeStr, isPositive: i.isPositive
        })));
      }
      if (data.currencies) {
        setCurrencies(data.currencies.map((c: any) => ({
          pair: c.id, value: c.priceStr, change: c.changeStr, isPositive: c.isPositive
        })));
      }
      if (data.trending) {
        setTrending(data.trending.map((t: any) => ({
          symbol: t.id, name: t.name, price: t.priceStr, change: t.changeStr, isPositive: t.isPositive, volume: t.volumeStr
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, [fetchMarket]);

  return (
    <div className="flex flex-col gap-4">
      {/* Market Indices */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
            INDICES
          </h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {indices.map((idx) => (
            <div
              key={idx.name}
              className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-center gap-2">
                {idx.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className="text-xs font-semibold text-foreground">
                  {idx.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-foreground">
                  {idx.value}
                </span>
                <span
                  className={`min-w-[52px] text-right text-[11px] font-semibold ${
                    idx.isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {idx.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currencies */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
            CAMBIO
          </h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {currencies.map((cur) => (
            <div
              key={cur.pair}
              className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-primary/30"
            >
              <span className="text-xs font-semibold text-muted-foreground">
                {cur.pair}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-foreground">
                  {cur.value}
                </span>
                <span
                  className={`min-w-[52px] text-right text-[11px] font-semibold ${
                    cur.isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {cur.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending / Most Traded */}
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
              MAIS NEGOCIADAS
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-medium text-emerald-500">
              AO VIVO
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {trending.map((stock, i) => (
            <div
              key={stock.symbol}
              className="group flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-primary/30 hover:shadow-sm"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {stock.symbol}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {stock.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate text-[10px] text-muted-foreground">
                    {stock.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Vol: {stock.volume}
                    </span>
                    <span
                      className={`min-w-[48px] text-right text-[10px] font-semibold ${
                        stock.isPositive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {stock.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
