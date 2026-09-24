"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Static initial data to prevent hydration mismatch
const staticIbovespaData = [
  { date: "01/02", value: 178000, volume: 12 },
  { date: "02/02", value: 178500, volume: 10 },
  { date: "03/02", value: 177800, volume: 14 },
  { date: "04/02", value: 178200, volume: 11 },
  { date: "05/02", value: 179100, volume: 15 },
  { date: "06/02", value: 178600, volume: 9 },
  { date: "07/02", value: 179400, volume: 13 },
  { date: "08/02", value: 180100, volume: 16 },
  { date: "09/02", value: 179800, volume: 12 },
  { date: "10/02", value: 180500, volume: 14 },
  { date: "11/02", value: 181200, volume: 11 },
  { date: "12/02", value: 180800, volume: 10 },
  { date: "13/02", value: 181500, volume: 15 },
  { date: "14/02", value: 182100, volume: 13 },
  { date: "15/02", value: 181700, volume: 12 },
];

const staticSP500Data = [
  { date: "01/02", value: 5800, volume: 18 },
  { date: "02/02", value: 5820, volume: 15 },
  { date: "03/02", value: 5810, volume: 20 },
  { date: "04/02", value: 5850, volume: 17 },
  { date: "05/02", value: 5880, volume: 22 },
  { date: "06/02", value: 5860, volume: 14 },
  { date: "07/02", value: 5900, volume: 19 },
  { date: "08/02", value: 5920, volume: 21 },
  { date: "09/02", value: 5890, volume: 16 },
  { date: "10/02", value: 5940, volume: 18 },
  { date: "11/02", value: 5970, volume: 20 },
  { date: "12/02", value: 5950, volume: 15 },
  { date: "13/02", value: 5990, volume: 22 },
  { date: "14/02", value: 6010, volume: 19 },
  { date: "15/02", value: 6000, volume: 17 },
];

const staticNasdaqData = [
  { date: "01/02", value: 18800, volume: 8 },
  { date: "02/02", value: 18900, volume: 6 },
  { date: "03/02", value: 18850, volume: 10 },
  { date: "04/02", value: 19000, volume: 7 },
  { date: "05/02", value: 19150, volume: 12 },
  { date: "06/02", value: 19050, volume: 5 },
  { date: "07/02", value: 19200, volume: 9 },
  { date: "08/02", value: 19350, volume: 11 },
  { date: "09/02", value: 19280, volume: 8 },
  { date: "10/02", value: 19420, volume: 10 },
  { date: "11/02", value: 19550, volume: 7 },
  { date: "12/02", value: 19480, volume: 6 },
  { date: "13/02", value: 19620, volume: 12 },
  { date: "14/02", value: 19750, volume: 9 },
  { date: "15/02", value: 19700, volume: 8 },
];

function generateIbovespaData() {
  let value = 178000;
  return Array.from({ length: 15 }, (_, i) => {
    value += (Math.random() - 0.48) * 1200;
    return {
      date: `${(i + 1).toString().padStart(2, "0")}/02`,
      value: Math.round(value),
      volume: Math.round(Math.random() * 15 + 5),
    };
  });
}

function generateSP500Data() {
  let value = 5800;
  return Array.from({ length: 15 }, (_, i) => {
    value += (Math.random() - 0.46) * 40;
    return {
      date: `${(i + 1).toString().padStart(2, "0")}/02`,
      value: Math.round(value),
      volume: Math.round(Math.random() * 20 + 8),
    };
  });
}

function generateNasdaqData() {
  let value = 18800;
  return Array.from({ length: 15 }, (_, i) => {
    value += (Math.random() - 0.44) * 120;
    return {
      date: `${(i + 1).toString().padStart(2, "0")}/02`,
      value: Math.round(value),
      volume: Math.round(Math.random() * 12 + 4),
    };
  });
}

const tabs = [
  { id: "ibovespa", label: "IBOVESPA", generate: generateIbovespaData, staticData: staticIbovespaData },
  { id: "sp500", label: "S&P 500", generate: generateSP500Data, staticData: staticSP500Data },
  { id: "nasdaq", label: "NASDAQ", generate: generateNasdaqData, staticData: staticNasdaqData },
];

