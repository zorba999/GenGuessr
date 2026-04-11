"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Users, Zap, Trophy, Clock, RefreshCw } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/lib/wagmi";

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function HomePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const playerName = address ? shortenAddress(address) : "";
  const [roomIdInput, setRoomIdInput] = useState("");
  const [loading, setLoading] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"home" | "create" | "join">("home");

  async function handleCreate() {
    if (!isConnected || !address) return setError("Connect your wallet first!");
    setLoading("create");
    setError("");
    try {
      const roomId = generateRoomId();
      localStorage.setItem("playerName", playerName.trim());
      localStorage.setItem("isHost", "true");
      router.push(`/room/${roomId}`);
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerName: playerName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create room");
    } finally {
      setLoading(null);
    }
  }

  async function handleJoin() {
    if (!isConnected || !address) return setError("Connect your wallet first!");
    if (!roomIdInput.trim()) return setError("Enter the room code!");
    setLoading("join");
    setError("");
    try {
      const cleanId = roomIdInput.trim().toUpperCase();
      localStorage.setItem("playerName", playerName.trim());
      localStorage.setItem("isHost", "false");
      router.push(`/room/${cleanId}`);
      const res = await fetch(`/api/room/${cleanId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", playerName: playerName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to join room");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-10 h-10 text-neon-green animate-spin-slow" />
            <h1 className="text-5xl font-black tracking-tight neon-text">
              GenGuessr
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Guess where the text is from.{" "}
            <span className="text-neon-purple font-semibold">
              AI validators judge your answer.
            </span>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Users, label: "Multiplayer", sub: "2-8 players" },
            { icon: Clock, label: "5-15 min", sub: "3 rounds" },
            { icon: RefreshCw, label: "Weekly Fresh", sub: "New articles" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="glass neon-border rounded-xl p-3 text-center"
            >
              <Icon className="w-5 h-5 text-neon-green mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{label}</div>
              <div className="text-xs text-slate-500">{sub}</div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="glass neon-border rounded-2xl p-6">
          {/* Wallet Connect */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-neon-green uppercase tracking-widest mb-2">
              Your Wallet
            </label>
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-dark-700 border border-neon-green/40 rounded-lg px-4 py-3 text-neon-green font-mono text-sm font-bold">
                  ✓ {address}
                </div>
                <ConnectButton.Custom>
                  {({ openAccountModal }) => (
                    <button
                      onClick={openAccountModal}
                      className="px-3 py-3 rounded-lg border border-slate-700 hover:border-neon-green text-slate-400 hover:text-neon-green transition-all text-xs"
                    >
                      ✕
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            ) : (
              <div className="w-full">
                <ConnectButton.Custom>
                  {({ openConnectModal, connectModalOpen }) => (
                    <button
                      onClick={openConnectModal}
                      disabled={connectModalOpen}
                      className="w-full py-3 rounded-lg border-2 border-dashed border-slate-600 hover:border-neon-green text-slate-400 hover:text-neon-green transition-all text-sm font-bold"
                    >
                      🔗 Connect Wallet to Play
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}
          </div>

          {mode === "home" && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMode("create")}
                disabled={!isConnected}
                className="w-full py-4 rounded-xl font-black text-lg bg-neon-green text-dark-900 hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + Create Room
              </button>
              <button
                onClick={() => setMode("join")}
                disabled={!isConnected}
                className="w-full py-4 rounded-xl font-black text-lg border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                → Join Room
              </button>
            </div>
          )}

          {mode === "create" && (
            <div className="animate-slide-up">
              <button
                onClick={handleCreate}
                disabled={loading === "create"}
                className="w-full py-4 rounded-xl font-black text-lg bg-neon-green text-dark-900 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading === "create" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Creating room on
                    Bradbury...
                  </span>
                ) : (
                  "🚀 Create Room"
                )}
              </button>
              <button
                onClick={() => setMode("home")}
                className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {mode === "join" && (
            <div className="animate-slide-up">
              <label className="block text-xs font-bold text-neon-purple uppercase tracking-widest mb-2">
                Room Code
              </label>
              <input
                type="text"
                placeholder="ABC123"
                value={roomIdInput}
                onChange={(e) =>
                  setRoomIdInput(e.target.value.toUpperCase().slice(0, 6))
                }
                className="w-full bg-dark-700 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple transition-colors mb-3 text-center text-2xl font-mono tracking-widest"
              />
              <button
                onClick={handleJoin}
                disabled={loading === "join"}
                className="w-full py-4 rounded-xl font-black text-lg border border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading === "join" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⟳</span> Joining...
                  </span>
                ) : (
                  "→ Join Game"
                )}
              </button>
              <button
                onClick={() => setMode("home")}
                className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-950 border border-red-800 text-red-400 text-sm animate-fade-in">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* GenLayer Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-dark-800">
            <Zap className="w-3 h-3 text-neon-green" />
            <span className="text-xs text-slate-500">
              Powered by{" "}
              <span className="text-neon-green font-semibold">
                GenLayer Intelligent Contracts
              </span>{" "}
              on Bradbury Testnet
            </span>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-6 glass rounded-xl p-4 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            How it works
          </h3>
          <div className="space-y-2 text-sm text-slate-500">
            <div className="flex gap-2">
              <span className="text-neon-green">01</span>
              <span>
                Read a mystery text snippet from around the world 🌍
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-neon-green">02</span>
              <span>Guess the country, language & year in 60 seconds ⏱</span>
            </div>
            <div className="flex gap-2">
              <span className="text-neon-green">03</span>
              <span>
                AI validators on GenLayer score your guess via{" "}
                <span className="text-neon-purple">Optimistic Democracy</span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-neon-green">04</span>
              <span>
                <Trophy className="w-3 h-3 inline text-yellow-400 mr-1" />
                Earn XP stored on-chain. No cheating possible!
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
