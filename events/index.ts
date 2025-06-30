export * from './eventBus';
export * from './setupEventListeners';

export const CORE_EVENTS = {
  initGame: 'initGame',
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  statisticsUpdated: 'statisticsUpdated',
  settingsUpdated: 'settingsUpdated',
  clearStorage: 'clearStorage',
  defaultPlayerUpdated: 'defaultPlayerUpdated',
  defaultPlayerUpdated_Done: 'defaultPlayerUpdated_Done',
  createPlayer: 'createPlayer',
  updatePlayerName: 'updatePlayerName',
  switchPlayer: 'switchPlayer',
} as const;
