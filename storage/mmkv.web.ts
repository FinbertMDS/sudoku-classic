import {Platform} from 'react-native';

const isWeb = Platform.OS === 'web';

const localStorageAvailable = typeof localStorage !== 'undefined';

export const saveItem = (key: string, value: any) => {
  try {
    if (isWeb && localStorageAvailable) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error saving ${key}`, error);
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    if (isWeb && localStorageAvailable) {
      const raw = localStorage.getItem(key);
      if (raw == null) return null;

      // boolean?
      if (raw === 'true' || raw === 'false') return (raw === 'true') as T;

      // number?
      const num = Number(raw);
      if (!isNaN(num) && raw.trim() !== '') return num as T;

      return raw as T; // plain string
    }
  } catch (error) {
    console.error(`Error reading ${key}`, error);
  }
  return null;
};

export const deleteItem = (key: string) => {
  try {
    if (isWeb && localStorageAvailable) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error deleting ${key}`, error);
  }
};

export const storage = {
  getString: (_key: string) => getItem(_key),
  getBoolean: (_key: string) => getItem(_key) as boolean,
  getNumber: (_key: string) => getItem(_key) as number,
  set: (_key: string, _value: string) => saveItem(_key, _value),
  delete: (_key: string) => deleteItem(_key),
};
