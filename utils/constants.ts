import {AppSettings, Level} from '../types';

export const LEVELS = ['easy', 'medium', 'hard', 'expert'] as Level[];

export const SCREENS = {
  HOME_TABS: 'HomeTabs',
  MAIN: 'Main',
  STATISTICS: 'Statistics',
  BOARD: 'Board',
  OPTIONS: 'Options',
  SETTINGS: 'Settings',
  HOW_TO_PLAY: 'HowToPlay',
  ABOUT_GAME: 'AboutGame',
  LICENSES: 'Licenses',
} as const;

export const BOARD_SIZE = 9;
export const CELL_SIZE = 40;
export const MAX_TIMEPLAYED = 3 * 60 * 60; // in seconds
export const MAX_MISTAKES = 5;
export const CAGE_PADDING = 3;
export const CAGE_PADDING_FIRST_1 = 7;
export const CAGE_PADDING_FIRST_2 = 10;

export const ANIMATION_DURATION = 300; // in ms
export const ANIMATION_CELL_KEY_SEPARATOR = '-';
export const ANIMATION_TYPE = {
  ROW: 1,
  COL: 2,
  ROW_COL: 3,
  NONE: 0,
} as const;

// Game Storage Keys
export const STORAGE_KEY_INIT_GAME = 'initGame';
export const STORAGE_KEY_SAVED_GAME = 'savedGame';
export const STORAGE_KEY_GAME_STATS_CACHE = 'gameStatsCache';
export const STORAGE_KEY_LAST_STATS_CACHE_UPDATE = 'lastStatsCacheUpdate';
export const STORAGE_KEY_GAME_LOGS = 'gameLogs';
export const STORAGE_KEY_DAILY_STATS = 'dailyStats';
export const STORAGE_KEY_LANG_KEY_DEFAULT = 'defaultLanguage';
export const STORAGE_KEY_LANG_KEY_PREFERRED = 'preferredLanguage';
export const STORAGE_KEY_SETTINGS = 'settings';
export const STORAGE_KEY_BACKGROUNDS = 'backgrounds';

export const CHART_WIDTH = 60;
export const CHART2_WIDTH = 70;

export const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'vi', label: 'Tiếng Việt'},
  {code: 'ja', label: '日本語'},
];

export const DEFAULT_SETTINGS: AppSettings = {
  // sounds: true,
  // autoLock: false,
  timer: true,
  // score: true,
  // statisticsMsg: true,
  // numberFirst: false,
  mistakeLimit: true,
  autoCheckMistake: true,
  highlightDuplicates: true,
  highlightAreas: true,
  highlightIdenticalNumbers: true,
  hideUsedNumbers: true,
  autoRemoveNotes: true,
};

export const DAILY_STATS_DATE_FORMAT = 'yyyy-MM-dd';

// Unsplash
export const UNSPLASH_KEYWORDS_LIGHT = [
  'minimal pastel gradient',
  'soft abstract light',
  'white texture background',
  'pastel background',
];

export const UNSPLASH_KEYWORDS_DARK = [
  'dark gradient abstract',
  'black minimal background',
  'moody blurred background',
  'dark blurry night',
];
