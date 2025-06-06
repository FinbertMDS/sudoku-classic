// utils/getDailyQuote.ts
import { QuoteService } from '../services/QuoteService';
import { DailyQuotes } from '../types';

export const getDailyQuote = async (): Promise<DailyQuotes | null> => {
  const today = new Date().toISOString().split('T')[0];
  const cached = await QuoteService.load();
  if (cached) {
    const { date, q, a, h } = cached;
    if ((__DEV__ || date === today) && q && a && h) {
      return { q, a, h };
    }
  }

  const quote = await QuoteService.fetchQuote();

  if (quote) {
    const result = { date: today, ...quote };
    await QuoteService.save(result);
    return { q: quote.q, a: quote.a, h: quote.h };
  } else {
    const oldCached = await QuoteService.load();
    if (oldCached) {
      const { q, a, h } = oldCached;
      if (q && a && h) {
        return { q, a, h };
      }
    }
  }
  return null;
};
