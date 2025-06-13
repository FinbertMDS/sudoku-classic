import { BackgroundService } from '../../services/BackgroundService';

export const handleClearStorage = async () => {
  // BoardService.clear();
  // GameStatsManager.resetStatistics();
  // SettingsService.clear();
  // if (!__DEV__) {
  BackgroundService.clear();
  // }
};
