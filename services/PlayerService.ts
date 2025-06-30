import {StatsService} from '.';
import {playerProfileStorage, statsStorage} from '../storage';
import {GameLogEntryV2, PlayerProfile} from '../types';
import {DEFAULT_PLAYER_ID} from '../utils/constants';
import {createDefaultPlayer} from '../utils/playerUtil';

export const PlayerService = {
  async createDefaultPlayerIfNeeded(): Promise<void> {
    const players = playerProfileStorage.getAllPlayers();
    if (players.length === 0) {
      const rawLogs = statsStorage.getGameLogsV2();
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
      const allLogs = await StatsService.getLogsByPlayerId(newPlayerId);
      await StatsService.updateStatsWithCache(allLogs, allLogs, newPlayerId);
    }
  },

  async clear(): Promise<void> {
    playerProfileStorage.clearAll();
  },

  async deletePlayer(playerId: string): Promise<void> {
    await this.deletePlayerGameLogs(playerId);
    const allPlayers = playerProfileStorage.getAllPlayers();
    const updated = allPlayers.filter((p) => p.id !== playerId);
    playerProfileStorage.savePlayers(updated);
  },

  async deletePlayerGameLogs(playerId: string): Promise<void> {
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

  async getAllPlayers(): Promise<PlayerProfile[]> {
    return playerProfileStorage.getAllPlayers();
  },

  async getCurrentPlayer(): Promise<PlayerProfile | null> {
    return playerProfileStorage.getCurrentPlayer();
  },

  async getCurrentPlayerId(): Promise<string> {
    return playerProfileStorage.getCurrentPlayerId();
  },

  async setCurrentPlayerId(playerId: string): Promise<void> {
    playerProfileStorage.setCurrentPlayerId(playerId);
  },

  async getPlayerById(playerId: string): Promise<PlayerProfile | null> {
    return playerProfileStorage.getPlayerById(playerId);
  },

  async savePlayers(players: PlayerProfile[]): Promise<void> {
    playerProfileStorage.savePlayers(players);
  },

  async createPlayer(profile: PlayerProfile): Promise<void> {
    const all = await this.getAllPlayers();
    const updated = [...all, profile];
    await this.savePlayers(updated);
  },

  async updatePlayerName(playerId: string, name: string): Promise<void> {
    const all = await this.getAllPlayers();
    const updated = all.map((_player) =>
      _player.id === playerId ? {..._player, name} : _player,
    );
    await this.savePlayers(updated);
  },
};
