import { PlayerService } from '../../services/PlayerService';

export const handleDefaultPlayerUpdated = async (playerId: string) => {
  await PlayerService.migrateDataFromDefaultPlayerToNewPlayer(playerId);
};
