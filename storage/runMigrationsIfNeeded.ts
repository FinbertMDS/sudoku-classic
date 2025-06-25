import {appStorage} from './appStorage';

export const CURRENT_MIGRATION_VERSION = 0;

export async function runMigrationsIfNeeded() {
  // if (IS_UI_TESTING) {
  //   console.log('[MIGRATION] Mock game logs for UI testing');
  //   statsMock.saveMockGameLogs();
  // }

  const storedVersion = appStorage.getMigrationVersion() ?? 0;

  if (storedVersion >= CURRENT_MIGRATION_VERSION) {
    console.log('[MIGRATION] No migration needed: v =', storedVersion);
    return;
  }

  console.log(
    `[MIGRATION] Start from v${storedVersion} to v${CURRENT_MIGRATION_VERSION}`,
  );

  // Các bước migrate theo version
  // if (storedVersion < 1) {
  //   await migrateGameLogsEntryV2();
  // }

  // Cập nhật version sau khi migrate xong
  appStorage.setMigrationVersion(CURRENT_MIGRATION_VERSION);

  console.log('[MIGRATION] Done');
}
