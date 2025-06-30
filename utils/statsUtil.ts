import {format, parseISO} from 'date-fns';
import {TFunction} from 'i18next';
import {ColorSchemeName} from 'react-native';
import {
  DailyStats,
  GameLogEntryV2,
  GameStats,
  Level,
  TimeRange,
} from '../types';
import {getLevelColor, levelColors} from './colorUtil';
import {DAILY_STATS_DATE_FORMAT, LEVELS} from './constants';
import {formatShortChartDate, isInTimeRange} from './dateUtil';

export function createEmptyStats(): GameStats {
  return {
    gamesStarted: 0,
    gamesCompleted: 0,
    bestTimeSeconds: null,
    averageTimeSeconds: null,
    totalTimeSeconds: 0,
  };
}

function createLevelMap<T>(defaultValue: () => T): Record<Level, T> {
  return Object.fromEntries(
    LEVELS.map((level) => [level, defaultValue()]),
  ) as Record<Level, T>;
}

export function getStatsFromLogs(
  logs: GameLogEntryV2[],
  filter: TimeRange,
  userId: string,
): Record<Level, GameStats> {
  const statsByLevel: Record<Level, GameStats> = createLevelMap(() =>
    createEmptyStats(),
  );

  const filtered = logs.filter(
    (log) => isInTimeRange(log.endTime, filter) && log.playerId === userId,
  );
  for (const log of filtered) {
    const level = log.level;
    const stats = statsByLevel[level];

    stats.gamesStarted += 1;

    if (log.completed) {
      stats.gamesCompleted += 1;
      stats.totalTimeSeconds += log.durationSeconds;

      if (
        stats.bestTimeSeconds === null ||
        log.durationSeconds < stats.bestTimeSeconds
      ) {
        stats.bestTimeSeconds = log.durationSeconds;
      }
    }
  }

  for (const level of Object.keys(statsByLevel) as Level[]) {
    const stats = statsByLevel[level];
    if (stats.gamesCompleted > 0) {
      stats.averageTimeSeconds = Math.floor(
        stats.totalTimeSeconds / stats.gamesCompleted,
      );
    }
  }

  return statsByLevel;
}

export function getDailyStatsFromLogs(
  logs: GameLogEntryV2[],
  filter: TimeRange,
): DailyStats[] {
  if (logs.length === 0) {
    return [];
  }

  const map = new Map<string, {games: number; totalTimeSeconds: number}>();
  const filtered = logs.filter(
    (log) => log.completed && isInTimeRange(log.endTime, filter),
  );
  filtered.forEach((log) => {
    const date = format(parseISO(log.endTime), DAILY_STATS_DATE_FORMAT);
    const durationSeconds = log.durationSeconds;

    if (!map.has(date)) {
      map.set(date, {games: 1, totalTimeSeconds: durationSeconds});
    } else {
      const current = map.get(date)!;
      current.games += 1;
      current.totalTimeSeconds += durationSeconds;
    }
  });

  const sorted = Array.from(map.entries()).sort(([a], [b]) =>
    b.localeCompare(a),
  );

  return sorted.map(([date, {games, totalTimeSeconds}]) => ({
    date,
    games,
    totalTimeSeconds,
  }));
}

export function convertToPieData(
  logs: GameLogEntryV2[],
  scheme: ColorSchemeName = 'light',
  t: TFunction,
  filter: TimeRange,
) {
  if (logs.length === 0) {
    return [];
  }

  const levelMap: Record<Level, number> = createLevelMap(() => 0);

  const filtered = logs.filter(
    (log) => log.completed && isInTimeRange(log.endTime, filter),
  );
  filtered.forEach((log) => {
    levelMap[log.level]++;
  });

  return Object.entries(levelMap)
    .map(([level, count]) => ({
      name: t(`level.${level}`),
      count,
      color: getLevelColor(level as Level, scheme),
      legendFontColor: scheme === 'dark' ? '#fff' : '#333',
      legendFontSize: 12,
    }))
    .filter((item) => item.count > 0);
}

export function convertToStackedData(
  logs: GameLogEntryV2[],
  scheme: ColorSchemeName = 'light',
  t: TFunction,
  filter: TimeRange,
) {
  if (logs.length === 0) {
    return null;
  }

  const dateMap = new Map<string, Record<Level, number>>();
  const filtered = logs.filter(
    (log) => log.completed && isInTimeRange(log.endTime, filter),
  );
  filtered.forEach((log) => {
    const date = format(parseISO(log.endTime), DAILY_STATS_DATE_FORMAT);
    if (!dateMap.has(date)) {
      dateMap.set(
        date,
        createLevelMap(() => 0),
      );
    }
    dateMap.get(date)![log.level]++;
  });

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) =>
    b.localeCompare(a),
  );

  return {
    labels: sorted.map(([date]) => formatShortChartDate(date)),
    legend: LEVELS.map((level) => t(`level.${level}`)),
    data: sorted.map(([, counts]) => LEVELS.map((l) => counts[l])),
    barColors: LEVELS.map((level) => levelColors[level][scheme!]),
  };
}

export function getGameHistory(
  logs: GameLogEntryV2[],
  filter: TimeRange,
): GameLogEntryV2[] {
  if (logs.length === 0) {
    return [];
  }

  const filtered = logs
    .filter((log) => log.durationSeconds > 0)
    .filter((log) => isInTimeRange(log.endTime, filter))
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

  return filtered;
}
