// SettingsService.ts
import { appStorage } from '../storage';
import { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

export const SettingsService = {
  normalizeSettings(settings: AppSettings): AppSettings {
    const normalized = { ...settings };

    // Nếu mistakeLimit bị tắt ➝ autoCheckMistake cũng phải tắt
    if (!normalized.mistakeLimit) {
      normalized.autoCheckMistake = false;
    }

    return normalized;
  },

  async save(settings: AppSettings): Promise<void> {
    try {
      appStorage.setSettings(settings);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  },

  async load(): Promise<AppSettings> {
    try {
      const settings = appStorage.getSettings();
      if (settings) {
        return settings;
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
    return DEFAULT_SETTINGS;
  },

  async update(partial: Partial<AppSettings>): Promise<void> {
    const current = await SettingsService.load();
    const updated = { ...current, ...partial };
    await SettingsService.save(updated);
  },

  async clear(): Promise<void> {
    try {
      appStorage.clearAll();
      if (!__DEV__) {
        appStorage.clearAllForDev();
      }
    } catch (err) {
      console.error('Failed to clear settings', err);
    }
  },

  async getHasPlayed(): Promise<boolean> {
    return appStorage.getHasPlayed();
  },

  async setHasPlayed(value: boolean): Promise<void> {
    appStorage.setHasPlayed(value);
  },
};
