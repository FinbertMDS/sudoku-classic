import { appStorage } from './appStorage';
import { migrateGameLogs } from './migrations/gameLogs';

export const CURRENT_MIGRATION_VERSION = 1;

export async function runMigrationsIfNeeded() {
  const storedVersion = appStorage.getMigrationVersion() ?? 0;

  if (storedVersion >= CURRENT_MIGRATION_VERSION) {
    console.log('[MIGRATION] No migration needed');
    return;
  }

  console.log(
    `[MIGRATION] Start from v${storedVersion} to v${CURRENT_MIGRATION_VERSION}`,
  );

  // Các bước migrate theo version
  if (storedVersion < 1) {
    await migrateGameLogs();
  }

  // Cập nhật version sau khi migrate xong
  appStorage.setMigrationVersion(CURRENT_MIGRATION_VERSION);

  console.log('[MIGRATION] Done');
}
