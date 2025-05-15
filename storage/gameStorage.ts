import { deleteItem, getItem, saveItem } from '.';
import { InitGame, SavedGame } from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';

const saveInitGame = async (game: InitGame) =>
  await saveItem(STORAGE_KEY_INIT_GAME, JSON.stringify(game));

const getInitGame = async (): Promise<InitGame | null> => {
  return await getItem<InitGame>(STORAGE_KEY_INIT_GAME);
};

const saveSavedGame = async (game: SavedGame) =>
  await saveItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));

const getSavedGame = async (): Promise<SavedGame | null> => {
  return await getItem<SavedGame>(STORAGE_KEY_SAVED_GAME);
};

const clearGameData = async () => {
  await deleteItem(STORAGE_KEY_INIT_GAME);
  await deleteItem(STORAGE_KEY_SAVED_GAME);
};

const clearSavedGameData = async () => {
  await deleteItem(STORAGE_KEY_SAVED_GAME);
};

export const gameStorage = {
  saveInitGame,
  getInitGame,
  saveSavedGame,
  getSavedGame,
  clearGameData,
  clearSavedGameData,
};
