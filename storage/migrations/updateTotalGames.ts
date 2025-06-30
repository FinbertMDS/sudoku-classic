// src/storage/migrations/updateTotalGames.ts

export async function updateTotalGames() {
  // console.log('[MIGRATION] Updating total games...');
  // // lấy lại toàn bộ logs, update lại total games đã completed cho từng player
  // const rawLogs = statsStorage.getGameLogsV2();
  // const players = playerProfileStorage.getAllPlayers();
  // const updatedPlayers = players.map(player => {
  //   const totalGames = rawLogs.filter(
  //     log => log.playerId === player.id && log.completed,
  //   ).length;
  //   return {...player, totalGames};
  // });
  // playerProfileStorage.savePlayers(updatedPlayers);
  // console.log('[MIGRATION] Updating total games done');
}
