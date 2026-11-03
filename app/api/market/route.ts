import { NextResponse } from "next/server";

const TICKERS = [
  { id: "ITUB4", symbol: "ITUB4.SA" },
  { id: "ABEV3", symbol: "ABEV3.SA" },
  { id: "GGBR4", symbol: "GGBR4.SA" },
  { id: "IBOVESPA", symbol: "^BVSP" },
  { id: "DOLAR", symbol: "BRL=X" },
  // Yahoo Finance descontinuou o par BTC-BRL; BTC-USD continua disponível.
  { id: "BITCOIN", symbol: "BTC-USD" },
  { id: "IFIX", symbol: "IFIX.SA" },
  { id: "MGLU3", symbol: "MGLU3.SA" },
  { id: "PETR4", symbol: "PETR4.SA" }
];

function formatPrice(id: string, price: number): string {
  if (id === "IBOVESPA" || id === "IFIX") {
    return price.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + "pts";
  }
  if (id === "BITCOIN") {
    return "$ " + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "R$ " + price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function GET() {
  try {
    const results = await Promise.all(
      TICKERS.map(async (t) => {
        try {
          const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${t.symbol}?interval=1d&range=1d`, {
            next: { revalidate: 60 } // cache de 1 minuto
          });
          if (!res.ok) throw new Error(`Yahoo Finance returned HTTP ${res.status}`);
          const data = await res.json();
          const result = data?.chart?.result?.[0];
          const meta = result?.meta;
          const currentPrice = meta?.regularMarketPrice;
          const previousClose = meta?.chartPreviousClose;
          if (!Number.isFinite(currentPrice) || !Number.isFinite(previousClose) || previousClose === 0) {
            throw new Error("Yahoo Finance returned an incomplete quote");
          }
          
          const changePercent = ((currentPrice - previousClose) / previousClose) * 100;
          const isPositive = changePercent >= 0;
          
          return {
            symbol: t.id,
            price: formatPrice(t.id, currentPrice),
            change: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
            isPositive
          };
        } catch (err) {
          console.error(`Error fetching ${t.symbol}`, err);
          return null;
        }
      })
    );

    const validResults = results.filter((r) => r !== null);
    
    return NextResponse.json({ tickers: validResults });
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
