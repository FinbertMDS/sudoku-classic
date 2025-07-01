import {Level} from '../types';

export const LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
export const LEVEL_PRIORITY: Level[] = LEVELS.slice().reverse();
export const LEVEL_WEIGHT: Record<string, number> = {
  expert: 5,
  hard: 4,
  medium: 2.5,
  easy: 1,
};
// Ngưỡng đánh giá người chơi
export const PLAYER_STATS_THRESHOLDS = {
  fastPlayerAvgTime: 360, // Dưới 6 phút
  slowPlayerAvgTime: 600, // Trên 10 phút là hơi chậm
  verySlowPlayerAvgTime: 900, // Trên 15 phút là rất chậm

  minGamesForGoodPlayer: 5,
  highWinRate: 0.7,
  mediumWinRate: 0.4,

  strongPlayerScore: 50,
  strongPlayerWins: 10,
};

export const SHOW_UNSPLASH_IMAGE_INFO = false;
export const IS_UI_TESTING = false;

export const MAX_TIMEPLAYED = 3 * 60 * 60; // in seconds
export const MAX_MISTAKES = 5;
export const MAX_HINTS = 5;

export const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'vi', label: 'Tiếng Việt'},
  {code: 'ja', label: '日本語'},
];
