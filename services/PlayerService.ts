import { playerProfileStorage, statsStorage } from '../storage';
import { GameLogEntryV2 } from '../types';
import { PlayerProfile } from '../types/player';
import { DEFAULT_PLAYER_ID } from '../utils/constants';
import { createDefaultPlayer } from '../utils/playerUtil';
import { GameStatsManager } from './GameStatsManager';

export const PlayerService = {
  async createDefaultPlayerIfNeeded(): Promise<void> {
    const players = playerProfileStorage.getAllPlayers();
    if (players.length === 0) {
      const rawLogs = statsStorage.getGameLogs();
      // count total games from raw logs which completed
      const totalGames = rawLogs.filter((log) => log.completed).length;
      const player = createDefaultPlayer(totalGames);
      playerProfileStorage.savePlayers([player]);
      playerProfileStorage.setCurrentPlayerId(player.id);
    }
  },

  async migrateDataFromDefaultPlayerToNewPlayer(
    newPlayerId: string,
  ): Promise<void> {
    const rawLogs = statsStorage.getGameLogsV2();
    const migrated = rawLogs.map((entry) => {
      if (entry.playerId === DEFAULT_PLAYER_ID) {
        return {
          ...entry,
          playerId: newPlayerId,
        } as GameLogEntryV2;
      }
      return entry;
    });
    statsStorage.saveGameLogsV2(migrated);

    // move total games from default player to new player
    const defaultPlayer = playerProfileStorage.getPlayerById(DEFAULT_PLAYER_ID);
    const newPlayer = playerProfileStorage.getPlayerById(newPlayerId);
    if (defaultPlayer && newPlayer) {
      newPlayer.totalGames = defaultPlayer.totalGames;
      playerProfileStorage.updatePlayer(newPlayer);
    }

    // delete default player
    const allPlayers = playerProfileStorage.getAllPlayers();
    const updated = allPlayers.filter(
      (_player) => _player.id !== DEFAULT_PLAYER_ID,
    );
    playerProfileStorage.savePlayers(updated);

    // nếu đổi default player và đang chọn default player thì update stats cache
    if (newPlayerId === playerProfileStorage.getCurrentPlayerId()) {
      const allLogs = await GameStatsManager.getLogsByPlayerId(newPlayerId);
      await GameStatsManager.updateStatsWithCache(
        allLogs,
        allLogs,
        newPlayerId,
      );
    }
  },

  async clear(): Promise<void> {
    playerProfileStorage.clearAll();
  },

  async deletePlayer(playerId: string): Promise<void> {
    if (playerId === DEFAULT_PLAYER_ID) {
      return;
    }
    statsStorage.deleteGameLogsV2ByPlayerId(playerId);
  },

  async incrementPlayerTotalGames(): Promise<void> {
    const player = playerProfileStorage.getCurrentPlayer();
    if (!player) {
      return;
    }
    player.totalGames++;
    playerProfileStorage.updatePlayer(player);
  },

  async canDeletePlayer(playerId: string): Promise<boolean> {
    if (playerId === DEFAULT_PLAYER_ID) {
      return false;
    }
    const allPlayers = playerProfileStorage.getAllPlayers();
    return allPlayers.length > 1 && allPlayers.some((p) => p.id === playerId);
  },

  async getCurrentPlayer(): Promise<PlayerProfile | null> {
    return playerProfileStorage.getCurrentPlayer();
  },

  async getCurrentPlayerId(): Promise<string> {
    return playerProfileStorage.getCurrentPlayerId();
  },
};
