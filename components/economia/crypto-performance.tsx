"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: string;
  dominance: string;
}

const initialCryptos: CryptoData[] = [
  { name: "Bitcoin", symbol: "BTC", price: 97452, change: 2.34, volume: "$42.1B", dominance: "52.3%" },
  { name: "Ethereum", symbol: "ETH", price: 3841, change: 1.12, volume: "$18.7B", dominance: "17.1%" },
  { name: "Solana", symbol: "SOL", price: 198.5, change: -0.87, volume: "$4.2B", dominance: "3.2%" },
  { name: "BNB", symbol: "BNB", price: 612.3, change: 0.45, volume: "$1.8B", dominance: "4.1%" },
  { name: "XRP", symbol: "XRP", price: 2.45, change: -1.23, volume: "$3.6B", dominance: "2.8%" },
  { name: "Cardano", symbol: "ADA", price: 0.98, change: 3.56, volume: "$1.2B", dominance: "1.5%" },
];

const orangeColor = "#FF6A00";
const greenColor = "#22c55e";
const redColor = "#ef4444";

function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CryptoData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-[hsl(0,0%,18%)] bg-[hsl(0,0%,7%)] px-3 py-2 shadow-xl">
      <p className="text-xs font-bold text-[hsl(0,0%,96%)]">{d.name} ({d.symbol})</p>
      <p className="text-[10px] text-[hsl(0,0%,64%)]">Vol: {d.volume}</p>
      <p className={`text-xs font-semibold ${d.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
        {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
      </p>
    </div>
  );
}

export function CryptoPerformance() {
  const [cryptos, setCryptos] = useState(initialCryptos);

  const fetchCrypto = useCallback(async () => {
    try {
      const res = await fetch('/api/economia-page');
      const data = await res.json();
      if (data.crypto) {
        setCryptos(data.crypto.map((c: any) => ({
          name: c.name,
          symbol: c.id,
          price: c.priceNum,
          change: c.changeNum,
          volume: c.volumeStr,
          dominance: c.dominance
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, [fetchCrypto]);

  const chartData = cryptos.map((c) => ({
    ...c,
    absChange: Math.abs(c.change),
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
          CRIPTO PERFORMANCE
        </h3>
        <span className="text-[10px] text-muted-foreground">Atualizacao: 5s</span>
      </div>

      <div className="mb-4 h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <XAxis
              dataKey="symbol"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0,0%,64%)", fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="absChange" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.change >= 0 ? greenColor : redColor}
                  fillOpacity={0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2">
        {cryptos.map((c) => (
          <div key={c.symbol} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2 transition-all duration-300 hover:border-primary/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-[9px] font-bold text-primary">
                {c.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{c.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{c.dominance} dom.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold tabular-nums text-foreground">
                ${c.price.toLocaleString("en-US", { minimumFractionDigits: c.price < 10 ? 2 : 0 })}
              </p>
              <span className={`text-[10px] font-semibold tabular-nums ${
                c.change >= 0 ? "text-emerald-500" : "text-red-500"
              }`}>
                {c.change >= 0 ? "+" : ""}{c.change.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
