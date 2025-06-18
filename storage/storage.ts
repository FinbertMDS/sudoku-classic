import { Platform } from 'react-native';
import { storage } from './mmkv';

const isWeb = Platform.OS === 'web';

const localStorageAvailable = typeof localStorage !== 'undefined';

export const saveItem = async (key: string, value: any) => {
  try {
    if (isWeb && localStorageAvailable) {
      localStorage.setItem(key, value);
    } else {
      storage.set(key, value);
    }
  } catch (error) {
    console.error(`Error saving ${key}`, error);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    if (isWeb && localStorageAvailable) {
      const raw = localStorage.getItem(key);
      if (raw == null) return null;

      // boolean?
      if (raw === 'true' || raw === 'false') return (raw === 'true') as T;

      // number?
      const num = Number(raw);
      if (!isNaN(num) && raw.trim() !== '') return num as T;

      // JSON object?
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T; // plain string
      }
    }
    const strVal = storage.getString(key);
    if (strVal == null) return null;

    try {
      return JSON.parse(strVal) as T;
    } catch {
      // Nếu không phải object thì kiểm tra kiểu nguyên thủy
      if (strVal === 'true' || strVal === 'false') {
        return (strVal === 'true') as T;
      }

      const num = Number(strVal);
      if (!isNaN(num) && strVal.trim() !== '') {
        return num as T;
      }

      return strVal as T; // fallback string
    }
  } catch (error) {
    console.error(`Error reading ${key}`, error);
    return null;
  }
};

export const deleteItem = async (key: string) => {
  try {
    if (isWeb && localStorageAvailable) {
      localStorage.removeItem(key);
    } else {
      storage.delete(key);
    }
  } catch (error) {
    console.error(`Error deleting ${key}`, error);
  }
};
