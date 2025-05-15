// SettingsService.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { appStorage } from '../storage';
import { DailyBackgrounds } from '../types';

const { UNSPLASH_ACCESS_KEY } = Constants.expoConfig?.extra ?? {};

export const BackgroundService = {
  async load(): Promise<DailyBackgrounds | null> {
    const cached = appStorage.getBackgrounds();
    return cached;
  },

  async save(data: DailyBackgrounds) {
    try {
      appStorage.setBackgrounds(data);
    } catch (err) {
      console.error('Failed to save background', err);
    }
  },

  async clear(): Promise<void> {
    try {
      appStorage.clearBackgrounds();
    } catch (err) {
      console.error('Failed to clear background', err);
    }
  },

  async fetchUnsplashImage(query: string): Promise<string | null> {
    try {
      const res = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query,
          orientation: 'portrait',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
      return res.data?.urls?.regular ?? null;
    } catch (err) {
      console.warn('Unsplash fetch failed:', query, err);
      return null;
    }
  },
};
