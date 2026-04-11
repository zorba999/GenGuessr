"use client";

import type { RoomState } from "@/lib/types";

interface Props {
  roomState: RoomState;
}

export default function ScoringScreen({ roomState }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-neon-green/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-4 border-neon-purple/40 animate-spin" />
          <div className="absolute inset-4 rounded-full border-4 border-neon-blue/60 animate-spin-slow" style={{ animationDirection: "reverse" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🧠</span>
          </div>
        </div>

        <h2 className="text-2xl font-black neon-text mb-3">
          AI Validators Scoring...
        </h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          GenLayer&apos;s Optimistic Democracy validators are evaluating your guesses.
          Each validator runs independently, then reaches consensus.
        </p>

        <div className="glass neon-border rounded-xl p-4 text-left space-y-3">
          {[
            { label: "Proposing", status: "done", icon: "✓" },
            { label: "Validators Committing", status: "done", icon: "✓" },
            { label: "Revealing Votes", status: "active", icon: "⟳" },
            { label: "Consensus", status: "pending", icon: "○" },
            { label: "Finalized", status: "pending", icon: "○" },
          ].map(({ label, status, icon }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span
                className={
                  status === "done"
                    ? "text-neon-green"
                    : status === "active"
                    ? "text-neon-blue animate-spin-slow"
                    : "text-slate-600"
                }
              >
                {icon}
              </span>
              <span
                className={
                  status === "done"
                    ? "text-neon-green"
                    : status === "active"
                    ? "text-white"
                    : "text-slate-600"
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-600">
          {roomState.players.length} player{roomState.players.length !== 1 ? "s" : ""} being scored · Round{" "}
          {roomState.current_round + 1}/{roomState.total_rounds}
        </div>
      </div>
    </div>
  );
}
