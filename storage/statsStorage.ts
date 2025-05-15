import { DailyStats, GameLogEntry, GameStatsCache } from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
} from '../utils/constants';
import { getTodayDateString } from '../utils/dateUtil';
import { deleteItem, getItem, saveItem } from './storage';

const saveGameLogs = async (logs: GameLogEntry[]) =>
  await saveItem(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));

const getGameLogs = async (): Promise<GameLogEntry[]> => {
  return await getItem<GameLogEntry[]>(STORAGE_KEY_GAME_LOGS) || [];
};

const saveStatsCache = async (cache: GameStatsCache) =>
  await saveItem(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));

const getStatsCache = async (): Promise<GameStatsCache> => {
  return await getItem<GameStatsCache>(STORAGE_KEY_GAME_STATS_CACHE) || {};
};

const saveDailyStats = async (dailyStats: DailyStats[]) =>
  await saveItem(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));

const getDailyStats = async (): Promise<DailyStats[]> => {
  return await getItem<DailyStats[]>(STORAGE_KEY_DAILY_STATS) || [];
};

const setLastStatsCacheUpdate = async () => {
  const today = getTodayDateString();
  await saveItem(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
};

const getLastStatsCacheUpdate = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
};

const clearStatsData = async () => {
  await deleteItem(STORAGE_KEY_DAILY_STATS);
  await deleteItem(STORAGE_KEY_GAME_LOGS);
  await deleteItem(STORAGE_KEY_GAME_STATS_CACHE);
  await deleteItem(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
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
