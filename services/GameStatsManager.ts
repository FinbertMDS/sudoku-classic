// GameStatsManager.ts

import uuid from 'react-native-uuid';
import { GameEndedCoreEvent } from '../events/types';
import { statsStorage } from '../storage';
import {
  GameLogEntry,
  GameStats,
  GameStatsCache,
  InitGame,
  Level,
  TimeRange,
} from '../types';
import { getTodayDateString, isInTimeRange } from '../utils/dateUtil';
import { getStatsFromLogs } from '../utils/statsUtil';

export const GameStatsManager = {
  async shouldUpdateStatsCache(): Promise<boolean> {
    const lastUpdateStr = await statsStorage.getLastStatsCacheUpdate();

    const today = getTodayDateString(); // e.g., '2025-04-30'
    const isUpdatedToday = lastUpdateStr === today;
    return !isUpdatedToday;
  },

  async getStatsWithCache(
    logs: GameLogEntry[],
    filter: TimeRange,
  ): Promise<Record<Level, GameStats>> {
    try {
      const cache: GameStatsCache = await statsStorage.getStatsCache();

      if (cache[filter]) {
        return cache[filter]!;
      }

      const computedStats = getStatsFromLogs(logs, filter);
      const updatedCache = { ...cache, [filter]: computedStats };

      await statsStorage.saveStatsCache(updatedCache);

      return computedStats;
    } catch (error) {
      console.warn('Failed to get stats with cache:', error);
      return getStatsFromLogs(logs, filter); // fallback
    }
  },

  async updateStatsWithAllCache(
    logs: GameLogEntry[],
    affectedRanges: TimeRange[],
  ): Promise<void> {
    try {
      const cache: GameStatsCache = await statsStorage.getStatsCache();

      const updatedCache: GameStatsCache = { ...cache };

      for (const range of affectedRanges) {
        const updatedStats = getStatsFromLogs(logs, range);
        updatedCache[range] = updatedStats;
      }

      await statsStorage.saveStatsCache(updatedCache);
    } catch (error) {
      console.warn('Failed to update stats cache:', error);
    }
  },

  async updateStatsWithCache(
    logs: GameLogEntry[],
    updatedLogs: GameLogEntry[],
  ): Promise<void> {
    try {
      const cache: GameStatsCache = await statsStorage.getStatsCache();

      // Xác định các khoảng thời gian cần cập nhật lại
      const rangesToUpdate = new Set<TimeRange>();

      updatedLogs.forEach(log => {
        if (isInTimeRange(log.date, 'today')) {
          rangesToUpdate.add('today');
        }
        if (isInTimeRange(log.date, 'week')) {
          rangesToUpdate.add('week');
        }
        if (isInTimeRange(log.date, 'month')) {
          rangesToUpdate.add('month');
        }
        if (isInTimeRange(log.date, 'year')) {
          rangesToUpdate.add('year');
        }
      });
      rangesToUpdate.add('all'); // luôn luôn cập nhật all

      const updatedCache = { ...cache };

      for (const range of rangesToUpdate) {
        updatedCache[range] = getStatsFromLogs(logs, range);
      }

      await statsStorage.saveStatsCache(updatedCache);
    } catch (error) {
      console.warn('Failed to update stats with cache:', error);
    }
  },

  async getLog(id: string): Promise<GameLogEntry | null> {
    try {
      const logs = await this.getLogs();
      const log = logs.find(_log => _log.id === id);
      if (log) {
        return log;
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return null;
  },

  async getLogs(): Promise<GameLogEntry[]> {
    try {
      return statsStorage.getGameLogs();
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return [];
  },

  /**
   * Saves a log entry to AsyncStorage.
   * If override is true, it will replace the existing log with the same ID.
   * If override is false, it will append the new log to the existing logs.
   */
  async saveLog(log: GameLogEntry, override: boolean = true) {
    try {
      const existing = await this.getLogs();
      if (override) {
        const index = existing.findIndex(_log => _log.id === log.id);
        if (index !== -1) {
          existing[index] = log;
        } else {
          console.warn('Log not found for override:', log.id);
          return;
        }
      } else {
        existing.unshift(log);
      }

      await statsStorage.saveGameLogs(existing);
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  /**
   * Saves multiple log entries to AsyncStorage.
   * If append is true, it will append the new logs to the existing logs.
   * If append is false, it will replace the existing logs with the new logs.
   */
  async saveLogs(logs: GameLogEntry[], append: boolean = true) {
    try {
      let updated: GameLogEntry[] = logs;
      if (append) {
        const existing = await this.getLogs();
        const sortedLogs = logs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        updated = [...sortedLogs, ...existing];
      }

      await statsStorage.saveGameLogs(updated);
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  async recordGameStart(initGame: InitGame): Promise<GameLogEntry> {
    const newEntry: GameLogEntry = {
      id: initGame.id,
      level: initGame.savedLevel,
      date: new Date().toISOString(),
      durationSeconds: 0,
      completed: false,
      mistakes: 0,
    };

    await this.saveLog(newEntry, false);
    return newEntry;
  },

  async recordGameWin(payload: GameEndedCoreEvent) {
    // 👉 Record daily log
    const oldEntry = await this.getLog(payload.id);
    let newEntry: GameLogEntry;
    if (oldEntry) {
      newEntry = {
        ...oldEntry,
        completed: true,
        durationSeconds: payload.timePlayed,
        endTime: new Date().toISOString(),
        mistakes: payload.mistakes,
      };
    } else {
      newEntry = {
        id: uuid.v4().toString(),
        level: payload.level,
        date: new Date().toISOString(),
        durationSeconds: payload.timePlayed,
        completed: true,
        endTime: new Date().toISOString(),
        mistakes: payload.mistakes,
      };
    }
    await this.saveLog(newEntry, true);
    return newEntry;
  },

  async resetStatistics() {
    try {
      await statsStorage.clearStatsData();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
