"use client";

import { TrendingUp, TrendingDown, Activity, BarChart3, Zap, DollarSign } from "lucide-react";
import { SidebarCardsModal } from "@/components/sidebar-cards-modal";

const liveQuotes = [
  { ticker: "IBOV", price: "134.520", change: "+1.23%", isPositive: true },
  { ticker: "S&P 500", price: "5.892", change: "+0.87%", isPositive: true },
  { ticker: "NASDAQ", price: "19.450", change: "+1.45%", isPositive: true },
  { ticker: "EUR/USD", price: "1.0892", change: "-0.12%", isPositive: false },
  { ticker: "BTC/USD", price: "120.340", change: "+6.82%", isPositive: true },
  { ticker: "GOLD", price: "2.678", change: "+0.34%", isPositive: true },
];

const topMovers = [
  { ticker: "MGLU3", name: "Magazine Luiza", change: "+8.4%", isPositive: true },
  { ticker: "VALE3", name: "Vale", change: "+3.2%", isPositive: true },
  { ticker: "BBAS3", name: "Banco do Brasil", change: "+2.8%", isPositive: true },
  { ticker: "CIEL3", name: "Cielo", change: "-4.1%", isPositive: false },
  { ticker: "AZUL4", name: "Azul", change: "-3.6%", isPositive: false },
];

const signals = [
  { asset: "WEGE3", type: "Compra", strength: "Forte", indicator: "RSI + MACD" },
  { asset: "RENT3", type: "Compra", strength: "Moderado", indicator: "Media Movel" },
  { asset: "VIIA3", type: "Venda", strength: "Forte", indicator: "Suporte perdido" },
];

export function TradeSidebarContent() {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">COTACOES AO VIVO</h3>
        </div>
        <div className="flex flex-col gap-2">
          {liveQuotes.map((quote) => (
            <div key={quote.ticker} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-emerald-500/30">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs font-bold text-foreground">{quote.ticker}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{quote.price}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${quote.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {quote.isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {quote.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <BarChart3 className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">MAIORES MOVIMENTACOES</h3>
        </div>
        <div className="flex flex-col gap-2">
          {topMovers.map((mover) => (
            <div key={mover.ticker} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-amber-400/30">
              <div>
                <p className="text-xs font-bold text-foreground">{mover.ticker}</p>
                <p className="text-[10px] text-muted-foreground">{mover.name}</p>
              </div>
              <span className={`text-xs font-semibold ${mover.isPositive ? "text-emerald-500" : "text-red-500"}`}>{mover.change}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">SINAIS</h3>
        </div>
        <div className="flex flex-col gap-2">
          {signals.map((signal) => (
            <div key={signal.asset} className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3 py-2.5 transition-all duration-300 hover:border-emerald-500/30">
              <div>
                <p className="text-xs font-bold text-foreground">{signal.asset}</p>
                <p className="text-[10px] text-muted-foreground">{signal.indicator}</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-semibold ${signal.type === "Compra" ? "text-emerald-500" : "text-red-500"}`}>{signal.type}</p>
                <p className="text-[9px] text-muted-foreground">{signal.strength}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-bold tracking-wider text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20">
        ABRIR TERMINAL DE TRADE
      </button>
    </>
  );
}

export function TradeSidebar() {
  return (
    <SidebarCardsModal title="TRADE" items={["Cotações ao vivo", "Maiores movimentações", "Sinais"]}>
      <TradeSidebarContent />
    </SidebarCardsModal>
  );
}
