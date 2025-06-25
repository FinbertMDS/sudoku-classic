import {CORE_EVENTS} from '..';
import {PlayerService} from '../../services/PlayerService';
import eventBus from '../eventBus';

export const handleDefaultPlayerUpdated = async (playerId: string) => {
  await PlayerService.migrateDataFromDefaultPlayerToNewPlayer(playerId);
  // Emit defaultPlayerUpdated_Done in next tick
  requestAnimationFrame(() => {
    eventBus.emit(CORE_EVENTS.defaultPlayerUpdated_Done);
  });
};
