import { selectArticles } from "./articles";
import type { GamePhase, RoomState } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __roomStore: Map<string, RoomState> | undefined;
}

function getStore(): Map<string, RoomState> {
  if (!global.__roomStore) {
    global.__roomStore = new Map<string, RoomState>();
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
    total_rounds: 3,
    article_indices: selectArticles(roomId),
    total_scores: {},
  };
  getStore().set(roomId, room);
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
  }
  return room;
}

export function updateRoom(roomId: string, updates: Partial<RoomState>): RoomState | null {
  const store = getStore();
  const room = store.get(roomId);
  if (!room) return null;
  const updated = { ...room, ...updates };
  store.set(roomId, updated);
  return updated;
}

export function setPhase(roomId: string, phase: GamePhase): RoomState | null {
  return updateRoom(roomId, { phase });
}
