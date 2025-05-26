// useHintCounter.ts

import { useEffect, useState } from 'react';
import { BoardService } from '../services/BoardService';
import { MAX_HINTS } from '../utils/constants';

interface HintOptions {
  maxHintCount?: number;
  onLimitReached?: () => void;
}

export function useHintCounter(options?: HintOptions) {
  const [totalHintCountUsed, setTotalHintCountUsed] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [limitHintReached, setLimitHintReached] = useState(false);
  const maxHintCount = options?.maxHintCount ?? MAX_HINTS;
  const onLimitReached = options?.onLimitReached;

  // Load last mistakes from storage once
  useEffect(() => {
    BoardService.loadSavedHintCount().then((value) => {
      setHintCount(value.savedHintCount);
      setTotalHintCountUsed(value.savedTotalHintCountUsed);
    });
  }, []);

  const decrementHintCount = () => {
    setTotalHintCountUsed((prev) => prev + 1);
    setHintCount((prev) => {
      const updated = prev - 1;
      if (updated <= 0) {
        setLimitHintReached(true);
        if (onLimitReached) {
          onLimitReached();
        }
      }
      return updated;
    });
  };

  const resetHintCount = () => {
    setHintCount(maxHintCount);
    setLimitHintReached(false);
  };

  const changeLimitHintReached = (isLimitReached: boolean) => {
    setLimitHintReached(isLimitReached);
  };

  return {
    totalHintCountUsed,
    hintCount,
    limitHintReached,
    decrementHintCount,
    resetHintCount,
    changeLimitHintReached,
  };
}
