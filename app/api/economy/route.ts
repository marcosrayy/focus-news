import { NextResponse } from "next/server";

const TICKERS = [
  { id: "AAPL", symbol: "AAPL", type: "stock" },
  { id: "MSFT", symbol: "MSFT", type: "stock" },
  { id: "NVDA", symbol: "NVDA", type: "stock" },
  { id: "GOOGL", symbol: "GOOGL", type: "stock" },
  { id: "BTC", symbol: "BTC-USD", type: "crypto" },
  { id: "ETH", symbol: "ETH-USD", type: "crypto" },
  { id: "NASDAQ", symbol: "^IXIC", type: "index" },
  { id: "S&P500", symbol: "^GSPC", type: "index" },
];

function formatVolume(vol: number): string {
  if (!vol) return "N/A";
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + "K";
  return vol.toString();
}

export async function GET() {
  try {
    const results = await Promise.all(
      TICKERS.map(async (t) => {
        try {
          const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${t.symbol}?interval=1d&range=1d`, {
            next: { revalidate: 60 },
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
          const volume = meta.regularMarketVolume;
          
          const changeVal = currentPrice - previousClose;

          return {
            symbol: t.id,
            price: currentPrice,
            change: changeVal,
            volume: formatVolume(volume),
          };
        } catch (err) {
          console.error(`Error fetching ${t.symbol}`, err);
          return null;
        }
      })
    );

    const validResults = results.filter((r) => r !== null);
    
    return NextResponse.json({ assets: validResults });
  } catch (error) {
    console.error("Economy API Error:", error);
    return NextResponse.json({ error: "Failed to fetch economy data" }, { status: 500 });
  }
}
