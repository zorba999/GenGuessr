import { NextRequest, NextResponse } from "next/server";
import { submitContract } from "@/lib/genlayer";
import { getRoom, saveGuess, updateRoom, ensureRoom } from "@/lib/roomStore";

export async function POST(req: NextRequest) {
  try {
    const { roomId, playerName, country, language, year } = await req.json();

    if (!roomId || !playerName || !country || !language || year == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await ensureRoom(roomId);
    const room = getRoom(roomId);
    const roundNum = room?.current_round ?? 0;

    saveGuess(roomId, roundNum, playerName, country, language, Number(year));

    if (room) {
      const submittedKey = `round_${roundNum}_submitted`;
      const prevSubmitted: string[] = (room as any)[submittedKey] ?? [];
      if (!prevSubmitted.includes(playerName)) {
        const newSubmitted = [...prevSubmitted, playerName];
        const allDone = room.players.length > 0 && room.players.every(p => newSubmitted.includes(p));
        await updateRoom(roomId, {
          [submittedKey]: newSubmitted,
          ...(allDone ? { all_submitted_round: roundNum } : {}),
        } as any);
      }
    }

    submitContract("submit_guess", [
      roomId,
      roundNum,
      playerName,
      country,
      language,
      Number(year),
    ]).catch((e) => console.error("[guess] contract error:", e));

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
