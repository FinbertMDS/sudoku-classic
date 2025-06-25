import { CORE_EVENTS } from '.';
import eventBus from './eventBus';
import { handleClearStorage } from './handlers/onClearStorage';
import { handleDeletePlayer } from './handlers/onDeletePlayer';
import { handleGameEnded } from './handlers/onGameEnded';
import { handleGameStarted } from './handlers/onGameStarted';
import { handleInitGame } from './handlers/onInitGame';
import { handleDefaultPlayerUpdated } from './handlers/onPlayerDefaultUpdated';
import { handleSwitchPlayer } from './handlers/onPlayerSwitched';
import { handleUpdateStatistics } from './handlers/onUpdateStatistics';

export const setupEventListeners = () => {
  eventBus.on(CORE_EVENTS.initGame, handleInitGame);
  eventBus.on(CORE_EVENTS.gameStarted, handleGameStarted);
  eventBus.on(CORE_EVENTS.gameEnded, handleGameEnded);
  eventBus.on(CORE_EVENTS.statisticsUpdated, handleUpdateStatistics);
  eventBus.on(CORE_EVENTS.clearStorage, handleClearStorage);
  eventBus.on(CORE_EVENTS.deletePlayer, handleDeletePlayer);
  eventBus.on(CORE_EVENTS.defaultPlayerUpdated, handleDefaultPlayerUpdated);
  eventBus.on(CORE_EVENTS.switchPlayer, handleSwitchPlayer);
};
