// GameStatsManager.ts

import uuid from 'react-native-uuid';
import {GameEndedCoreEvent} from '../events/types';
import {playerProfileStorage, statsStorage} from '../storage';
import {
  GameLogEntryV2,
  GameStats,
  GameStatsCache,
  InitGame,
  Level,
  TimeRange,
} from '../types';
import {getTodayDateString, isInTimeRange} from '../utils/dateUtil';
import {getStatsFromLogs} from '../utils/statsUtil';

export const StatsService = {
  async shouldUpdateStatsCache(): Promise<boolean> {
    const lastUpdateStr = statsStorage.getLastStatsCacheUpdate();
    const lastUpdateUserId = statsStorage.getLastStatsCacheUpdateUserId();
    const currentPlayerId = playerProfileStorage.getCurrentPlayerId();

    if (lastUpdateUserId !== currentPlayerId) {
      return true;
    }

    const today = getTodayDateString(); // e.g., '2025-04-30'
    const isUpdatedToday = lastUpdateStr === today;
    return !isUpdatedToday;
  },

  async getStatsWithCache(
    logs: GameLogEntryV2[],
    filter: TimeRange,
    userId: string,
  ): Promise<Record<Level, GameStats>> {
    try {
      const cache: GameStatsCache = statsStorage.getStatsCache();

      if (cache[filter]) {
        return cache[filter]!;
      }

      const computedStats = getStatsFromLogs(logs, filter, userId);
      const updatedCache = {...cache, [filter]: computedStats};

      statsStorage.saveStatsCache(updatedCache);

      return computedStats;
    } catch (error) {
      console.warn('Failed to get stats with cache:', error);
      return getStatsFromLogs(logs, filter, userId); // fallback
    }
  },

  async updateStatsWithAllCache(
    logs: GameLogEntryV2[],
    affectedRanges: TimeRange[],
    userId: string,
  ): Promise<void> {
    try {
      const cache: GameStatsCache = statsStorage.getStatsCache();

      const updatedCache: GameStatsCache = {...cache};

      for (const range of affectedRanges) {
        const updatedStats = getStatsFromLogs(logs, range, userId);
        updatedCache[range] = updatedStats;
      }

      statsStorage.saveStatsCache(updatedCache);
    } catch (error) {
      console.warn('Failed to update stats cache:', error);
    }
  },

  async updateStatsDone(): Promise<void> {
    statsStorage.setLastStatsCacheUpdate();
    statsStorage.setLastStatsCacheUpdateUserId(
      playerProfileStorage.getCurrentPlayerId(),
    );
  },

  async updateStatsWithCache(
    logs: GameLogEntryV2[],
    updatedLogs: GameLogEntryV2[],
    userId: string,
  ): Promise<void> {
    try {
      const cache: GameStatsCache = statsStorage.getStatsCache();

      // Xác định các khoảng thời gian cần cập nhật lại
      const rangesToUpdate = new Set<TimeRange>();

      updatedLogs.forEach((log) => {
        if (isInTimeRange(log.endTime, 'today')) {
          rangesToUpdate.add('today');
        }
        if (isInTimeRange(log.endTime, 'week')) {
          rangesToUpdate.add('week');
        }
        if (isInTimeRange(log.endTime, 'month')) {
          rangesToUpdate.add('month');
        }
        if (isInTimeRange(log.endTime, 'year')) {
          rangesToUpdate.add('year');
        }
      });
      rangesToUpdate.add('all'); // luôn luôn cập nhật all

      const updatedCache = {...cache};

      for (const range of rangesToUpdate) {
        updatedCache[range] = getStatsFromLogs(logs, range, userId);
      }

      statsStorage.saveStatsCache(updatedCache);
    } catch (error) {
      console.warn('Failed to update stats with cache:', error);
    }
  },

  async getLog(id: string): Promise<GameLogEntryV2 | null> {
    try {
      const logs = await this.getLogs();
      const log = logs.find((_log) => _log.id === id);
      if (log) {
        return log;
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return null;
  },

  async getLogs(): Promise<GameLogEntryV2[]> {
    try {
      return statsStorage.getGameLogsV2();
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return [];
  },

  async getLogsDone(): Promise<GameLogEntryV2[]> {
    try {
      const logs = await this.getLogs();
      return logs.filter((log) => log.durationSeconds > 0);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return [];
  },

  async getLogsByPlayerId(playerId: string): Promise<GameLogEntryV2[]> {
    try {
      return statsStorage.getGameLogsV2ByPlayerId(playerId);
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
  async saveLog(log: GameLogEntryV2, override: boolean = true) {
    try {
      const existing = await this.getLogs();
      if (override) {
        const index = existing.findIndex((_log) => _log.id === log.id);
        if (index !== -1) {
          existing[index] = log;
        } else {
          console.warn('Log not found for override:', log.id);
          return;
        }
      } else {
        existing.unshift(log);
      }

      statsStorage.saveGameLogsV2(existing);
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  /**
   * Saves multiple log entries to AsyncStorage.
   * If append is true, it will append the new logs to the existing logs.
   * If append is false, it will replace the existing logs with the new logs.
   */
  async saveLogs(logs: GameLogEntryV2[], append: boolean = true) {
    try {
      let updated: GameLogEntryV2[] = logs;
      if (append) {
        const existing = await this.getLogs();
        const sortedLogs = logs.sort(
          (a, b) =>
            new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
        );
        updated = [...sortedLogs, ...existing];
      }

      statsStorage.saveGameLogsV2(updated);
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  async recordGameStart(initGame: InitGame): Promise<GameLogEntryV2> {
    const newEntry: GameLogEntryV2 = {
      id: initGame.id,
      level: initGame.savedLevel,
      completed: false,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: 0,
      mistakes: 0,
      hintCount: 0,
      playerId: playerProfileStorage.getCurrentPlayerId(),
    };

    await this.saveLog(newEntry, false);
    return newEntry;
  },

  async recordGameEnd(payload: GameEndedCoreEvent) {
    // 👉 Record daily log
    const oldEntry = await this.getLog(payload.id);
    let newEntry: GameLogEntryV2;
    if (oldEntry) {
      newEntry = {
        ...oldEntry,
        completed: payload.completed,
        endTime: new Date().toISOString(),
        durationSeconds: payload.timePlayed,
        mistakes: payload.mistakes,
        hintCount: payload.hintCount,
      };
      await this.saveLog(newEntry, true);
    } else {
      newEntry = {
        id: uuid.v4().toString(),
        playerId: playerProfileStorage.getCurrentPlayerId(),
        level: payload.level,
        completed: payload.completed,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationSeconds: payload.timePlayed,
        mistakes: payload.mistakes,
        hintCount: payload.hintCount,
      };
      await this.saveLog(newEntry, false);
    }
    return newEntry;
  },

  async resetStatistics() {
    try {
      statsStorage.clearStatsData();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};
