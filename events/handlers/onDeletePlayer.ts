import {PlayerService} from '../../services/PlayerService';

export const handleDeletePlayer = async (playerId: string) => {
  await PlayerService.deletePlayer(playerId);
};
