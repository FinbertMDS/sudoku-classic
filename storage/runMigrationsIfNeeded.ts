import {appStorage} from './appStorage';

export const CURRENT_MIGRATION_VERSION = 0;

export async function runMigrationsIfNeeded() {
  // statsMock.saveMockGameLogsV2();
  // rankingMock.saveMockRanking();

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

  // if (storedVersion < 2) {
  //   await updateTotalGames();
  // }

  // Cập nhật version sau khi migrate xong
  appStorage.setMigrationVersion(CURRENT_MIGRATION_VERSION);

  console.log('[MIGRATION] Done');
}
