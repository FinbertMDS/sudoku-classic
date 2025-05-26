import { GameStatsManager } from '../../services/GameStatsManager';
import { StatisticsUpdatedCoreEvent } from '../types';

export const handleUpdateStatistics = async (
  payload: StatisticsUpdatedCoreEvent,
) => {
  const allLogs = await GameStatsManager.getLogs();
  // await GameStatsManager.updateStatsWithAllCache(allLogs, [
  //   'today',
  //   'week',
  //   'month',
  //   'year',
  //   'all',
  // ]);
  if (payload.logs.length > 0) {
    await GameStatsManager.updateStatsWithCache(allLogs, payload.logs);
  }
};
