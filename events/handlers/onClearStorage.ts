import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {SettingsService} from '../../services/SettingsService';

export const handleClearStorage = async () => {
  BoardService.clear();
  GameStatsManager.resetStatistics();
  SettingsService.clear();
  // BackgroundService.clear();
};
