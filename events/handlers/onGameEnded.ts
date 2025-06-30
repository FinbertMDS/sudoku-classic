import {CORE_EVENTS} from '..';
import {PlayerService, StatsService} from '../../services';
import eventBus from '../eventBus';
import {GameEndedCoreEvent, StatisticsUpdatedCoreEvent} from '../types';

export const handleGameEnded = async (payload: GameEndedCoreEvent) => {
  const newEntry = await StatsService.recordGameEnd(payload);
  // Emit gameStarted in next tick
  requestAnimationFrame(() => {
    eventBus.emit(CORE_EVENTS.statisticsUpdated, {
      logs: [newEntry],
    } as StatisticsUpdatedCoreEvent);
  });
  if (payload.completed) {
    await PlayerService.incrementPlayerTotalGames();
  }
};
