import {storage} from '.';
import {InitGame, SavedGame} from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';

const saveInitGame = (game: InitGame) => {
  try {
    storage.set(STORAGE_KEY_INIT_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getInitGame = (): InitGame | null => {
  try {
    const json = storage.getString(STORAGE_KEY_INIT_GAME);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};

const clearInitGame = () => {
  try {
    storage.delete(STORAGE_KEY_INIT_GAME);
  } catch (_) {}
};

const saveSavedGame = (game: SavedGame) => {
  try {
    storage.set(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getSavedGame = (): SavedGame | null => {
  try {
    const json = storage.getString(STORAGE_KEY_SAVED_GAME);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};

const clearSavedGameData = () => {
  try {
    storage.delete(STORAGE_KEY_SAVED_GAME);
  } catch (_) {}
};

const clearGameData = () => {
  try {
    clearInitGame();
    clearSavedGameData();
  } catch (_) {}
};

export const gameStorage = {
  saveInitGame,
  getInitGame,
  clearInitGame,
  saveSavedGame,
  getSavedGame,
  clearGameData,
  clearSavedGameData,
};
