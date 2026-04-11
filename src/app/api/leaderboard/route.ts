import { NextResponse } from "next/server";
import { readContract } from "@/lib/genlayer";
import type { LeaderboardEntry } from "@/lib/types";

export async function GET() {
  try {
    const entries = (await readContract("get_leaderboard", [
      BigInt(20),
    ])) as LeaderboardEntry[];
    return NextResponse.json(entries);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
