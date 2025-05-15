import { Storage } from 'expo-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const localStorageAvailable = typeof localStorage !== 'undefined';

export const saveItem = async (key: string, value: any) => {
  try {
    if (isWeb && localStorageAvailable) {
      localStorage.setItem(key, value);
    } else {
      await Storage.setItem({ key, value });
    }
  } catch (error) {
    console.error(`Error saving ${key}`, error);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    let value;
    if (isWeb && localStorageAvailable) {
      value = localStorage.getItem(key);
    } else {
      value = await Storage.getItem({ key });
    }
    // If T is string type, return value directly
    if (value) {
      try {
        // Attempt to parse as JSON first
        const parsed = JSON.parse(value);
        return parsed as T;
      } catch {
        // If parsing fails, return as string type
        return value as T;
      }
    }
    return null;
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
      await Storage.removeItem({ key });
    }
  } catch (error) {
    console.error(`Error deleting ${key}`, error);
  }
};
