import {useEffect} from 'react';

// Giả định bạn có sẵn hàm này để lấy tất cả logs
import {GameStatsManager} from '../services/GameStatsManager';
import {statsStorage} from '../storage';
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

        const allLogs = await GameStatsManager.getLogs();
        await GameStatsManager.updateStatsWithAllCache(allLogs, affectedRanges);

        statsStorage.setLastStatsCacheUpdate();
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
