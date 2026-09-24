"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const initialAssets = [
  { name: "Bitcoin", symbol: "BTC", price: "$97,452", change: "+2.34%", isPositive: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,841", change: "+1.12%", isPositive: true },
  { name: "Solana", symbol: "SOL", price: "$198.50", change: "-0.87%", isPositive: false },
];

export function DigitalAssets() {
  const [assets, setAssets] = useState(initialAssets);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/home-market');
      const data = await res.json();
      if (data.digitalAssets) {
        setAssets(data.digitalAssets.map((item: any) => ({
          name: item.name,
          symbol: item.id,
          price: item.priceStr,
          change: item.changeStr,
          isPositive: item.isPositive,
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, 60000);
    return () => clearInterval(interval);
  }, [fetchAssets]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card lg:p-5">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">
          DIGITAL ASSETS
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{asset.name}</p>
              <p className="text-xs text-muted-foreground">{asset.symbol}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{asset.price}</p>
              <div className="flex items-center justify-end gap-1">
                {asset.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    asset.isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {asset.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
