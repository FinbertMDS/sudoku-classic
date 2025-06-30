import {PlayerService} from '../../services/PlayerService';
import {StatsService} from '../../services/StatsService';
import {GameLogEntryV2, TimeRange} from '../../types/stats';
import {DEFAULT_PLAYER_ID} from '../../utils/constants';
import {statsStorage} from '../statsStorage';

export async function migrateGameLogsEntryV2() {
  console.log('[MIGRATION] Migrating game logs entry v2...');
  await PlayerService.createDefaultPlayerIfNeeded();
  const rawLogs = statsStorage.getGameLogsV2();
  const migrated = rawLogs.map((entry) => {
    if (
      entry.playerId === undefined ||
      entry.playerId === null ||
      entry.playerId === ''
    ) {
      return {
        ...entry,
        playerId: DEFAULT_PLAYER_ID,
      } as GameLogEntryV2;
    }
    return entry;
  });
  statsStorage.saveGameLogsV2(migrated);

  // update last stats cache update user id
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogs = await StatsService.getLogs();
  await StatsService.updateStatsWithAllCache(
    allLogs,
    affectedRanges,
    DEFAULT_PLAYER_ID,
  );

  statsStorage.setLastStatsCacheUpdate();
  statsStorage.setLastStatsCacheUpdateUserId(DEFAULT_PLAYER_ID);

  console.log('[MIGRATION] Game logs entry v2 migrated');
}
