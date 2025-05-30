import { BoardService } from '../../services/BoardService';
import { GameStatsManager } from '../../services/GameStatsManager';
import eventBus from '../eventBus';
import { CORE_EVENTS } from '../index';
import { StatisticsUpdatedCoreEvent } from '../types';

export const handleGameStarted = async () => {
  const initGame = await BoardService.loadInit();
  if (initGame) {
    const updatedLog = await GameStatsManager.recordGameStart(initGame!);
    // Emit gameStarted in next tick
    requestAnimationFrame(() => {
      eventBus.emit(CORE_EVENTS.statisticsUpdated, {
        logs: [updatedLog],
      } as StatisticsUpdatedCoreEvent);
    });
  }
};
