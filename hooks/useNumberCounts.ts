// useNumberCounts.ts

import {useMemo} from 'react';
import {AppSettings, CellValue} from '../types';

export function useNumberCounts(
  board: CellValue[][],
  settings: AppSettings,
): Record<number, number> {
  return useMemo(() => {
    const flatStr = board.flat().join('');
    const counts: Record<number, number> = {};

    for (let i = 1; i <= 9; i++) {
      const digit = i.toString();
      counts[i] = settings.hideUsedNumbers
        ? flatStr.split(digit).length - 1
        : 0;
    }

    return counts;
  }, [board, settings]);
}
