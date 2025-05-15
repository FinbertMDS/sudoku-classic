import { AppSettings, DailyBackgrounds } from '../types';
import {
  STORAGE_KEY_BACKGROUNDS,
  STORAGE_KEY_LANG_KEY_DEFAULT,
  STORAGE_KEY_LANG_KEY_PREFERRED,
  STORAGE_KEY_SETTINGS,
} from '../utils/constants';
import { deleteItem, getItem, saveItem } from './storage';

// STORAGE_KEY_LANG_KEY_DEFAULT
const getLangKeyDefault = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEY_LANG_KEY_DEFAULT);
};
const saveLangKeyDefault = async (key: string) => {
  await saveItem(STORAGE_KEY_LANG_KEY_DEFAULT, key);
};
const clearLangKeyDefault = async () => {
  await deleteItem(STORAGE_KEY_LANG_KEY_DEFAULT);
};

// STORAGE_KEY_LANG_KEY_PREFERRED
const getLangKeyPreferred = async (): Promise<string | null> => {
  return await getItem<string>(STORAGE_KEY_LANG_KEY_PREFERRED);
};
const saveLangKeyPreferred = async (key: string) => {
  await saveItem(STORAGE_KEY_LANG_KEY_PREFERRED, key);
};
const clearLangKeyPreferred = async () => {
  await deleteItem(STORAGE_KEY_LANG_KEY_PREFERRED);
};

// STORAGE_KEY_SETTINGS
const getSettings = async (): Promise<AppSettings | null> => {
  return await getItem<AppSettings>(STORAGE_KEY_SETTINGS);
};
const setSettings = async (data: AppSettings) => {
  await saveItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
};
const clearSettings = async () => {
  await deleteItem(STORAGE_KEY_SETTINGS);
};

// STORAGE_KEY_BACKGROUNDS
const getBackgrounds = async (): Promise<DailyBackgrounds | null> => {
  return await getItem<DailyBackgrounds>(STORAGE_KEY_BACKGROUNDS);
};
const setBackgrounds = async (data: DailyBackgrounds) => {
  await saveItem(STORAGE_KEY_BACKGROUNDS, JSON.stringify(data));
};
const clearBackgrounds = async () => {
  await deleteItem(STORAGE_KEY_BACKGROUNDS);
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
};
