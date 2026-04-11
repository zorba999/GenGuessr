import { NextRequest, NextResponse } from "next/server";
import { readContract } from "@/lib/genlayer";
import { getRoom } from "@/lib/roomStore";
import { ARTICLES } from "@/lib/articles";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roundParam = req.nextUrl.searchParams.get("round") ?? "0";
    const roundNum = Number(roundParam);

    const contractResults = (await readContract("get_round_results", [
      id,
      roundNum,
    ])) as { scores: unknown[]; actual: unknown } | null;

    if (contractResults) {
      return NextResponse.json(contractResults);
    }

    const room = getRoom(id);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    const articleIdx = room.article_indices[roundNum];
    const article = ARTICLES[articleIdx];
    return NextResponse.json({
      results: [],
      actual: { country: article.country, language: article.language, year: article.year },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
