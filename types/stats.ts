import { Level } from './game';

export interface GameLogEntry {
  id: string; // unique ID (UUID)
  level: Level;
  date: string; // ISO format: e.g., '2025-04-30T14:23:00Z'
  durationSeconds: number;
  completed: boolean;
  endTime?: string; // ISO format: e.g., '2025-04-30T14:23:00Z'
  mistakes?: number;
}

export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

export type GameStatsCache = {
  [range in TimeRange]?: Record<Level, GameStats>;
};
export interface GameStats {
  gamesStarted: number;
  gamesCompleted: number;
  bestTimeSeconds: number | null;
  averageTimeSeconds: number | null;
  totalTimeSeconds: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  games: number;
  totalTimeSeconds: number;
}

export interface DailyStatsPieData {
  name: string;
  count: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface DailyStatsStackedData {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
}
