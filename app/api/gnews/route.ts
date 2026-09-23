import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchNewsBackend } from "../../../services/newsService";

// ==========================================
// GNEWS ROUTE — Agora usa o newsService unificado
// Sem dados mockados. Sem imagens fictícias.
// ==========================================

// Mapeamento de categorias da API antiga para o novo sistema
const CATEGORY_MAP: Record<string, string> = {
  technology: "Tecnologia",
  business: "Business",
  science: "Inovacao",
  general: "Geral",
  entertainment: "Tecnologia", // Redirecionar — não temos entretenimento
  health: "Inovacao",         // Healthtech vai pra inovação
  sports: "Tecnologia",       // Redirecionar — não temos esportes
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "technology";
  const max = searchParams.get("max") || "12";

  // Converter a categoria legada para o novo sistema
  const mappedCategory = CATEGORY_MAP[category] || "Geral";

  try {
    const articles = await fetchNewsBackend({
      query: mappedCategory,
      category: mappedCategory,
      max: parseInt(max),
    });

    // Normalizar o formato de saída para compatibilidade com lib/news-service.ts
    const normalizedArticles = articles.map((article: any) => ({
      ...article,
      source: typeof article.source === "string" 
        ? { name: article.source } 
        : article.source,
    }));

    return NextResponse.json({
      articles: normalizedArticles,
      isFallback: articles.length === 0,
    });
  } catch (error) {
    console.error("[FocusNews] Error fetching news:", error);
    return NextResponse.json({
      articles: [],
      isFallback: true,
      error: "Failed to fetch news",
    }, { status: 500 });
  }
}
