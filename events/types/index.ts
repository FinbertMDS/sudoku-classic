import {AppSettings, GameLogEntryV2, Level} from '../../types';

export type DynamicEvents = Record<string, any>;
export type AppEvents = CoreEvents & DynamicEvents;

export type InitGameCoreEvent = {
  level: Level;
  id: string;
};

export type GameEndedCoreEvent = {
  id: string;
  level: Level;
  timePlayed: number;
  mistakes: number;
  hintCount: number;
  completed: boolean;
};

export type StatisticsUpdatedCoreEvent = {
  logs: GameLogEntryV2[];
};

export type CoreEvents = {
  initGame: InitGameCoreEvent;
  gameStarted: void;
  gameEnded: GameEndedCoreEvent;
  statisticsUpdated: StatisticsUpdatedCoreEvent;
  settingsUpdated: AppSettings;
  clearStorage: void;
};
