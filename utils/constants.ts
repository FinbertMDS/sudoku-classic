import { AppSettings } from '../types';

export * from './buildConstants';

export const SCREENS = {
  HOME_TABS: '(tabs)',
  BOARD: 'BoardScreen',
  OPTIONS: 'OptionsScreen/index',
  SETTINGS: 'SettingsScreen/index',
  HOW_TO_PLAY: 'HowToPlayScreen/index',
  ABOUT_GAME: 'AboutGame/index',
  PLAYERS: 'PlayerScreen/index',
  SK_WEBVIEW: 'AboutGame/SkWebViewScreen/index',
  NOT_FOUND: '+not-found',
} as const;

export const BOARD_SIZE = 9;

export const ANIMATION_DURATION = 300; // in ms
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
export const STORAGE_KEY_LAST_STATS_CACHE_UPDATE_USER_ID =
  'lastStatsCacheUpdateUserId';
export const STORAGE_KEY_GAME_LOGS = 'gameLogs';
export const STORAGE_KEY_DAILY_STATS = 'dailyStats';
export const STORAGE_KEY_LANG_KEY_DEFAULT = 'defaultLanguage';
export const STORAGE_KEY_LANG_KEY_PREFERRED = 'preferredLanguage';
export const STORAGE_KEY_SETTINGS = 'settings';
export const STORAGE_KEY_BACKGROUNDS = 'backgrounds';
export const STORAGE_KEY_HAS_PLAYED = 'hasPlayed';
export const STORAGE_KEY_QUOTES = 'quotes';
export const STORAGE_KEY_MIGRATION_VERSION = 'migrationVersion';
export const STORAGE_KEY_PLAYERS = 'players';
export const STORAGE_KEY_CURRENT_PLAYER_ID = 'currentPlayerId';

export const CHART_WIDTH = 60;
export const CHART2_WIDTH = 70;

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
  'soft white background',
  'clean light texture',
  'minimal white pastel',
  'smooth cream background',
  'white paper texture',
  'light marble surface',
  'beige soft abstract',
];

export const UNSPLASH_KEYWORDS_DARK = [
  'dark matte texture',
  'black soft gradient',
  'minimal dark blur',
  'deep grey abstract',
  'night soft background',
  'charcoal surface texture',
  'dark fabric background',
];

export const UNSPLASH_UTM = '?utm_source=sudoku-killer&utm_medium=referral';
export const UNSPLASH_URL = 'https://unsplash.com/';

export const DEFAULT_PLAYER_ID = '00000000-0000-4000-8000-000000000000'; // hoặc uuidv4() cố định
export const DEFAULT_PLAYER_NAME = 'Player';
