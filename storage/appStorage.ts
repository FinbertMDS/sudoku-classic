import {AppSettings, DailyBackgrounds, DailyQuotes} from '../types';
import {
  STORAGE_KEY_BACKGROUNDS,
  STORAGE_KEY_HAS_PLAYED,
  STORAGE_KEY_LANG_KEY_DEFAULT,
  STORAGE_KEY_LANG_KEY_PREFERRED,
  STORAGE_KEY_MIGRATION_VERSION,
  STORAGE_KEY_QUOTES,
  STORAGE_KEY_SETTINGS,
} from '../utils/constants';
import {storage} from './mmkv';

// STORAGE_KEY_LANG_KEY_DEFAULT
const getLangKeyDefault = (): string | null => {
  try {
    return storage.getString(STORAGE_KEY_LANG_KEY_DEFAULT) || null;
  } catch (_) {
    return null;
  }
};
const saveLangKeyDefault = (key: string) => {
  try {
    storage.set(STORAGE_KEY_LANG_KEY_DEFAULT, key);
  } catch (_) {}
};
const clearLangKeyDefault = () => {
  try {
    storage.delete(STORAGE_KEY_LANG_KEY_DEFAULT);
  } catch (_) {}
};

// STORAGE_KEY_LANG_KEY_PREFERRED
const getLangKeyPreferred = (): string | null => {
  try {
    return storage.getString(STORAGE_KEY_LANG_KEY_PREFERRED) || null;
  } catch (_) {
    return null;
  }
};
const saveLangKeyPreferred = (key: string) => {
  try {
    storage.set(STORAGE_KEY_LANG_KEY_PREFERRED, key);
  } catch (_) {}
};
const clearLangKeyPreferred = () => {
  try {
    storage.delete(STORAGE_KEY_LANG_KEY_PREFERRED);
  } catch (_) {}
};

// STORAGE_KEY_SETTINGS
const getSettings = (): AppSettings | null => {
  try {
    const json = storage.getString(STORAGE_KEY_SETTINGS);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};
const setSettings = (data: AppSettings) => {
  try {
    storage.set(STORAGE_KEY_SETTINGS, JSON.stringify(data));
  } catch (_) {}
};
const clearSettings = () => {
  try {
    storage.delete(STORAGE_KEY_SETTINGS);
  } catch (_) {}
};

// STORAGE_KEY_BACKGROUNDS
const getBackgrounds = (): DailyBackgrounds | null => {
  try {
    const json = storage.getString(STORAGE_KEY_BACKGROUNDS);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};
const setBackgrounds = (data: DailyBackgrounds) => {
  try {
    storage.set(STORAGE_KEY_BACKGROUNDS, JSON.stringify(data));
  } catch (_) {}
};
const clearBackgrounds = () => {
  try {
    storage.delete(STORAGE_KEY_BACKGROUNDS);
  } catch (_) {}
};

// STORAGE_KEY_QUOTES
const getQuotes = (): DailyQuotes | null => {
  try {
    const json = storage.getString(STORAGE_KEY_QUOTES);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};
const setQuotes = (data: DailyQuotes) => {
  try {
    storage.set(STORAGE_KEY_QUOTES, JSON.stringify(data));
  } catch (_) {}
};
const clearQuotes = () => {
  try {
    storage.delete(STORAGE_KEY_QUOTES);
  } catch (_) {}
};

// STORAGE_KEY_HAS_PLAYED
const getHasPlayed = (): boolean => {
  try {
    return storage.getBoolean(STORAGE_KEY_HAS_PLAYED) || false;
  } catch (_) {
    return false;
  }
};
const setHasPlayed = (value: boolean) => {
  try {
    storage.set(STORAGE_KEY_HAS_PLAYED, value);
  } catch (_) {}
};
const clearHasPlayed = () => {
  try {
    storage.delete(STORAGE_KEY_HAS_PLAYED);
  } catch (_) {}
};

// STORAGE_KEY_MIGRATION_VERSION
const getMigrationVersion = (): number => {
  try {
    return storage.getNumber(STORAGE_KEY_MIGRATION_VERSION) || 0;
  } catch (_) {
    return 0;
  }
};
const setMigrationVersion = (version: number) => {
  try {
    storage.set(STORAGE_KEY_MIGRATION_VERSION, version);
  } catch (_) {}
};
const clearMigrationVersion = () => {
  try {
    storage.delete(STORAGE_KEY_MIGRATION_VERSION);
  } catch (_) {}
};

const clearAll = () => {
  clearLangKeyDefault();
  clearLangKeyPreferred();
  clearSettings();
  clearHasPlayed();
};

const clearAllForDev = () => {
  clearBackgrounds();
  clearQuotes();
  clearMigrationVersion();
};

export const appStorage = {
  getLangKeyDefault,
  saveLangKeyDefault,
  clearLangKeyDefault,
  getLangKeyPreferred,
  saveLangKeyPreferred,
  clearLangKeyPreferred,
  getSettings,
  setSettings,
  clearSettings,
  getBackgrounds,
  setBackgrounds,
  clearBackgrounds,
  getQuotes,
  setQuotes,
  clearQuotes,
  getHasPlayed,
  setHasPlayed,
  clearHasPlayed,
  clearAll,
  getMigrationVersion,
  setMigrationVersion,
  clearMigrationVersion,
  clearAllForDev,
};
