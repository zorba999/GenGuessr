import { NextRequest, NextResponse } from "next/server";
import { getRoom, updateRoom, ensureRoom } from "@/lib/roomStore";
import { ARTICLES, selectArticles } from "@/lib/articles";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureRoom(id);
    const room = getRoom(id);
    if (!room) {
      console.error(`[article] Room not found: ${id}`);
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const roundIdx = room.current_round ?? 0;

    if (room.wiki_articles && room.wiki_articles.length > roundIdx) {
      const article = room.wiki_articles[roundIdx];
      return NextResponse.json({
        content: article.content,
        round: roundIdx + 1,
        total_rounds: room.total_rounds,
      });
    }

    let articleIndices = room.article_indices;
    const TOTAL_ROUNDS = 5;
    if (!articleIndices || articleIndices.length < TOTAL_ROUNDS ||
        articleIndices.some(i => i < 0 || i >= ARTICLES.length)) {
      console.log(`[article] Recomputing article indices for room ${id}`);
      const { generateArticleSeed } = await import("@/lib/articles");
      articleIndices = selectArticles(generateArticleSeed());
      updateRoom(id, { article_indices: articleIndices });
    }
    const articleIdx = articleIndices[roundIdx];
    if (articleIdx === undefined || articleIdx < 0 || articleIdx >= ARTICLES.length) {
      console.error(`[article] Still bad index ${articleIdx} for round ${roundIdx}`);
      return NextResponse.json({ error: "Bad article index" }, { status: 500 });
    }
    const article = ARTICLES[articleIdx];
    return NextResponse.json({
      content: article.content,
      round: roundIdx + 1,
      total_rounds: room.total_rounds,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[article] Error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
