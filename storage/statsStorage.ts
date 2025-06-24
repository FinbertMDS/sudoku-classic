import { storage } from '.';
import { DailyStats, GameLogEntryV2, GameStatsCache } from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE_USER_ID,
} from '../utils/constants';
import { getTodayDateString } from '../utils/dateUtil';

const saveGameLogs = (logs: GameLogEntryV2[]) => {
  try {
    storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));
  } catch (_) {}
};

const getGameLogs = (): GameLogEntryV2[] => {
  try {
    const json = storage.getString(STORAGE_KEY_GAME_LOGS);
    return json ? JSON.parse(json) : [];
  } catch (_) {
    return [];
  }
};

const clearGameLogs = () => {
  try {
    storage.delete(STORAGE_KEY_GAME_LOGS);
  } catch (_) {}
};

const saveGameLogsV2 = (logs: GameLogEntryV2[]) =>
  storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));

const getGameLogsV2 = (): GameLogEntryV2[] => {
  const json = storage.getString(STORAGE_KEY_GAME_LOGS);
  return json ? JSON.parse(json) : [];
};

const getGameLogsV2ByPlayerId = (playerId: string): GameLogEntryV2[] => {
  const logs = getGameLogsV2();
  return logs.filter((log) => log.playerId === playerId);
};

const deleteGameLogsV2ByPlayerId = (playerId: string) => {
  const logs = getGameLogsV2();
  const updated = logs.filter((log) => log.playerId !== playerId);
  saveGameLogsV2(updated);
};

const saveStatsCache = (cache: GameStatsCache) => {
  try {
    storage.set(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));
  } catch (_) {}
};

const getStatsCache = (): GameStatsCache => {
  try {
    const json = storage.getString(STORAGE_KEY_GAME_STATS_CACHE);
    return json ? JSON.parse(json) : {};
  } catch (_) {
    return {};
  }
};

const clearStatsCache = () => {
  try {
    storage.delete(STORAGE_KEY_GAME_STATS_CACHE);
  } catch (_) {}
};

const saveDailyStats = (dailyStats: DailyStats[]) => {
  try {
    storage.set(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));
  } catch (_) {}
};

const getDailyStats = (): DailyStats[] => {
  try {
    const json = storage.getString(STORAGE_KEY_DAILY_STATS);
    return json ? JSON.parse(json) : [];
  } catch (_) {
    return [];
  }
};

const clearDailyStats = () => {
  try {
    storage.delete(STORAGE_KEY_DAILY_STATS);
  } catch (_) {}
};

const setLastStatsCacheUpdate = () => {
  const today = getTodayDateString();
  try {
    storage.set(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
  } catch (_) {}
};

const getLastStatsCacheUpdate = (): string | null => {
  try {
    return storage.getString(STORAGE_KEY_LAST_STATS_CACHE_UPDATE) || null;
  } catch (_) {
    return null;
  }
};

const clearLastStatsCacheUpdate = () => {
  try {
    storage.delete(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
  } catch (_) {}
};

const setLastStatsCacheUpdateUserId = (userId: string) => {
  try {
    storage.set(STORAGE_KEY_LAST_STATS_CACHE_UPDATE_USER_ID, userId);
  } catch (_) {}
};

const getLastStatsCacheUpdateUserId = (): string | null => {
  try {
    return (
      storage.getString(STORAGE_KEY_LAST_STATS_CACHE_UPDATE_USER_ID) || null
    );
  } catch (_) {
    return null;
  }
};

const clearLastStatsCacheUpdateUserId = () => {
  try {
    storage.delete(STORAGE_KEY_LAST_STATS_CACHE_UPDATE_USER_ID);
  } catch (_) {}
};

const clearStatsData = () => {
  try {
    clearDailyStats();
    clearGameLogs();
    clearStatsCache();
    clearLastStatsCacheUpdate();
    clearLastStatsCacheUpdateUserId();
  } catch (_) {}
};

export const statsStorage = {
  saveGameLogs,
  getGameLogs,
  clearGameLogs,
  saveGameLogsV2,
  getGameLogsV2,
  getGameLogsV2ByPlayerId,
  deleteGameLogsV2ByPlayerId,
  saveStatsCache,
  getStatsCache,
  clearStatsCache,
  saveDailyStats,
  getDailyStats,
  clearDailyStats,
  setLastStatsCacheUpdate,
  getLastStatsCacheUpdate,
  clearLastStatsCacheUpdate,
  setLastStatsCacheUpdateUserId,
  getLastStatsCacheUpdateUserId,
  clearLastStatsCacheUpdateUserId,
  clearStatsData,
};
