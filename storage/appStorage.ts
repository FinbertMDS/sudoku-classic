import { AppSettings, DailyBackgrounds, DailyQuotes } from '../types';
import {
  STORAGE_KEY_BACKGROUNDS,
  STORAGE_KEY_HAS_PLAYED,
  STORAGE_KEY_LANG_KEY_DEFAULT,
  STORAGE_KEY_LANG_KEY_PREFERRED,
  STORAGE_KEY_MIGRATION_VERSION,
  STORAGE_KEY_QUOTES,
  STORAGE_KEY_SETTINGS,
} from '../utils/constants';
import { deleteItem, getItem, saveItem } from './storage';

// STORAGE_KEY_LANG_KEY_DEFAULT
const getLangKeyDefault = async (): Promise<string | null> => {
  try {
    return await getItem<string>(STORAGE_KEY_LANG_KEY_DEFAULT);
  } catch (_) {
    return null;
  }
};
const saveLangKeyDefault = async (key: string) => {
  try {
    await saveItem(STORAGE_KEY_LANG_KEY_DEFAULT, key);
  } catch (_) {}
};
const clearLangKeyDefault = async () => {
  try {
    await deleteItem(STORAGE_KEY_LANG_KEY_DEFAULT);
  } catch (_) {}
};

// STORAGE_KEY_LANG_KEY_PREFERRED
const getLangKeyPreferred = async (): Promise<string | null> => {
  try {
    return await getItem<string>(STORAGE_KEY_LANG_KEY_PREFERRED);
  } catch (_) {
    return null;
  }
};
const saveLangKeyPreferred = async (key: string) => {
  try {
    await saveItem(STORAGE_KEY_LANG_KEY_PREFERRED, key);
  } catch (_) {}
};
const clearLangKeyPreferred = async () => {
  try {
    await deleteItem(STORAGE_KEY_LANG_KEY_PREFERRED);
  } catch (_) {}
};

// STORAGE_KEY_SETTINGS
const getSettings = async (): Promise<AppSettings | null> => {
  try {
    return await getItem<AppSettings>(STORAGE_KEY_SETTINGS);
  } catch (_) {
    return null;
  }
};
const setSettings = async (data: AppSettings) => {
  try {
    await saveItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
  } catch (_) {}
};
const clearSettings = async () => {
  try {
    await deleteItem(STORAGE_KEY_SETTINGS);
  } catch (_) {}
};

// STORAGE_KEY_BACKGROUNDS
const getBackgrounds = async (): Promise<DailyBackgrounds | null> => {
  try {
    return await getItem<DailyBackgrounds>(STORAGE_KEY_BACKGROUNDS);
  } catch (_) {
    return null;
  }
};
const setBackgrounds = async (data: DailyBackgrounds) => {
  try {
    await saveItem(STORAGE_KEY_BACKGROUNDS, JSON.stringify(data));
  } catch (_) {}
};
const clearBackgrounds = async () => {
  try {
    await deleteItem(STORAGE_KEY_BACKGROUNDS);
  } catch (_) {}
};

// STORAGE_KEY_QUOTES
const getQuotes = async (): Promise<DailyQuotes | null> => {
  try {
    return await getItem<DailyQuotes>(STORAGE_KEY_QUOTES);
  } catch (_) {
    return null;
  }
};
const setQuotes = async (data: DailyQuotes) => {
  try {
    await saveItem(STORAGE_KEY_QUOTES, JSON.stringify(data));
  } catch (_) {}
};
const clearQuotes = async () => {
  try {
    await deleteItem(STORAGE_KEY_QUOTES);
  } catch (_) {}
};

// STORAGE_KEY_HAS_PLAYED
const getHasPlayed = async (): Promise<boolean | null> => {
  try {
    return await getItem<boolean>(STORAGE_KEY_HAS_PLAYED);
  } catch (_) {
    return false;
  }
};
const setHasPlayed = async (value: boolean) => {
  try {
    await saveItem(STORAGE_KEY_HAS_PLAYED, value);
  } catch (_) {}
};
const clearHasPlayed = async () => {
  try {
    await deleteItem(STORAGE_KEY_HAS_PLAYED);
  } catch (_) {}
};

// STORAGE_KEY_MIGRATION_VERSION
const getMigrationVersion = async (): Promise<number | null> => {
  try {
    return (await getItem<number>(STORAGE_KEY_MIGRATION_VERSION)) || 0;
  } catch (_) {
    return 0;
  }
};
const setMigrationVersion = async (version: number) => {
  try {
    await saveItem(STORAGE_KEY_MIGRATION_VERSION, version);
  } catch (_) {}
};

const clearAll = async () => {
  await clearLangKeyDefault();
  await clearLangKeyPreferred();
  await clearSettings();
  await clearBackgrounds();
  await clearQuotes();
  await clearHasPlayed();
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
};
