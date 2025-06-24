import { GameStatsManager } from '../../services/GameStatsManager';
import { TimeRange } from '../../types';

export const handleSwitchPlayer = async (playerId: string) => {
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogsByPlayerId = await GameStatsManager.getLogsByPlayerId(playerId);
  await GameStatsManager.updateStatsWithAllCache(
    allLogsByPlayerId,
    affectedRanges,
    playerId,
  );

  await GameStatsManager.updateStatsDone();
};
