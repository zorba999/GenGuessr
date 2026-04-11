import { NextRequest, NextResponse } from "next/server";
import { submitContract } from "@/lib/genlayer";
import { getRoom, setPhase, updateRoom } from "@/lib/roomStore";
import { ARTICLES } from "@/lib/articles";

export async function POST(req: NextRequest) {
  try {
    const { roomId } = await req.json();
    if (!roomId) {
      return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    const room = getRoom(roomId);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    setPhase(roomId, "scoring");

    const articleIdx = room.article_indices[room.current_round];
    const article = ARTICLES[articleIdx];

    await submitContract("evaluate_round", [
      roomId,
      room.current_round,
      article.country,
      article.language,
      article.year,
      JSON.stringify(room.players),
    ]);

    updateRoom(roomId, {
      phase: "round_results",
      last_round_article_id: articleIdx,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
