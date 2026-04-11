"use client";

import { ArrowRight, Trophy } from "lucide-react";
import type { RoomState, RoundResultsData } from "@/lib/types";

interface Props {
  roomState: RoomState;
  results: RoundResultsData;
  isHost: boolean;
  onNextRound: () => void;
}

function ScoreBar({ score, max = 300 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-neon-green to-neon-blue transition-all duration-1000"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function RoundResultsScreen({
  roomState,
  results,
  isHost,
  onNextRound,
}: Props) {
  const isLastRound = roomState.current_round >= roomState.total_rounds;
  const sortedResults = [...results.results].sort(
    (a, b) => b.total_score - a.total_score
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6 animate-slide-up">
          <div className="text-xs font-bold text-neon-green uppercase tracking-widest mb-1">
            Round {roomState.current_round}/{roomState.total_rounds} Results
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            AI Verdict Is In!
          </h2>

          {/* Actual answer */}
          <div className="inline-flex items-center gap-4 glass neon-border rounded-xl px-5 py-3">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Country</div>
              <div className="text-lg font-black text-neon-green">
                {results.actual.country}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Language</div>
              <div className="text-lg font-black text-neon-blue">
                {results.actual.language}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Year</div>
              <div className="text-lg font-black text-neon-purple">
                {results.actual.year}
              </div>
            </div>
          </div>
        </div>

        {/* Player Results */}
        <div className="space-y-3 mb-6">
          {sortedResults.map((r, idx) => (
            <div
              key={r.player}
              className="glass rounded-xl p-4 border border-slate-800 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    idx === 0
                      ? "bg-yellow-500 text-dark-900"
                      : idx === 1
                      ? "bg-slate-400 text-dark-900"
                      : idx === 2
                      ? "bg-amber-700 text-white"
                      : "bg-dark-600 text-slate-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="font-bold text-white">{r.player}</span>
                <span className="ml-auto text-2xl font-black text-neon-green">
                  +{r.total_score}
                </span>
              </div>

              <ScoreBar score={r.total_score} />

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="text-center">
                  <div className="text-slate-500 mb-0.5">Country</div>
                  <div className="text-slate-300 font-medium truncate">
                    {r.country || "—"}
                  </div>
                  <div
                    className={
                      r.country_score === 100
                        ? "text-neon-green"
                        : r.country_score > 0
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {r.country_score}pts
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 mb-0.5">Language</div>
                  <div className="text-slate-300 font-medium truncate">
                    {r.language || "—"}
                  </div>
                  <div
                    className={
                      r.language_score === 100
                        ? "text-neon-green"
                        : "text-red-400"
                    }
                  >
                    {r.language_score}pts
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500 mb-0.5">Year</div>
                  <div className="text-slate-300 font-medium">{r.year}</div>
                  <div
                    className={
                      r.year_score >= 80
                        ? "text-neon-green"
                        : r.year_score > 0
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {r.year_score}pts
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Scores */}
        <div className="glass rounded-xl p-4 border border-slate-800 mb-5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <Trophy className="w-3 h-3 inline mr-1 text-yellow-400" />
            Total Scores
          </div>
          <div className="space-y-2">
            {Object.entries(roomState.total_scores)
              .sort(([, a], [, b]) => b - a)
              .map(([player, score]) => (
                <div key={player} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{player}</span>
                  <span className="font-black text-neon-green">{score} XP</span>
                </div>
              ))}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={onNextRound}
            className="w-full py-4 rounded-xl font-black text-lg bg-neon-green text-dark-900 hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLastRound ? (
              <>
                <Trophy className="w-5 h-5" /> See Final Results
              </>
            ) : (
              <>
                Next Round <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <div className="text-center py-4 text-slate-500 animate-pulse-slow">
            Waiting for host to continue...
          </div>
        )}
      </div>
    </div>
  );
}
