module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/home-market/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const TICKERS = {
    bigTech: [
        {
            id: "AAPL",
            symbol: "AAPL"
        },
        {
            id: "MSFT",
            symbol: "MSFT"
        },
        {
            id: "NVDA",
            symbol: "NVDA"
        },
        {
            id: "GOOGL",
            symbol: "GOOGL"
        }
    ],
    digitalAssets: [
        {
            id: "BTC",
            symbol: "BTC-USD",
            name: "Bitcoin"
        },
        {
            id: "ETH",
            symbol: "ETH-USD",
            name: "Ethereum"
        },
        {
            id: "SOL",
            symbol: "SOL-USD",
            name: "Solana"
        }
    ],
    indices: [
        {
            id: "IBOVESPA",
            symbol: "^BVSP"
        },
        {
            id: "S&P 500",
            symbol: "^GSPC"
        },
        {
            id: "NASDAQ",
            symbol: "^IXIC"
        },
        {
            id: "DOW JONES",
            symbol: "^DJI"
        }
    ],
    currencies: [
        {
            id: "USD/BRL",
            symbol: "BRL=X"
        },
        {
            id: "EUR/BRL",
            symbol: "EURBRL=X"
        },
        {
            id: "GBP/BRL",
            symbol: "GBPBRL=X"
        },
        {
            id: "BTC/USD",
            symbol: "BTC-USD"
        }
    ],
    trending: [
        {
            id: "PETR4",
            symbol: "PETR4.SA",
            name: "Petrobras PN"
        },
        {
            id: "VALE3",
            symbol: "VALE3.SA",
            name: "Vale ON"
        },
        {
            id: "ITUB4",
            symbol: "ITUB4.SA",
            name: "Itau Unibanco"
        },
        {
            id: "WEGE3",
            symbol: "WEGE3.SA",
            name: "WEG ON"
        },
        {
            id: "BBDC4",
            symbol: "BBDC4.SA",
            name: "Bradesco PN"
        }
    ]
};
function formatVolume(vol) {
    if (!vol) return "N/A";
    if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
    if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
    if (vol >= 1e3) return (vol / 1e3).toFixed(1) + "K";
    return vol.toString();
}
async function fetchQuote(symbol) {
    try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`, {
            next: {
                revalidate: 60
            }
        });
        const data = await res.json();
        const meta = data.chart.result[0].meta;
        const price = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const changePercent = (price - previousClose) / previousClose * 100;
        const isPositive = changePercent >= 0;
        const volume = meta.regularMarketVolume || 0;
        return {
            price,
            changePercent,
            isPositive,
            volume
        };
    } catch (err) {
        console.error("Failed to fetch", symbol);
        return null;
    }
}
async function GET() {
    try {
        const fetchAll = async (items, type)=>{
            const results = await Promise.all(items.map(async (item)=>{
                const data = await fetchQuote(item.symbol);
                if (!data) return item; // fallback if error
                let formattedPrice = "";
                if (type === "indices") {
                    formattedPrice = data.price.toLocaleString("pt-BR", {
                        maximumFractionDigits: 0
                    });
                } else if (type === "currencies" && item.id.includes("BRL")) {
                    formattedPrice = "R$ " + data.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                } else if (type === "trending") {
                    formattedPrice = "R$ " + data.price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                } else {
                    formattedPrice = "$" + data.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
                return {
                    ...item,
                    priceStr: formattedPrice,
                    changeStr: `${data.isPositive ? "+" : ""}${data.changePercent.toFixed(2)}%`,
                    isPositive: data.isPositive,
                    volumeStr: formatVolume(data.volume)
                };
            }));
            return results;
        };
        const bigTech = await fetchAll(TICKERS.bigTech, "bigTech");
        const digitalAssets = await fetchAll(TICKERS.digitalAssets, "digitalAssets");
        const indices = await fetchAll(TICKERS.indices, "indices");
        const currencies = await fetchAll(TICKERS.currencies, "currencies");
        const trending = await fetchAll(TICKERS.trending, "trending");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            bigTech,
            digitalAssets,
            indices,
            currencies,
            trending
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c0da80f9._.js.map