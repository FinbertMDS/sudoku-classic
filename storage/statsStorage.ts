import { DailyStats, GameLogEntry, GameStatsCache } from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
} from '../utils/constants';
import { getTodayDateString } from '../utils/dateUtil';
import { deleteItem, getItem, saveItem } from './storage';

const saveGameLogs = async (logs: GameLogEntry[]) => {
  try {
    await saveItem(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));
  } catch (_) {}
};

const getGameLogs = async (): Promise<GameLogEntry[]> => {
  try {
    return (await getItem<GameLogEntry[]>(STORAGE_KEY_GAME_LOGS)) || [];
  } catch (_) {
    return [];
  }
};

const saveStatsCache = async (cache: GameStatsCache) => {
  try {
    await saveItem(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));
  } catch (_) {}
};

const getStatsCache = async (): Promise<GameStatsCache> => {
  try {
    return (await getItem<GameStatsCache>(STORAGE_KEY_GAME_STATS_CACHE)) || {};
  } catch (_) {
    return {};
  }
};

const saveDailyStats = async (dailyStats: DailyStats[]) => {
  try {
    await saveItem(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));
  } catch (_) {}
};

const getDailyStats = async (): Promise<DailyStats[]> => {
  try {
    return (await getItem<DailyStats[]>(STORAGE_KEY_DAILY_STATS)) || [];
  } catch (_) {
    return [];
  }
};

const setLastStatsCacheUpdate = async () => {
  const today = getTodayDateString();
  try {
    await saveItem(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
  } catch (_) {}
};

const getLastStatsCacheUpdate = async (): Promise<string | null> => {
  try {
    return await getItem<string>(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
  } catch (_) {
    return null;
  }
};

const clearStatsData = async () => {
  try {
    await deleteItem(STORAGE_KEY_DAILY_STATS);
    await deleteItem(STORAGE_KEY_GAME_LOGS);
    await deleteItem(STORAGE_KEY_GAME_STATS_CACHE);
    await deleteItem(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
  } catch (_) {}
};

export const statsStorage = {
  saveGameLogs,
  getGameLogs,
  saveStatsCache,
  getStatsCache,
  saveDailyStats,
  getDailyStats,
  setLastStatsCacheUpdate,
  getLastStatsCacheUpdate,
  clearStatsData,
};
