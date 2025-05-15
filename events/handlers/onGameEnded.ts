import {CORE_EVENTS} from '..';
import {GameStatsManager} from '../../services/GameStatsManager';
import eventBus from '../eventBus';
import {GameEndedCoreEvent} from '../types';

export const handleGameEnded = async (payload: GameEndedCoreEvent) => {
  const newEntry = await GameStatsManager.recordGameWin(payload);
  // Emit gameStarted in next tick
  requestAnimationFrame(() => {
    eventBus.emit(CORE_EVENTS.statisticsUpdated, {
      logs: [newEntry],
    });
  });
};