const orangeColor = "#FF6A00";
const greenColor = "#22c55e";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[hsl(0,0%,18%)] bg-[hsl(0,0%,7%)] px-3 py-2 shadow-xl">
      <p className="text-[10px] text-[hsl(0,0%,64%)]">{label}</p>
      <p className="font-heading text-sm font-bold text-[hsl(0,0%,96%)]">
        {payload[0].value.toLocaleString("pt-BR")} pts
      </p>
      {payload[1] && (
        <p className="text-[10px] text-[hsl(0,0%,64%)]">
          Vol: {payload[1].value}B
        </p>
      )}
    </div>
  );
}

export function MarketCharts() {
  const [activeTab, setActiveTab] = useState("ibovespa");
  const [data, setData] = useState(staticIbovespaData);
  const [period, setPeriod] = useState("1M");
  const [mounted, setMounted] = useState(false);

  const [realValues, setRealValues] = useState<Record<string, { price: number, change: number }>>({});

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const lastValue = realValues[activeTab]?.price ?? (data[data.length - 1]?.value ?? 0);
  const changePercent = realValues[activeTab]?.change.toFixed(2) ?? ((lastValue - (data[0]?.value ?? 0)) / (data[0]?.value ?? 1) * 100).toFixed(2);
  const isPositive = parseFloat(changePercent) >= 0;

  const fetchRealValues = useCallback(async () => {
    try {
      const res = await fetch('/api/economia-page');
      const apiData = await res.json();
      if (apiData.summary) {
        const ibov = apiData.summary.find((x: any) => x.id === "IBOVESPA");
        const sp500 = apiData.summary.find((x: any) => x.id === "S&P 500") || { priceNum: 6012, changeNum: 0.54 }; // Fallback since it's not in economy-page summary
        const nasdaq = apiData.summary.find((x: any) => x.id === "NASDAQ") || { priceNum: 19478, changeNum: 1.23 };
        
        setRealValues({
          ibovespa: ibov ? { price: ibov.priceNum, change: ibov.changeNum } : { price: 178208, change: 0.11 },
          sp500: { price: sp500.priceNum, change: sp500.changeNum },
          nasdaq: { price: nasdaq.priceNum, change: nasdaq.changeNum }
        });
      }
    } catch (e) {}
  }, []);

  const refreshData = useCallback(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (tab) setData(tab.generate());
  }, [activeTab]);

  // Set mounted on client to enable dynamic updates
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only start generating random data after mount
  useEffect(() => {
    if (mounted) {
      refreshData();
      fetchRealValues();
    }
  }, [mounted, refreshData, fetchRealValues]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      refreshData();
      fetchRealValues();
    }, 15000);
    return () => clearInterval(interval);
  }, [mounted, refreshData, fetchRealValues]);

  // Switch to static data when changing tabs before mount
  useEffect(() => {
    if (!mounted) {
      const tab = tabs.find((t) => t.id === activeTab);
      if (tab) setData(tab.staticData);
    }
  }, [activeTab, mounted]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold text-foreground">{currentTab.label}</h3>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
              isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {isPositive ? "+" : ""}{changePercent}%
            </span>
          </div>
          <p className="mt-0.5 font-heading text-2xl font-bold tabular-nums text-foreground">
            {lastValue.toLocaleString("pt-BR")}
            <span className="ml-1 text-sm text-muted-foreground">pts</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {["1D", "1S", "1M", "3M", "1A"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold tracking-wider transition-all duration-300 ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 rounded-xl bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold tracking-wider transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Area Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={orangeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={orangeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" strokeOpacity={0.4} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0,0%,64%)", fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(0,0%,64%)", fontSize: 10 }}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={orangeColor}
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      <div className="mt-2 h-[80px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 5, left: -10, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Bar dataKey="volume" fill={greenColor} fillOpacity={0.3} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">Volume (Bilhoes R$)</p>
    </div>
  );
}
