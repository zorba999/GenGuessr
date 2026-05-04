import { NextRequest, NextResponse } from "next/server";
import { getRoom, joinRoom, setPhase, updateRoom, ensureRoom } from "@/lib/roomStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureRoom(id);
    const room = getRoom(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, playerName } = await req.json();
    await ensureRoom(id);

    if (action === "join") {
      const room = await joinRoom(id, playerName);
      if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
      return NextResponse.json({ success: true, room });
    }

    if (action === "start") {
      const room = await setPhase(id, "playing");
      if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
      return NextResponse.json({ success: true, room });
    }

    if (action === "next_round") {
      const current = getRoom(id);
      if (!current) return NextResponse.json({ error: "Room not found" }, { status: 404 });
      const nextRound = current.current_round + 1;
      if (nextRound >= current.total_rounds) {
        const room = await setPhase(id, "results");
        return NextResponse.json({ success: true, room });
      }
      const room = await updateRoom(id, { current_round: nextRound, phase: "playing", all_submitted_round: undefined });
      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
