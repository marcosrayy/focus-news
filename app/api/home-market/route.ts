import { NextResponse } from "next/server";

const TICKERS = {
  bigTech: [
    { id: "AAPL", symbol: "AAPL" },
    { id: "MSFT", symbol: "MSFT" },
    { id: "NVDA", symbol: "NVDA" },
    { id: "GOOGL", symbol: "GOOGL" },
  ],
  digitalAssets: [
    { id: "BTC", symbol: "BTC-USD", name: "Bitcoin" },
    { id: "ETH", symbol: "ETH-USD", name: "Ethereum" },
    { id: "SOL", symbol: "SOL-USD", name: "Solana" },
  ],
  indices: [
    { id: "IBOVESPA", symbol: "^BVSP" },
    { id: "S&P 500", symbol: "^GSPC" },
    { id: "NASDAQ", symbol: "^IXIC" },
    { id: "DOW JONES", symbol: "^DJI" },
  ],
  currencies: [
    { id: "USD/BRL", symbol: "BRL=X" },
    { id: "EUR/BRL", symbol: "EURBRL=X" },
    { id: "GBP/BRL", symbol: "GBPBRL=X" },
    { id: "BTC/USD", symbol: "BTC-USD" },
  ],
  trending: [
    { id: "PETR4", symbol: "PETR4.SA", name: "Petrobras PN" },
    { id: "VALE3", symbol: "VALE3.SA", name: "Vale ON" },
    { id: "ITUB4", symbol: "ITUB4.SA", name: "Itau Unibanco" },
    { id: "WEGE3", symbol: "WEGE3.SA", name: "WEG ON" },
    { id: "BBDC4", symbol: "BBDC4.SA", name: "Bradesco PN" },
  ]
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
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const changePercent = ((price - previousClose) / previousClose) * 100;
    const isPositive = changePercent >= 0;
    const volume = meta.regularMarketVolume || 0;
    return { price, changePercent, isPositive, volume };
  } catch (err) {
    console.error("Failed to fetch", symbol);
    return null;
  }
}

export async function GET() {
  try {
    const fetchAll = async (items: any[], type: string) => {
      const results = await Promise.all(
        items.map(async (item) => {
          const data = await fetchQuote(item.symbol);
          if (!data) return item; // fallback if error

          let formattedPrice = "";
          if (type === "indices") {
            formattedPrice = data.price.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
          } else if (type === "currencies" && item.id.includes("BRL")) {
            formattedPrice = "R$ " + data.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else if (type === "trending") {
            formattedPrice = "R$ " + data.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            formattedPrice = "$" + data.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }

          return {
            ...item,
            priceStr: formattedPrice,
            changeStr: `${data.isPositive ? "+" : ""}${data.changePercent.toFixed(2)}%`,
            isPositive: data.isPositive,
            volumeStr: formatVolume(data.volume)
          };
        })
      );
      return results;
    };

    const bigTech = await fetchAll(TICKERS.bigTech, "bigTech");
    const digitalAssets = await fetchAll(TICKERS.digitalAssets, "digitalAssets");
    const indices = await fetchAll(TICKERS.indices, "indices");
    const currencies = await fetchAll(TICKERS.currencies, "currencies");
    const trending = await fetchAll(TICKERS.trending, "trending");

    return NextResponse.json({ bigTech, digitalAssets, indices, currencies, trending });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
