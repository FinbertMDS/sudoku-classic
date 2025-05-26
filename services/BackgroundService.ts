// SettingsService.ts
import { UNSPLASH_ACCESS_KEY } from '@/env';
import axios from 'axios';
import { appStorage } from '../storage';
import { DailyBackgrounds } from '../types';

export const BackgroundService = {
  async load(): Promise<DailyBackgrounds | null> {
    const cached = await appStorage.getBackgrounds();
    return cached;
  },

  async save(data: DailyBackgrounds) {
    try {
      await appStorage.setBackgrounds(data);
    } catch (err) {
      console.error('Failed to save background', err);
    }
  },

  async clear(): Promise<void> {
    try {
      await appStorage.clearBackgrounds();
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
