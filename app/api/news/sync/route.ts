import { NextResponse } from "next/server";
import { Storage } from "../../../../utils/storage";
import { RefreshEngine } from "../../../../services/refreshEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = Storage.readStatus();
    const articles = Storage.readArticles();
    
    // Group count by category
    const categoryCounts: Record<string, number> = {};
    articles.forEach(art => {
      categoryCounts[art.category] = (categoryCounts[art.category] || 0) + 1;
    });

    return NextResponse.json({
      status: "success",
      engine: status,
      totalArticles: articles.length,
      categoryCounts
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message || "Failed to load status"
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('[API/News/Sync] Manual sync triggered via POST');
    const result = await RefreshEngine.runSync(true);
    
    if (!result.success) {
      return NextResponse.json({
        status: "busy",
        message: result.stats.error || "Sync already running"
      }, { status: 409 });
    }

    const status = Storage.readStatus();
    return NextResponse.json({
      status: "success",
      syncStats: result.stats,
      engine: status
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message || "Failed to execute synchronization"
    }, { status: 500 });
  }
}
