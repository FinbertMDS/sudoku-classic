// src/events/handlers/onUpdateStatistics.ts

import {StatsService} from '../../services';
import {playerProfileStorage} from '../../storage';
import {StatisticsUpdatedCoreEvent} from '../types';

export const handleUpdateStatistics = async (
  payload: StatisticsUpdatedCoreEvent,
) => {
  const allLogs = await StatsService.getLogs();
  // await GameStatsManager.updateStatsWithAllCache(allLogs, [
  //   'today',
  //   'week',
  //   'month',
  //   'year',
  //   'all',
  // ]);
  if (payload.logs.length > 0) {
    await StatsService.updateStatsWithCache(
      allLogs,
      payload.logs,
      playerProfileStorage.getCurrentPlayerId(),
    );
  }
};
