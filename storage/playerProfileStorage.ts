// storage/playerProfileStorage.ts
import { storage } from '.';
import { PlayerProfile } from '../types/player';
import {
  DEFAULT_PLAYER_ID,
  STORAGE_KEY_CURRENT_PLAYER_ID,
  STORAGE_KEY_PLAYERS,
} from '../utils/constants';

const getAllPlayers = (): PlayerProfile[] => {
  try {
    const raw = storage.getString(STORAGE_KEY_PLAYERS);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const savePlayers = (players: PlayerProfile[]) => {
  try {
    storage.set(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  } catch (_) {}
};

const clearPlayers = () => {
  try {
    storage.delete(STORAGE_KEY_PLAYERS);
  } catch (_) {}
};

const getCurrentPlayerId = (): string => {
  try {
    const id = storage.getString(STORAGE_KEY_CURRENT_PLAYER_ID);
    return id || DEFAULT_PLAYER_ID;
  } catch (_) {
    return DEFAULT_PLAYER_ID;
  }
};

const setCurrentPlayerId = (id: string) => {
  try {
    storage.set(STORAGE_KEY_CURRENT_PLAYER_ID, id);
  } catch (_) {}
};

const clearCurrentPlayerId = () => {
  try {
    storage.delete(STORAGE_KEY_CURRENT_PLAYER_ID);
  } catch (_) {}
};

const getCurrentPlayer = (): PlayerProfile | null => {
  try {
    const id = getCurrentPlayerId();
    const all = getAllPlayers();
    return all.find((p) => p.id === id) || null;
  } catch (_) {
    return null;
  }
};

const getPlayerById = (id: string): PlayerProfile | null => {
  try {
    const all = getAllPlayers();
    return all.find((p) => p.id === id) || null;
  } catch (_) {
    return null;
  }
};

const updatePlayer = (player: PlayerProfile) => {
  try {
    const all = getAllPlayers();
    const updated = all.map((p) => (p.id === player.id ? player : p));
    savePlayers(updated);
  } catch (_) {}
};

const clearAll = () => {
  try {
    clearPlayers();
    clearCurrentPlayerId();
  } catch (_) {}
};

export const playerProfileStorage = {
  getAllPlayers,
  savePlayers,
  getCurrentPlayerId,
  setCurrentPlayerId,
  getCurrentPlayer,
  clearCurrentPlayerId,
  clearPlayers,
  clearAll,
  getPlayerById,
  updatePlayer,
};
