import {gameStorage} from '../storage';
import {InitGame, SavedGame} from '../types';

export const BoardService = {
  async save(state: SavedGame | InitGame) {
    try {
      if ('initialBoard' in state) {
        gameStorage.saveInitGame(state);
      } else if ('savedBoard' in state) {
        const savedGame = await this.loadSaved();
        const updatedSavedGame: SavedGame = {
          ...(savedGame ?? {}),
          ...state,
          lastSaved: new Date(),
        };
        gameStorage.saveSavedGame(updatedSavedGame);
      }
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  async loadInit(): Promise<InitGame | null> {
    try {
      return gameStorage.getInitGame();
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  },

  async loadSaved(): Promise<SavedGame | null> {
    try {
      return gameStorage.getSavedGame();
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  },

  async loadSavedTimePlayed(): Promise<number> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return savedGame.savedTimePlayed;
      }
      return 0;
    } catch (e) {
      console.error('Failed to load saved time played:', e);
      return 0;
    }
  },
  async loadSavedMistake(): Promise<number> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return savedGame.savedMistake;
      }
      return 0;
    } catch (e) {
      console.error('Failed to load saved mistake count:', e);
      return 0;
    }
  },

  async clear() {
    try {
      gameStorage.clearGameData();
    } catch (e) {
      console.error('Failed to clear saved game:', e);
    }
  },

  async clearSaved() {
    try {
      gameStorage.clearSavedGameData();
    } catch (e) {
      console.error('Failed to clear saved game:', e);
    }
  },
};
