// QuoteService.ts
import axios from 'axios';
import { appStorage } from '../storage';
import { DailyQuotes } from '../types';

export const QuoteService = {
  async load(): Promise<DailyQuotes | null> {
    const cached = await appStorage.getQuotes();
    return cached;
  },

  async save(data: DailyQuotes) {
    try {
      await appStorage.setQuotes(data);
    } catch (err) {
      console.error('Failed to save quote', err);
    }
  },

  async clear(): Promise<void> {
    try {
      await appStorage.clearQuotes();
    } catch (err) {
      console.error('Failed to clear quote', err);
    }
  },

  async fetchQuote(): Promise<DailyQuotes | null> {
    try {
      const res = await axios.get('https://zenquotes.io/api/today');
      if (res.data && res.data.length > 0) {
        return res.data[0];
      }
    } catch (err) {
      console.warn('Quote fetch failed:', err);
    }
    return null;
  },
};
