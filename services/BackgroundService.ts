// SettingsService.ts
import { UNSPLASH_ACCESS_KEY } from '@/env';
import axios from 'axios';
import { appStorage } from '../storage';
import { DailyBackgrounds, UnsplashImageData } from '../types';

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

  async fetchUnsplashImage(query: string): Promise<UnsplashImageData | null> {
    try {
      const res = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query,
          orientation: 'landscape',
          content_filter: 'high',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
      if (!res || !res.data || !res.data.urls) {
        return null;
      }

      // return res.data?.urls?.regular ?? null;
      return {
        url: res.data?.urls?.regular ?? null,
        photographerName: res.data?.user?.name ?? null,
        photographerLink: res.data?.user?.links?.html ?? null,
      };
    } catch (err) {
      console.warn('Unsplash fetch failed:', query, err);
      return null;
    }
  },
};
