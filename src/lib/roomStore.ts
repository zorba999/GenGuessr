import { selectArticles } from "./articles";
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
  } catch {}
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
    article_indices: selectArticles(roomId),
    total_scores: {},
  };
  const store = getStore();
  store.set(roomId, room);
  saveToDisk(store);
  return room;
}

export function getRoom(roomId: string): RoomState | null {
  return getStore().get(roomId) ?? null;
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
