import { NextRequest, NextResponse } from "next/server";
import { readContract } from "@/lib/genlayer";
import { getRoom, updateRoom } from "@/lib/roomStore";
import { ARTICLES } from "@/lib/articles";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roundParam = req.nextUrl.searchParams.get("round") ?? "0";
    const roundNum = Number(roundParam);

    let contractResults: { scores: unknown[]; actual: unknown } | null = null;
    try {
      contractResults = (await readContract("get_round_results", [
        id,
        roundNum,
      ])) as { scores: unknown[]; actual: unknown } | null;
    } catch {
      contractResults = null;
    }

    if (contractResults) {
      const scores: any[] = (contractResults as any).scores ?? (contractResults as any).results ?? [];
      const normalized = { results: scores, actual: (contractResults as any).actual };
      if (scores.length > 0) {
        const room = getRoom(id);
        if (room) {
          const newTotals = { ...room.total_scores };
          scores.forEach((s: any) => {
            newTotals[s.player] = (newTotals[s.player] ?? 0) + (s.total ?? s.total_score ?? 0);
          });
          updateRoom(id, { total_scores: newTotals });
        }
      }
      return NextResponse.json(normalized);
    }

    const room = getRoom(id);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    let articleActual: { country: string; language: string; year: number };
    if (room.wiki_articles && room.wiki_articles.length > roundNum) {
      articleActual = room.wiki_articles[roundNum];
    } else {
      const indices = room.article_indices?.length
        ? room.article_indices
        : (await import("@/lib/articles")).selectArticles(id);
      const articleIdx = indices[roundNum];
      const { ARTICLES } = await import("@/lib/articles");
      articleActual = ARTICLES[articleIdx] ?? ARTICLES[0];
    }

    const localScores = (room as any)[`round_${roundNum}_scores`] ?? [];

    return NextResponse.json({
      results: localScores,
      actual: { country: articleActual.country, language: articleActual.language, year: articleActual.year },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
