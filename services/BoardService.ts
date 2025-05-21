import { gameStorage } from '../storage';
import { InitGame, SavedGame, SavedHintCount, SavedMistake } from '../types';
import { MAX_HINTS } from '../utils/constants';

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
  async loadSavedMistake(): Promise<SavedMistake> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return {
          savedMistake: savedGame.savedMistake,
          savedTotalMistake: savedGame.savedTotalMistake,
        };
      }
      return {
        savedMistake: 0,
        savedTotalMistake: 0,
      };
    } catch (e) {
      console.error('Failed to load saved mistake count:', e);
      return {
        savedMistake: 0,
        savedTotalMistake: 0,
      };
    }
  },

  async loadSavedHintCount(): Promise<SavedHintCount> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return {
          savedHintCount: savedGame.savedHintCount ?? MAX_HINTS,
          savedTotalHintCountUsed: savedGame.savedTotalHintCountUsed ?? 0,
        };
      }
      return {
        savedHintCount: MAX_HINTS,
        savedTotalHintCountUsed: 0,
      };
    } catch (e) {
      console.error('Failed to load saved hint count:', e);
      return {
        savedHintCount: MAX_HINTS,
        savedTotalHintCountUsed: 0,
      };
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
