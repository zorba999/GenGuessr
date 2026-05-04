import { NextRequest, NextResponse } from "next/server";
import { submitContract } from "@/lib/genlayer";
import { getRoom, setPhase, updateRoom } from "@/lib/roomStore";
import { ARTICLES } from "@/lib/articles";

export async function POST(req: NextRequest) {
  try {
    const { roomId, roundNum: clientRound } = await req.json();
    if (!roomId) {
      return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    const room = getRoom(roomId);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const roundNum = clientRound ?? room.current_round;

    if (clientRound != null && clientRound !== room.current_round) {
      console.warn(`[evaluate] round mismatch: client=${clientRound} server=${room.current_round}, using client`);
    }

    const articleIndices = room.article_indices?.length >= (roundNum + 1)
      ? room.article_indices
      : (await import("@/lib/articles")).selectArticles(roomId);

    const articleIdx = articleIndices[roundNum];
    if (articleIdx === undefined) {
      return NextResponse.json({ error: `No article for round ${roundNum}` }, { status: 400 });
    }
    const article = ARTICLES[articleIdx];

    updateRoom(roomId, {
      phase: "round_results",
      last_round_article_id: articleIdx,
    });

    submitContract("evaluate_round", [
      roomId,
      roundNum,
      article.country,
      article.language,
      article.year,
      JSON.stringify(room.players),
    ]).catch((e) => console.error("[evaluate] contract error:", e));

    console.log(`[evaluate] room=${roomId} round=${roundNum} article=${article.country}/${article.language}`);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
