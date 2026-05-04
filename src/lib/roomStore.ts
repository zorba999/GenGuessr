import { selectArticles, generateArticleSeed } from "./articles";
import type { GamePhase, RoomState } from "./types";
import fs from "fs";
import path from "path";

const TOTAL_ROUNDS = 5;

declare global {
  // eslint-disable-next-line no-var
  var __roomStore: Map<string, RoomState> | undefined;
}

const PERSIST_FILE = path.join(process.cwd(), ".rooms.json");

function loadFromDisk(): Map<string, RoomState> {
  try {
    if (fs.existsSync(PERSIST_FILE)) {
      const raw = fs.readFileSync(PERSIST_FILE, "utf-8");
      const obj = JSON.parse(raw) as Record<string, RoomState>;
      return new Map(Object.entries(obj));
    }
  } catch {}
  return new Map<string, RoomState>();
}

function saveToDisk(store: Map<string, RoomState>) {
  try {
    const obj: Record<string, RoomState> = {};
    store.forEach((v, k) => { obj[k] = v; });
    fs.writeFileSync(PERSIST_FILE, JSON.stringify(obj), "utf-8");
  } catch (e) {
    console.error("[roomStore] saveToDisk failed:", e);
  }
}

function getStore(): Map<string, RoomState> {
  if (!global.__roomStore) {
    global.__roomStore = loadFromDisk();
  }
  return global.__roomStore;
}

export function createRoom(roomId: string, hostName: string): RoomState {
  const room: RoomState = {
    room_id: roomId,
    host: hostName,
    players: [hostName],
    phase: "waiting",
    current_round: 0,
    total_rounds: TOTAL_ROUNDS,
    article_indices: selectArticles(generateArticleSeed()),
    total_scores: {},
  };
  const store = getStore();
  store.set(roomId, room);
  saveToDisk(store);
  return room;
}

export function getRoom(roomId: string): RoomState | null {
  const store = getStore();
  if (!store.has(roomId) && store.size === 0) {
    const reloaded = loadFromDisk();
    reloaded.forEach((v, k) => store.set(k, v));
    console.warn(`[roomStore] store was empty, reloaded ${store.size} rooms from disk`);
  }
  return store.get(roomId) ?? null;
}

export function joinRoom(roomId: string, playerName: string): RoomState | null {
  const store = getStore();
  const room = store.get(roomId);
  if (!room) return null;
  if (room.phase !== "waiting") return room;
  if (!room.players.includes(playerName)) {
    room.players = [...room.players, playerName];
    store.set(roomId, room);
    saveToDisk(store);
  }
  return room;
}

export function updateRoom(roomId: string, updates: Partial<RoomState>): RoomState | null {
  const store = getStore();
  const room = store.get(roomId);
  if (!room) return null;
  const updated = { ...room, ...updates };
  store.set(roomId, updated);
  saveToDisk(store);
  return updated;
}

export function setPhase(roomId: string, phase: GamePhase): RoomState | null {
  return updateRoom(roomId, { phase });
}

declare global {
  // eslint-disable-next-line no-var
  var __guessStore: Map<string, { player: string; country: string; language: string; year: number }[]> | undefined;
}

function getGuessStore() {
  if (!global.__guessStore) global.__guessStore = new Map();
  return global.__guessStore;
}

export function saveGuess(roomId: string, round: number, player: string, country: string, language: string, year: number) {
  const store = getGuessStore();
  const key = `${roomId}:${round}`;
  const guesses = store.get(key) ?? [];
  const existing = guesses.findIndex((g) => g.player === player);
  const entry = { player, country, language, year };
  if (existing >= 0) guesses[existing] = entry;
  else guesses.push(entry);
  store.set(key, guesses);
}

export function getRoundGuesses(roomId: string, round: number) {
  return getGuessStore().get(`${roomId}:${round}`) ?? [];
}
