// src/hooks/useEnsureStatsCache.ts

import {useEffect} from 'react';
import {PlayerService, StatsService} from '../services';
import {TimeRange} from '../types';

export function useEnsureStatsCache() {
  const updateStatsCache = async (): Promise<boolean> => {
    try {
      const needsUpdate = await StatsService.shouldUpdateStatsCache();

      if (needsUpdate) {
        const affectedRanges: TimeRange[] = [
          'today',
          'week',
          'month',
          'year',
          'all',
        ];

        const playerId = await PlayerService.getCurrentPlayerId();
        const allLogsByPlayerId =
          await StatsService.getLogsByPlayerId(playerId);
        await StatsService.updateStatsWithAllCache(
          allLogsByPlayerId,
          affectedRanges,
          playerId,
        );

        await StatsService.updateStatsDone();
      }
      return needsUpdate;
    } catch (err) {
      console.warn('Failed to ensure stats cache:', err);
    }
    return false;
  };

  useEffect(() => {
    updateStatsCache();
  }, []);

  return {
    updateStatsCache,
  };
}
