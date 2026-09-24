import { NextResponse } from "next/server";

const TICKERS = {
  summary: [
    { id: "IBOVESPA", symbol: "^BVSP" },
    { id: "DOLAR", symbol: "BRL=X" },
    { id: "BITCOIN", symbol: "BTC-USD" },
    { id: "S&P 500", symbol: "^GSPC" },
    { id: "NASDAQ", symbol: "^IXIC" },
  ],
  gainers: [
    { id: "NVDA", symbol: "NVDA", name: "Nvidia" },
    { id: "WEGE3", symbol: "WEGE3.SA", name: "WEG ON" },
    { id: "META", symbol: "META", name: "Meta Platforms" },
    { id: "PETR4", symbol: "PETR4.SA", name: "Petrobras PN" },
    { id: "TSM", symbol: "TSM", name: "TSMC" },
  ],
  losers: [
    { id: "TSLA", symbol: "TSLA", name: "Tesla Inc." },
    { id: "AMZN", symbol: "AMZN", name: "Amazon" },
    { id: "ITUB4", symbol: "ITUB4.SA", name: "Itau Unibanco" },
    { id: "VALE3", symbol: "VALE3.SA", name: "Vale ON" },
    { id: "BBDC4", symbol: "BBDC4.SA", name: "Bradesco PN" },
  ],
  crypto: [
    { id: "BTC", symbol: "BTC-USD", name: "Bitcoin", dominance: "52.3%" },
    { id: "ETH", symbol: "ETH-USD", name: "Ethereum", dominance: "17.1%" },
    { id: "SOL", symbol: "SOL-USD", name: "Solana", dominance: "3.2%" },
    { id: "BNB", symbol: "BNB-USD", name: "BNB", dominance: "4.1%" },
    { id: "XRP", symbol: "XRP-USD", name: "XRP", dominance: "2.8%" },
    { id: "ADA", symbol: "ADA-USD", name: "Cardano", dominance: "1.5%" },
  ],
  currencies: [
    { id: "USD/BRL", symbol: "BRL=X" },
    { id: "EUR/BRL", symbol: "EURBRL=X" },
    { id: "GBP/BRL", symbol: "GBPBRL=X" },
    { id: "JPY/BRL", symbol: "JPYBRL=X" },
  ],
};

function formatVolume(vol: number): string {
  if (!vol) return "N/A";
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + "K";
  return vol.toString();
}

async function fetchQuote(symbol: string) {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const result = data.chart.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const changePercent = ((price - previousClose) / previousClose) * 100;
    const closes = result.indicators?.quote?.[0]?.close ?? [];
    const sparkline = closes.filter((value: number | null): value is number => value !== null);

    return {
      price,
      changePercent,
      volume: meta.regularMarketVolume || 0,
      sparkline: sparkline.length > 1 ? sparkline : [previousClose, price],
    };
  } catch (err) {
    console.error("Failed to fetch", symbol);
    return null;
  }
}

export async function GET() {
  try {
    const fetchGroup = async (items: any[], type: string) => {
      const results = await Promise.all(
        items.map(async (item) => {
          const data = await fetchQuote(item.symbol);
          if (!data) return item; // fallback if error

          let formattedPrice = "";
          if (item.id === "IBOVESPA") {
            formattedPrice = data.price.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
          } else if (type === "currencies" || item.id === "DOLAR" || item.id.includes("BRL") || item.symbol.endsWith(".SA")) {
            formattedPrice = "R$ " + data.price.toLocaleString("pt-BR", { minimumFractionDigits: item.id === "JPY/BRL" ? 3 : 2, maximumFractionDigits: item.id === "JPY/BRL" ? 4 : 2 });
          } else {
            formattedPrice = "$" + data.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
          }

          return {
            ...item,
            priceStr: formattedPrice,
            priceNum: data.price,
            changeNum: data.changePercent,
            changeStr: `${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%`,
            volumeStr: formatVolume(data.volume),
            sparkline: data.sparkline,
          };
        })
      );
      return results;
    };

    const summary = await fetchGroup(TICKERS.summary, "summary");
    const gainers = await fetchGroup(TICKERS.gainers, "gainers");
    const losers = await fetchGroup(TICKERS.losers, "losers");
    const crypto = await fetchGroup(TICKERS.crypto, "crypto");
    const currencies = await fetchGroup(TICKERS.currencies, "currencies");

    return NextResponse.json({ summary, gainers, losers, crypto, currencies });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
