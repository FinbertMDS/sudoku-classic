import { GameLogEntryV2 } from '../../types';
import { statsStorage } from '../statsStorage';

export async function migrateGameLogs() {
  console.log('[MIGRATION] Migrating game logs...');
  const rawLogs = await statsStorage.getGameLogs();
  const migrated = rawLogs.map(
    (entry) =>
      ({
        id: entry.id,
        level: entry.level,
        startTime: entry.date,
        endTime: entry.endTime,
        durationSeconds: entry.durationSeconds,
        completed: entry.completed,
        mistakes: entry.mistakes ?? 0,
        hintCount: 0,
      }) as GameLogEntryV2,
  );
  await statsStorage.saveGameLogsV2(migrated);
  console.log('[MIGRATION] Game logs migrated');
}
