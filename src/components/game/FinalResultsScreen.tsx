"use client";

import { useEffect, useState } from "react";
import { Trophy, Zap, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RoomState, LeaderboardEntry } from "@/lib/types";

interface Props {
  roomState: RoomState;
  playerName: string;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function FinalResultsScreen({ roomState, playerName }: Props) {
  const router = useRouter();
  const [globalBoard, setGlobalBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setGlobalBoard(data))
      .catch(() => {});
  }, []);

  const sorted = Object.entries(roomState.total_scores).sort(
    ([, a], [, b]) => b - a
  );
  const winner = sorted[0]?.[0];
  const myScore = roomState.total_scores[playerName] ?? 0;
  const myRank = sorted.findIndex(([p]) => p === playerName) + 1;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Hero */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-4xl font-black neon-text mb-2">Game Over!</h1>
          {winner && (
            <p className="text-slate-300 text-lg">
              <span className="text-yellow-400 font-black">{winner}</span> wins!
            </p>
          )}
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5">
            <Zap className="w-3 h-3 text-neon-green" />
            <span className="text-xs text-neon-green">
              XP stored on-chain via GenLayer Intelligent Contract
            </span>
          </div>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 mb-8">
          {[sorted[1], sorted[0], sorted[2]].map((entry, visualIdx) => {
            if (!entry) return <div key={visualIdx} className="w-24" />;
            const [player, score] = entry;
            const heights = ["h-20", "h-28", "h-16"];
            const actualIdx = sorted.findIndex(([p]) => p === player);
            return (
              <div key={player} className="flex flex-col items-center gap-2">
                <div className="text-2xl">{MEDALS[actualIdx] ?? "🎖"}</div>
                <div className="text-sm font-bold text-white truncate max-w-[80px] text-center">
                  {player}
                </div>
                <div className="text-neon-green font-black text-sm">{score}</div>
                <div
                  className={`w-20 ${heights[visualIdx]} rounded-t-lg flex items-center justify-center glass neon-border`}
                >
                  <span className="text-lg font-black text-slate-400">
                    {actualIdx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* My Stats */}
        <div className="glass neon-border rounded-2xl p-5 mb-5 animate-slide-up">
          <div className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">
            Your Stats
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-black text-neon-green">{myScore}</div>
              <div className="text-xs text-slate-500">Total XP</div>
            </div>
            <div>
              <div className="text-3xl font-black text-neon-purple">#{myRank}</div>
              <div className="text-xs text-slate-500">Rank</div>
            </div>
            <div>
              <div className="text-3xl font-black text-neon-blue">
                {roomState.total_rounds}
              </div>
              <div className="text-xs text-slate-500">Rounds</div>
            </div>
          </div>
        </div>

        {/* Full Results */}
        <div className="glass rounded-xl p-4 border border-slate-800 mb-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <Trophy className="w-3 h-3 inline mr-1 text-yellow-400" />
            Final Scores
          </div>
          <div className="space-y-2">
            {sorted.map(([player, score], idx) => (
              <div
                key={player}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                  player === playerName ? "bg-neon-green/10 border border-neon-green/20" : "bg-dark-700"
                }`}
              >
                <span className="text-lg">{MEDALS[idx] ?? `${idx + 1}.`}</span>
                <span className={`font-bold ${player === playerName ? "text-neon-green" : "text-white"}`}>
                  {player}
                  {player === playerName && (
                    <span className="text-xs ml-1 text-neon-green/60">(you)</span>
                  )}
                </span>
                <span className="ml-auto font-black text-neon-green">{score} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Leaderboard */}
        {globalBoard.length > 0 && (
          <div className="glass rounded-xl p-4 border border-neon-purple/30 mb-5">
            <div className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-3">
              🌍 Global Leaderboard (All-time XP)
            </div>
            <div className="space-y-2">
              {globalBoard.slice(0, 10).map((entry, idx) => (
                <div
                  key={entry.player}
                  className={`flex items-center gap-2 text-sm py-1 ${
                    entry.player === playerName ? "text-neon-green" : "text-slate-300"
                  }`}
                >
                  <span className="text-slate-600 w-4 text-right">{idx + 1}</span>
                  <span className="flex-1 font-medium">{entry.player}</span>
                  <span className="font-black">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-xl font-black text-lg border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
}
