"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Clock, MapPin, Globe, Calendar } from "lucide-react";
import type { RoomState, ArticleContent } from "@/lib/types";

const ROUND_DURATION = 60;

interface Props {
  roomState: RoomState;
  article: ArticleContent;
  playerName: string;
  isHost: boolean;
  guessSubmitted: boolean;
  onSubmitGuess: (country: string, language: string, year: number) => void;
  onTimerEnd?: () => void;
}

export default function GameScreen({
  roomState,
  article,
  playerName,
  isHost,
  guessSubmitted,
  onSubmitGuess,
  onTimerEnd,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState(2020);
  const [submitted, setSubmitted] = useState(guessSubmitted);
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimerEndRef = useRef(onTimerEnd);
  const timerEndCalled = useRef(false);

  useEffect(() => {
    onTimerEndRef.current = onTimerEnd;
  }, [onTimerEnd]);

  useEffect(() => {
    setSubmitted(guessSubmitted);
  }, [guessSubmitted]);

  useEffect(() => {
    setDisplayedText("");
    setTimeLeft(ROUND_DURATION);
    timerEndCalled.current = false;
    let charIdx = 0;
    const content = article.content;
    const typeInterval = setInterval(() => {
      if (charIdx < content.length) {
        setDisplayedText(content.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typeInterval);
      }
    }, 18);
    return () => clearInterval(typeInterval);
  }, [article.round, article.content]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!timerEndCalled.current) {
            timerEndCalled.current = true;
            onTimerEndRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [article.round]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!country.trim() || !language.trim()) return;
    setSubmitted(true);
    onSubmitGuess(country.trim(), language.trim(), year);
  }

  const progress = (timeLeft / ROUND_DURATION) * 100;
  const timerColor =
    timeLeft > 30 ? "#00ff88" : timeLeft > 10 ? "#fbbf24" : "#ef4444";
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Round
          </div>
          <div className="text-2xl font-black text-white">
            {article.round}
            <span className="text-slate-600">/{article.total_rounds}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
            width="96"
            height="96"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
          <div className="text-center z-10">
            <div
              className="text-2xl font-black font-mono"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </div>
            <div className="text-slate-600 text-xs">
              <Clock className="w-3 h-3 inline" />
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
            Players
          </div>
          <div className="flex gap-1 justify-end">
            {roomState.players.map((p) => (
              <div
                key={p}
                title={p}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-xs"
              >
                {p[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="glass neon-border rounded-2xl p-6 mb-6 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-neon-green" />
          <span className="text-xs font-bold text-neon-green uppercase tracking-widest">
            Mystery Text
          </span>
          <span className="ml-auto text-xs text-slate-600 font-mono">
            {playerName}
          </span>
        </div>
        <div className="font-mono text-slate-200 text-base leading-relaxed min-h-[120px] border-l-2 border-neon-green/30 pl-4">
          {displayedText}
          <span className="animate-pulse text-neon-green">▋</span>
        </div>
      </div>

      {/* Guess Form */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="glass neon-border-purple rounded-2xl p-5 space-y-4 animate-slide-up"
        >
          <div className="text-xs font-bold text-neon-purple uppercase tracking-widest mb-1">
            Your Guess
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <MapPin className="w-3 h-3" /> Country
              </label>
              <input
                type="text"
                placeholder="e.g. Japan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full bg-dark-700 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple text-sm transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Globe className="w-3 h-3" /> Language
              </label>
              <input
                type="text"
                placeholder="e.g. Japanese"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                className="w-full bg-dark-700 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Calendar className="w-3 h-3" /> Year:{" "}
              <span className="text-neon-purple font-bold text-sm">{year}</span>
            </label>
            <input
              type="range"
              min="2010"
              max="2024"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-2 appearance-none bg-slate-700 rounded-full cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>2010</span>
              <span>2024</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={timeLeft === 0}
            className="w-full py-3 rounded-xl font-black text-base bg-neon-purple text-white hover:brightness-110 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          >
            🎯 Submit Guess
          </button>
        </form>
      ) : (
        <div className="glass neon-border rounded-2xl p-6 text-center animate-fade-in">
          <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-3" />
          <div className="text-xl font-black text-neon-green mb-2">
            Guess Submitted!
          </div>
          <div className="text-slate-400 text-sm mb-4">
            Waiting for other players...
          </div>
          <div className="flex gap-4 justify-center text-sm">
            <div className="glass px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-500">Country:</span>{" "}
              <span className="text-white font-bold">{country || "—"}</span>
            </div>
            <div className="glass px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-500">Language:</span>{" "}
              <span className="text-white font-bold">{language || "—"}</span>
            </div>
            <div className="glass px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-500">Year:</span>{" "}
              <span className="text-white font-bold">{year}</span>
            </div>
          </div>
          {isHost && timeLeft > 0 && (
            <p className="text-xs text-slate-600 mt-3">
              Round ends automatically when timer hits 0
            </p>
          )}
        </div>
      )}
    </div>
  );
}
