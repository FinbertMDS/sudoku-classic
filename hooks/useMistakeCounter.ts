// useMistakeCounter.ts

import { useEffect, useState } from 'react';
import { BoardService } from '../services/BoardService';
import { MAX_MISTAKES } from '../utils/constants';

interface MistakeOptions {
  maxMistakes?: number;
  onLimitReached?: () => void;
}

export function useMistakeCounter(options?: MistakeOptions) {
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = options?.maxMistakes ?? MAX_MISTAKES;
  const onLimitReached = options?.onLimitReached;

  // Load last mistakes from storage once
  useEffect(() => {
    BoardService.loadSavedMistake().then(value => {
      if (value != null) {
        try {
          const saved = parseInt(value.toString(), 10);
          if (!isNaN(saved)) {
            setMistakes(saved);
          }
        } catch (error) {
          console.error('Failed to parse saved mistake:', error);
        }
      }
    });
  }, []);

  const incrementMistake = () => {
    setMistakes(prev => {
      const updated = prev + 1;
      if (updated >= maxMistakes) {
        if (onLimitReached) {
          onLimitReached();
        }
      }
      return updated;
    });
  };

  const resetMistakes = () => {
    setMistakes(0);
  };

  return {
    mistakes,
    incrementMistake,
    resetMistakes,
  };
}
