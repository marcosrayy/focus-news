import { NextResponse } from "next/server";
import { repairMojibake } from "@/services/newsService";

const TUTORIAL_CACHE_SECONDS = 7 * 24 * 60 * 60;

interface YouTubeVideoRenderer {
  videoId?: string;
  title?: { runs?: { text?: string }[] };
  longBylineText?: { runs?: { text?: string }[] };
  ownerText?: { runs?: { text?: string }[] };
  publishedTimeText?: { simpleText?: string };
  viewCountText?: { simpleText?: string };
}

function findJsonObjectEnd(value: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < value.length; index += 1) {
    const character = value[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "\"") {
        inString = false;
      }
      continue;
    }

    if (character === "\"") {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }

  return -1;
}

function getVideoRenderers(html: string): YouTubeVideoRenderer[] {
  const renderers: YouTubeVideoRenderer[] = [];
  const marker = "\"videoRenderer\":{";
  let searchFrom = 0;

  while (renderers.length < 3) {
    const markerIndex = html.indexOf(marker, searchFrom);
    if (markerIndex === -1) break;

    const objectStart = markerIndex + marker.length - 1;
    const objectEnd = findJsonObjectEnd(html, objectStart);
    if (objectEnd === -1) break;

    try {
      renderers.push(JSON.parse(html.slice(objectStart, objectEnd)) as YouTubeVideoRenderer);
    } catch {
      searchFrom = objectStart + 1;
      continue;
    }

    searchFrom = objectEnd;
  }

  return renderers;
}

export async function GET() {
  const params = new URLSearchParams({
    search_query: "tutorial de programação desenvolvimento web Brasil",
    sp: "CAMSAhAB",
    hl: "pt-BR",
    gl: "BR",
  });

  try {
    const response = await fetch(`https://www.youtube.com/results?${params.toString()}`, {
      headers: { "Accept-Language": "pt-BR,pt;q=0.9" },
      next: { revalidate: TUTORIAL_CACHE_SECONDS },
    });

    if (!response.ok) {
      console.error(`[YouTube] Search request failed with status ${response.status}.`);
      return NextResponse.json(
        { error: "Não foi possível carregar os vídeos de tutoriais agora." },
        { status: 502 },
      );
    }

    const html = await response.text();
    const videos = getVideoRenderers(html)
      .map((item) => {
        const videoId = item.videoId;
        const title = item.title?.runs?.map((run) => run.text || "").join("").trim();
        if (!videoId || !title) return null;

        return {
          videoId,
          title: repairMojibake(title),
          channelTitle: repairMojibake(
            item.longBylineText?.runs?.map((run) => run.text || "").join("").trim() ||
            item.ownerText?.runs?.map((run) => run.text || "").join("").trim() ||
            "Canal do YouTube",
          ),
          publishedAt: repairMojibake(item.publishedTimeText?.simpleText || ""),
          viewCount: repairMojibake(item.viewCountText?.simpleText || ""),
        };
      })
      .filter((video): video is NonNullable<typeof video> => video !== null)
      .slice(0, 3);

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("[YouTube] Tutorial video search failed.", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os vídeos de tutoriais agora." },
      { status: 502 },
    );
  }
}
