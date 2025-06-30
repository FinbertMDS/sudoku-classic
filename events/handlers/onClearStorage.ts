import {autoDetectLanguage} from '../../i18n/i18n';
import {
  BackgroundService,
  BoardService,
  PlayerService,
  SettingsService,
  StatsService,
} from '../../services';

export const handleClearStorage = async () => {
  await BoardService.clear();
  await PlayerService.clear();
  await StatsService.resetStatistics();
  await SettingsService.clear();
  if (!__DEV__) {
    await BackgroundService.clear();
  }
  await PlayerService.createDefaultPlayerIfNeeded();

  autoDetectLanguage();
};
