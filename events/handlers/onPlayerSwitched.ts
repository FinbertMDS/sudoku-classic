// src/events/handlers/onPlayerSwitched.ts

import {BoardService, StatsService} from '../../services';
import {TimeRange} from '../../types';

export const handleSwitchPlayer = async (playerId: string) => {
  const savedGame = await BoardService.loadSaved();
  if (savedGame) {
    let log = await StatsService.getLog(savedGame.savedId);
    if (log) {
      log = {
        ...log,
        completed: false,
        endTime: new Date().toISOString(),
        durationSeconds: savedGame.savedTimePlayed,
        mistakes: savedGame.savedMistake,
        hintCount: savedGame.savedHintCount,
      };
      await StatsService.saveLog(log, true);
    }
  }

  await BoardService.clear();

  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogsByPlayerId = await StatsService.getLogsByPlayerId(playerId);
  await StatsService.updateStatsWithAllCache(
    allLogsByPlayerId,
    affectedRanges,
    playerId,
  );

  await StatsService.updateStatsDone();
};
