// src/utils/leaderboardUtil.ts

import {TFunction} from 'i18next';
import {PlayerService, StatsService} from '../services';
import {
  GameLogEntryV2,
  Level,
  LevelStatEntry,
  PlayerProfile,
  PlayerStats,
  RankedPlayer,
} from '../types';
import {LEVEL_PRIORITY, LEVEL_WEIGHT, MAX_TIMEPLAYED} from './constants';
import {generateOverallRankingNotes, getPlayerNotes} from './playerNotesUtil';

export const calculatePlayerScore = (stat: PlayerStats): RankedPlayer => {
  let totalWeightedWins = 0;
  let winScore = 0;
  let avgTimePenalty = 0;

  for (const level of LEVEL_PRIORITY) {
    const lvlStat = stat.byLevel?.[level];
    if (!lvlStat) {
      continue;
    }

    const weight = LEVEL_WEIGHT[level];
    const wins = lvlStat.wins;
    const avgTime = lvlStat.avgTime;

    totalWeightedWins += wins * weight;
    winScore += (wins / (wins || 1)) * weight; // 1.0 * weight
    avgTimePenalty += (10000 / avgTime) * weight; // thấp avgTime thì điểm cao
  }

  // Kết hợp 2 yếu tố thành score cuối cùng
  const score = totalWeightedWins + winScore + avgTimePenalty * 0.01;

  return {
    ...stat,
    score,
    totalWeightedWins,
  };
};

const getSpeedScore = (logs: GameLogEntryV2[]): number | undefined => {
  const completed = logs.filter((l) => l.completed);
  if (completed.length === 0) {
    return undefined;
  }

  const totalNormalizedTime = completed.reduce((sum, log) => {
    const weight = LEVEL_WEIGHT[log.level] || 1;
    return sum + log.durationSeconds / weight;
  }, 0);

  return totalNormalizedTime / completed.length;
};

export const getRankedPlayers = (allStats: PlayerStats[]): RankedPlayer[] => {
  return allStats
    .map((stat) => calculatePlayerScore(stat))
    .sort((a, b) => b.score - a.score);
};

export const getAllStats = async (): Promise<PlayerStats[]> => {
  try {
    const players: PlayerProfile[] = await PlayerService.getAllPlayers();
    const logs: GameLogEntryV2[] = await StatsService.getLogsDone();

    return players.map((player) => {
      const playerLogs = logs.filter(
        (log) => log.playerId === player.id && log.durationSeconds > 0,
      );
      const completed = playerLogs.filter((log) => log.completed);

      if (completed.length === 0) {
        return {
          player,
          totalGames: playerLogs.length,
          speedScore: undefined,
          completedGames: completed.length,
          totalTime: 0,
          winRate: 0,
        } as PlayerStats;
      }

      const totalTime = completed.reduce(
        (sum, log) => sum + log.durationSeconds,
        0,
      );
      const winRate =
        playerLogs.length > 0 ? completed.length / playerLogs.length : 0;

      // byLevel stats
      const byLevel: PlayerStats['byLevel'] = {};
      for (const level of LEVEL_PRIORITY) {
        const levelLogs = playerLogs.filter((log) => log.level === level);
        const levelCompleted = levelLogs.filter((log) => log.completed);
        const totalLevelTime = levelCompleted.reduce(
          (sum, log) => sum + log.durationSeconds,
          0,
        );

        if (levelLogs.length > 0) {
          byLevel[level] = {
            totalGames: levelLogs.length,
            wins: levelCompleted.length,
            fastestTime:
              levelCompleted.length > 0
                ? Math.min(...levelCompleted.map((log) => log.durationSeconds))
                : MAX_TIMEPLAYED,
            avgTime:
              levelCompleted.length > 0
                ? totalLevelTime / levelCompleted.length
                : MAX_TIMEPLAYED,
          };
        }
      }

      const stat: PlayerStats = {
        player,
        totalGames: playerLogs.length,
        completedGames: completed.length,
        totalTime,
        winRate,
        byLevel,
        speedScore: getSpeedScore(playerLogs),
      };

      return stat;
    });
  } catch (err) {
    console.error('Failed to get all player stats:', err);
    return [];
  }
};

export const getAllPlayerHighlights = async (
  stats: RankedPlayer[],
  t: TFunction,
): Promise<RankedPlayer[]> => {
  const highlights = generateOverallRankingNotes(stats, t);

  return stats.map((stat) => {
    const notes = getPlayerNotes(stat, t);
    stat.notes = notes;

    const highlight = highlights.find((h) => h.id === stat.player.id);
    stat.highlights = highlight?.highlights;
    return stat;
  });
};

export function getLevelStatsForLevel(
  logs: GameLogEntryV2[],
  players: PlayerProfile[],
  level: Level,
): LevelStatEntry[] {
  const levelLogs = logs.filter((log) => log.level === level && log.completed);

  const statsMap = new Map<string, LevelStatEntry>();

  for (const log of levelLogs) {
    const player = players.find((p) => p.id === log.playerId);
    if (!player) {
      continue;
    }

    if (!statsMap.has(player.id)) {
      statsMap.set(player.id, {
        playerId: player.id,
        playerName: player.name,
        completedGames: 0,
        totalDuration: 0,
        avgDuration: 0,
      });
    }

    const stat = statsMap.get(player.id)!;
    stat.completedGames += 1;
    stat.totalDuration += log.durationSeconds;
    stat.avgDuration = stat.totalDuration / stat.completedGames;
  }

  return Array.from(statsMap.values()).sort(
    (a, b) => a.avgDuration - b.avgDuration,
  );
}
