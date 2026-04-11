import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/lib/roomStore";

export async function POST(req: NextRequest) {
  try {
    const { roomId, playerName } = await req.json();
    if (!roomId || !playerName) {
      return NextResponse.json(
        { error: "roomId and playerName required" },
        { status: 400 }
      );
    }
    const room = createRoom(roomId, playerName);
    return NextResponse.json({ success: true, roomId, room });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
