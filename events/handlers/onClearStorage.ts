import {BackgroundService} from '../../services/BackgroundService';
import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {PlayerService} from '../../services/PlayerService';
import {SettingsService} from '../../services/SettingsService';

export const handleClearStorage = async () => {
  await BoardService.clear();
  await PlayerService.clear();
  await GameStatsManager.resetStatistics();
  await SettingsService.clear();
  if (!__DEV__) {
    await BackgroundService.clear();
  }
  await PlayerService.createDefaultPlayerIfNeeded();
};
