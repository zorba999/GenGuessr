import { NextRequest, NextResponse } from "next/server";
import { submitContract } from "@/lib/genlayer";
import { getRoom, setPhase, updateRoom, getRoundGuesses, ensureRoom } from "@/lib/roomStore";
import { ARTICLES } from "@/lib/articles";

export async function POST(req: NextRequest) {
  try {
    const { roomId, roundNum: clientRound } = await req.json();
    if (!roomId) {
      return NextResponse.json({ error: "roomId required" }, { status: 400 });
    }

    await ensureRoom(roomId);
    const room = getRoom(roomId);
    if (!room) {
      console.error(`[evaluate] Room not found: "${roomId}"`);
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const roundNum = clientRound ?? room.current_round;

    if (clientRound != null && clientRound !== room.current_round) {
      console.warn(`[evaluate] round mismatch: client=${clientRound} server=${room.current_round}, using client`);
    }

    let article: { country: string; language: string; year: number };

    if (room.wiki_articles && room.wiki_articles.length > roundNum) {
      article = room.wiki_articles[roundNum];
    } else {
      const articleIndices = room.article_indices?.length >= (roundNum + 1)
        ? room.article_indices
        : (await import("@/lib/articles")).selectArticles((await import("@/lib/articles")).generateArticleSeed());
      const articleIdx = articleIndices[roundNum];
      if (articleIdx === undefined) {
        return NextResponse.json({ error: `No article for round ${roundNum}` }, { status: 400 });
      }
      article = ARTICLES[articleIdx];
    }

    updateRoom(roomId, {
      phase: "round_results",
    });

    const offChainGuesses = getRoundGuesses(roomId, roundNum);

    const normalize = (s: string) => s.trim().toLowerCase();
    const localScores = offChainGuesses.map((g) => {
      const country_score = normalize(g.country) === normalize(article.country) ? 100
        : normalize(g.country).includes(normalize(article.country)) || normalize(article.country).includes(normalize(g.country)) ? 40 : 0;
      const language_score = normalize(g.language) === normalize(article.language) ? 100 : 0;
      const total_score = country_score + language_score;
      return { player: g.player, country: g.country, language: g.language, country_score, language_score, year_score: 0, total_score };
    });

    if (localScores.length > 0) {
      const freshRoom = getRoom(roomId);
      if (freshRoom) {
        const newTotals = { ...freshRoom.total_scores };
        localScores.forEach((s) => {
          newTotals[s.player] = (newTotals[s.player] ?? 0) + s.total_score;
        });
        updateRoom(roomId, {
          phase: "round_results",
          total_scores: newTotals,
          [`round_${roundNum}_scores`]: localScores,
        } as any);
      }
    }

    const playersPayload = offChainGuesses.length > 0 ? offChainGuesses : room.players;

    console.log(`[evaluate] room=${roomId} round=${roundNum} article=${article.country}/${article.language} guesses=${offChainGuesses.length}`);

    submitContract("evaluate_round", [
      roomId,
      roundNum,
      article.country,
      article.language,
      article.year,
      JSON.stringify(playersPayload),
    ]).catch((e) => console.error("[evaluate] contract error:", e));

    return NextResponse.json({ success: true, localScores });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
