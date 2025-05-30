import { InitGame, SavedGame } from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';
import { deleteItem, getItem, saveItem } from './storage';

const saveInitGame = async (game: InitGame) => {
  try {
    await saveItem(STORAGE_KEY_INIT_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getInitGame = async (): Promise<InitGame | null> => {
  try {
    return await getItem<InitGame>(STORAGE_KEY_INIT_GAME);
  } catch (_) {
    return null;
  }
};

const saveSavedGame = async (game: SavedGame) => {
  try {
    await saveItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getSavedGame = async (): Promise<SavedGame | null> => {
  try {
    return await getItem<SavedGame>(STORAGE_KEY_SAVED_GAME);
  } catch (_) {
    return null;
  }
};

const clearGameData = async () => {
  try {
    await deleteItem(STORAGE_KEY_INIT_GAME);
    await deleteItem(STORAGE_KEY_SAVED_GAME);
  } catch (_) {}
};

const clearSavedGameData = async () => {
  try {
    await deleteItem(STORAGE_KEY_SAVED_GAME);
  } catch (_) {}
};

export const gameStorage = {
  saveInitGame,
  getInitGame,
  saveSavedGame,
  getSavedGame,
  clearGameData,
  clearSavedGameData,
};
