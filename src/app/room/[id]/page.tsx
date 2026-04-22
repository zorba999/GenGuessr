"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { shortenAddress } from "@/lib/wagmi";
import type { RoomState, ArticleContent, RoundResultsData } from "@/lib/types";
import LobbyScreen from "@/components/game/LobbyScreen";
import GameScreen from "@/components/game/GameScreen";
import ScoringScreen from "@/components/game/ScoringScreen";
import RoundResultsScreen from "@/components/game/RoundResultsScreen";
import FinalResultsScreen from "@/components/game/FinalResultsScreen";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  const { address } = useAccount();
  const playerName = address ? shortenAddress(address) : (localStorage.getItem("playerName") || "Anonymous");
  const [isHost, setIsHost] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResultsData | null>(null);
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPhaseRef = useRef<string | null>(null);
  const prevRoundRef = useRef<number | null>(null);
  const articleContentRef = useRef<ArticleContent | null>(null);

  useEffect(() => {
    const host = localStorage.getItem("isHost") === "true";
    setIsHost(host);
  }, []);

  const fetchRoomState = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomId}`);
      if (res.status === 404) return;
      if (!res.ok) return;
      const data: RoomState = await res.json();
      setRoomState(data);

      const phaseChanged = prevPhaseRef.current !== data.phase;
      const roundChanged = prevRoundRef.current !== data.current_round;

      if (data.phase === "playing") {
        if (phaseChanged || roundChanged) {
          setGuessSubmitted(false);
          setArticleContent(null);
        }
        if (phaseChanged || roundChanged || !articleContentRef.current) {
          const artRes = await fetch(`/api/article/${roomId}`);
          if (artRes.ok) {
            const artData: ArticleContent = await artRes.json();
            setArticleContent(artData);
            articleContentRef.current = artData;
          }
        }
      }

      if (data.phase === "round_results") {
        const roundToFetch = data.current_round;
        const resRes = await fetch(`/api/results/${roomId}?round=${roundToFetch}`);
        if (resRes.ok) {
          const resData: RoundResultsData = await resRes.json();
          setRoundResults(resData);
          if (resData.results.length > 0 && Object.keys(data.total_scores ?? {}).length === 0) {
            const newTotals: Record<string, number> = { ...data.total_scores };
            resData.results.forEach((r) => {
              newTotals[r.player] = (newTotals[r.player] ?? 0) + r.total_score;
            });
            setRoomState({ ...data, total_scores: newTotals });
          }
        }
      }

      if (data.phase !== "playing") {
        articleContentRef.current = null;
      }
      prevPhaseRef.current = data.phase;
      prevRoundRef.current = data.current_round;
    } catch (e) {
      console.error("[fetchRoomState]", e);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoomState();
    pollRef.current = setInterval(fetchRoomState, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchRoomState]);

  async function handleStartGame() {
    try {
      const res = await fetch(`/api/room/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) setRoomState(data.room);
        const artRes = await fetch(`/api/article/${roomId}`);
        if (artRes.ok) {
          const artData: ArticleContent = await artRes.json();
          setArticleContent(artData);
          articleContentRef.current = artData;
          prevPhaseRef.current = "playing";
        }
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Failed to start game");
    }
  }

  async function handleSubmitGuess(country: string, language: string, year: number) {
    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerName, country, language, year }),
      });
      if (res.ok) {
        setGuessSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Failed to submit guess");
    }
  }

  async function handleEvaluate() {
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Failed to evaluate round");
    }
  }

  async function handleNextRound() {
    try {
      const res = await fetch(`/api/room/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "next_round" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.room) {
          setRoomState(data.room);
          prevPhaseRef.current = data.room.phase;
          prevRoundRef.current = data.room.current_round;
          setRoundResults(null);
          articleContentRef.current = null;
          if (data.room.phase === "playing") {
            setGuessSubmitted(false);
            setArticleContent(null);
            const artRes = await fetch(`/api/article/${roomId}`);
            if (artRes.ok) {
              const artData: ArticleContent = await artRes.json();
              setArticleContent(artData);
              articleContentRef.current = artData;
            }
          }
        }
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("Failed to advance round");
    }
  }

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-neon-green/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-neon-green/40 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🌍</div>
          </div>
          <div className="text-neon-green font-mono text-lg font-bold mb-2">
            Creating Room on-chain...
          </div>
          <div className="text-slate-400 text-sm mb-4 leading-relaxed">
            GenLayer validators are processing your transaction via
            <span className="text-neon-purple"> Optimistic Democracy</span>.
            This takes ~1 min.
          </div>
          <div className="glass neon-border rounded-xl p-3 text-xs font-mono text-slate-500">
            Room: <span className="text-neon-green">{roomId}</span>
          </div>
          <div className="mt-4 text-xs text-slate-600 animate-pulse-slow">
            Polling every 3s...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-red-950 border border-red-700 rounded-lg text-red-300 text-sm animate-fade-in">
          ⚠ {error}
          <button onClick={() => setError("")} className="ml-3 text-red-500">✕</button>
        </div>
      )}

      {roomState.phase === "waiting" && (
        <LobbyScreen
          roomState={roomState}
          roomId={roomId}
          playerName={playerName}
          isHost={isHost}
          onStart={handleStartGame}
        />
      )}

      {roomState.phase === "playing" && articleContent && (
        <GameScreen
          roomState={roomState}
          article={articleContent}
          playerName={playerName}
          isHost={isHost}
          guessSubmitted={guessSubmitted}
          onSubmitGuess={handleSubmitGuess}
          onTimerEnd={isHost ? handleEvaluate : undefined}
        />
      )}

      {roomState.phase === "playing" && !articleContent && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">🌍</div>
            <div className="text-neon-green font-mono">Loading article...</div>
          </div>
        </div>
      )}

      {roomState.phase === "scoring" && (
        <ScoringScreen roomState={roomState} />
      )}

      {roomState.phase === "round_results" && roundResults && (
        <RoundResultsScreen
          roomState={roomState}
          results={roundResults}
          isHost={isHost}
          onNextRound={handleNextRound}
        />
      )}

      {roomState.phase === "round_results" && !roundResults && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">⚡</div>
            <div className="text-neon-green font-mono">Loading results...</div>
          </div>
        </div>
      )}

      {roomState.phase === "results" && (
        <FinalResultsScreen roomState={roomState} playerName={playerName} />
      )}
    </div>
  );
}
