export * from './eventBus';
export * from './setupEventListeners';

export const CORE_EVENTS = {
  initGame: 'initGame',
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  statisticsUpdated: 'statisticsUpdated',
  settingsUpdated: 'settingsUpdated',
  clearStorage: 'clearStorage',
} as const;
