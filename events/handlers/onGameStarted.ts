import {CORE_EVENTS} from '..';
import {BoardService, StatsService} from '../../services';
import eventBus from '../eventBus';
import {StatisticsUpdatedCoreEvent} from '../types';

export const handleGameStarted = async () => {
  const initGame = await BoardService.loadInit();
  if (initGame) {
    const updatedLog = await StatsService.recordGameStart(initGame!);
    // Emit gameStarted in next tick
    requestAnimationFrame(() => {
      eventBus.emit(CORE_EVENTS.statisticsUpdated, {
        logs: [updatedLog],
      } as StatisticsUpdatedCoreEvent);
    });
  }
};
