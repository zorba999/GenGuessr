"use client";

import { Copy, Users, Zap } from "lucide-react";
import type { RoomState } from "@/lib/types";

interface Props {
  roomState: RoomState;
  roomId: string;
  playerName: string;
  isHost: boolean;
  onStart: () => void;
}

export default function LobbyScreen({ roomState, roomId, isHost, onStart }: Props) {
  function copyCode() {
    navigator.clipboard.writeText(roomId);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-3xl font-black neon-text mb-1">GenGuessr</h1>
          <p className="text-slate-400">Waiting for players...</p>
        </div>

        {/* Room Code */}
        <div className="glass neon-border rounded-2xl p-6 mb-4">
          <div className="text-xs font-bold text-neon-green uppercase tracking-widest mb-2">
            Room Code
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-4xl font-black font-mono text-white tracking-[0.3em] text-center py-2 bg-dark-700 rounded-xl border border-slate-700">
              {roomId}
            </div>
            <button
              onClick={copyCode}
              className="p-3 rounded-xl border border-slate-700 hover:border-neon-green hover:text-neon-green text-slate-400 transition-all"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-600 text-xs text-center mt-2">
            Share this code with friends to join
          </p>
        </div>

        {/* Players */}
        <div className="glass rounded-2xl p-5 mb-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-bold text-slate-300">
              Players ({roomState.players.length})
            </span>
          </div>
          <div className="space-y-2">
            {roomState.players.map((player, i) => (
              <div
                key={player}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-dark-700"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center text-dark-900 font-black text-xs">
                  {player[0].toUpperCase()}
                </div>
                <span className="text-white font-medium">{player}</span>
                {i === 0 && (
                  <span className="ml-auto text-xs text-neon-green border border-neon-green/30 px-2 py-0.5 rounded-full">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div className="glass rounded-xl p-4 mb-5 border border-slate-800">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-neon-green font-black text-xl">3</div>
              <div className="text-slate-500 text-xs">Rounds</div>
            </div>
            <div>
              <div className="text-neon-green font-black text-xl">60s</div>
              <div className="text-slate-500 text-xs">Per round</div>
            </div>
            <div>
              <div className="text-neon-green font-black text-xl">300</div>
              <div className="text-slate-500 text-xs">Max XP/round</div>
            </div>
          </div>
        </div>

        {isHost ? (
          <button
            onClick={onStart}
            disabled={roomState.players.length < 1}
            className="w-full py-4 rounded-xl font-black text-xl bg-neon-green text-dark-900 hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Start Game
          </button>
        ) : (
          <div className="text-center py-4 text-slate-500 animate-pulse-slow">
            Waiting for host to start the game...
          </div>
        )}
      </div>
    </div>
  );
}
