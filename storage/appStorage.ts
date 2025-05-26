import { AppSettings, DailyBackgrounds } from '../types';
import {
  STORAGE_KEY_BACKGROUNDS,
  STORAGE_KEY_HAS_PLAYED,
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

// STORAGE_KEY_HAS_PLAYED
const getHasPlayed = async (): Promise<boolean | null> => {
  return await getItem<boolean>(STORAGE_KEY_HAS_PLAYED);
};
const setHasPlayed = async (data: boolean) => {
  console.log('setHasPlayed', data);
  await saveItem(STORAGE_KEY_HAS_PLAYED, data);
  console.log('setHasPlayed2', await getItem<boolean>(STORAGE_KEY_HAS_PLAYED));
};
const clearHasPlayed = async () => {
  await deleteItem(STORAGE_KEY_HAS_PLAYED);
};

const clearAll = async () => {
  await clearLangKeyDefault();
  await clearLangKeyPreferred();
  await clearSettings();
  await clearBackgrounds();
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
  getHasPlayed,
  setHasPlayed,
  clearHasPlayed,
  clearAll,
};
