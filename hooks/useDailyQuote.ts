import { useEffect, useState } from 'react';
import { DailyQuotes } from '../types';
import { getDailyQuote } from '../utils/getDailyQuote';

export const useDailyQuote = () => {
  const [quote, setQuote] = useState<DailyQuotes | null>(null);

  const loadQuote = async () => {
    try {
      const dailyQuote = await getDailyQuote();
      if (!dailyQuote) {
        return;
      }
      setQuote(dailyQuote);
    } catch (error) {
      console.log('Failed to fetch quote:', error);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  return { quote, loadQuote };
};
