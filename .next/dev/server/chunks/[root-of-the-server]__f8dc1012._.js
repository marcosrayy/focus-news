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
"[project]/app/api/market/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const TICKERS = [
    {
        id: "ITUB4",
        symbol: "ITUB4.SA"
    },
    {
        id: "ABEV3",
        symbol: "ABEV3.SA"
    },
    {
        id: "GGBR4",
        symbol: "GGBR4.SA"
    },
    {
        id: "IBOVESPA",
        symbol: "^BVSP"
    },
    {
        id: "DOLAR",
        symbol: "BRL=X"
    },
    {
        id: "BITCOIN",
        symbol: "BTC-BRL"
    },
    {
        id: "IFIX",
        symbol: "IFIX.SA"
    },
    {
        id: "MGLU3",
        symbol: "MGLU3.SA"
    },
    {
        id: "PETR4",
        symbol: "PETR4.SA"
    }
];
function formatPrice(id, price) {
    if (id === "IBOVESPA" || id === "IFIX") {
        return price.toLocaleString("pt-BR", {
            maximumFractionDigits: 0
        }) + "pts";
    }
    return "R$ " + price.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
async function GET() {
    try {
        const results = await Promise.all(TICKERS.map(async (t)=>{
            try {
                const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${t.symbol}?interval=1d&range=1d`, {
                    next: {
                        revalidate: 60
                    } // cache de 1 minuto
                });
                const data = await res.json();
                const meta = data.chart.result[0].meta;
                const currentPrice = meta.regularMarketPrice;
                const previousClose = meta.chartPreviousClose;
                const changePercent = (currentPrice - previousClose) / previousClose * 100;
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
        }));
        const validResults = results.filter((r)=>r !== null);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            tickers: validResults
        });
    } catch (error) {
        console.error("Market API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch market data"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f8dc1012._.js.map