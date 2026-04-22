import { NextRequest, NextResponse } from "next/server";
import { submitContract } from "@/lib/genlayer";
import { getRoom } from "@/lib/roomStore";

export async function POST(req: NextRequest) {
  try {
    const { roomId, playerName, country, language, year } = await req.json();

    if (!roomId || !playerName || !country || !language || year == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const room = getRoom(roomId);
    const roundNum = room?.current_round ?? 0;

    await submitContract("submit_guess", [
      roomId,
      roundNum,
      playerName,
      country,
      language,
      Number(year),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
