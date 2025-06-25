import {useEffect} from 'react';

// Giả định bạn có sẵn hàm này để lấy tất cả logs
import {GameStatsManager} from '../services/GameStatsManager';
import {PlayerService} from '../services/PlayerService';
import {TimeRange} from '../types';

export function useEnsureStatsCache() {
  const updateStatsCache = async (): Promise<boolean> => {
    try {
      const needsUpdate = await GameStatsManager.shouldUpdateStatsCache();

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
          await GameStatsManager.getLogsByPlayerId(playerId);
        await GameStatsManager.updateStatsWithAllCache(
          allLogsByPlayerId,
          affectedRanges,
          playerId,
        );

        await GameStatsManager.updateStatsDone();
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
