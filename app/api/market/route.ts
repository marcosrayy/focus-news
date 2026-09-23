import { NextResponse } from "next/server";

const TICKERS = [
  { id: "ITUB4", symbol: "ITUB4.SA" },
  { id: "ABEV3", symbol: "ABEV3.SA" },
  { id: "GGBR4", symbol: "GGBR4.SA" },
  { id: "IBOVESPA", symbol: "^BVSP" },
  { id: "DOLAR", symbol: "BRL=X" },
  { id: "BITCOIN", symbol: "BTC-BRL" },
  { id: "IFIX", symbol: "IFIX.SA" },
  { id: "MGLU3", symbol: "MGLU3.SA" },
  { id: "PETR4", symbol: "PETR4.SA" }
];

function formatPrice(id: string, price: number): string {
  if (id === "IBOVESPA" || id === "IFIX") {
    return price.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + "pts";
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
          const data = await res.json();
          const meta = data.chart.result[0].meta;
          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.chartPreviousClose;
          
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
