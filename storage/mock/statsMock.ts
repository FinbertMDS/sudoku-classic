import {GameStatsManager} from '../../services/GameStatsManager';
import {GameLogEntryV2, TimeRange} from '../../types';
import {DEFAULT_PLAYER_ID} from '../../utils/constants';
import {statsStorage} from '../statsStorage';

const gameLog = [
  {
    id: 'sample-uuid-1',
    playerId: DEFAULT_PLAYER_ID,
    level: 'easy',
    completed: true,
    startTime: '2025-05-31T14:00:00Z',
    endTime: '2025-05-31T14:35:12Z',
    durationSeconds: 2112,
    mistakes: 2,
    hintCount: 1,
  },
  {
    id: 'sample-uuid-2',
    playerId: DEFAULT_PLAYER_ID,
    level: 'medium',
    completed: true,
    startTime: '2025-05-30T14:00:00Z',
    endTime: '2025-05-30T14:42:27Z',
    durationSeconds: 2547,
    mistakes: 3,
    hintCount: 0,
  },
  {
    id: 'sample-uuid-3',
    playerId: DEFAULT_PLAYER_ID,
    level: 'hard',
    completed: false,
    startTime: '2025-05-29T14:00:00Z',
    endTime: '2025-05-29T14:18:45Z',
    durationSeconds: 1125,
    mistakes: 1,
    hintCount: 3,
  },
  {
    id: 'sample-uuid-4',
    playerId: DEFAULT_PLAYER_ID,
    level: 'expert',
    completed: true,
    startTime: '2025-05-28T14:00:00Z',
    endTime: '2025-05-28T14:28:39Z',
    durationSeconds: 1719,
    mistakes: 0,
    hintCount: 2,
  },
  {
    id: 'sample-uuid-5',
    playerId: DEFAULT_PLAYER_ID,
    level: 'easy',
    completed: true,
    startTime: '2025-05-27T14:00:00Z',
    endTime: '2025-05-27T14:50:03Z',
    durationSeconds: 3003,
    mistakes: 4,
    hintCount: 1,
  },
  {
    id: 'sample-uuid-6',
    playerId: DEFAULT_PLAYER_ID,
    level: 'medium',
    completed: true,
    startTime: '2025-05-26T14:00:00Z',
    endTime: '2025-05-26T14:30:11Z',
    durationSeconds: 1811,
    mistakes: 2,
    hintCount: 0,
  },
  {
    id: 'sample-uuid-7',
    playerId: DEFAULT_PLAYER_ID,
    level: 'hard',
    completed: false,
    startTime: '2025-05-25T14:00:00Z',
    endTime: '2025-05-25T14:15:44Z',
    durationSeconds: 944,
    mistakes: 3,
    hintCount: 2,
  },
  {
    id: 'sample-uuid-8',
    playerId: DEFAULT_PLAYER_ID,
    level: 'expert',
    completed: true,
    startTime: '2025-05-24T14:00:00Z',
    endTime: '2025-05-24T14:38:56Z',
    durationSeconds: 2336,
    mistakes: 1,
    hintCount: 3,
  },
  {
    id: 'sample-uuid-9',
    playerId: DEFAULT_PLAYER_ID,
    level: 'easy',
    completed: true,
    startTime: '2025-05-23T14:00:00Z',
    endTime: '2025-05-23T14:43:10Z',
    durationSeconds: 2590,
    mistakes: 0,
    hintCount: 1,
  },
  {
    id: 'sample-uuid-10',
    playerId: DEFAULT_PLAYER_ID,
    level: 'medium',
    completed: false,
    startTime: '2025-05-22T14:00:00Z',
    endTime: '2025-05-22T14:20:37Z',
    durationSeconds: 1237,
    mistakes: 5,
    hintCount: 0,
  },
] as GameLogEntryV2[];

const saveMockGameLogs = async () => {
  const oldLogs = statsStorage.getGameLogs();
  if (oldLogs.length > 0) {
    return;
  }
  console.log('mock game logs', gameLog);
  await GameStatsManager.saveLogs(gameLog);
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogs = await GameStatsManager.getLogs();
  await GameStatsManager.updateStatsWithAllCache(
    allLogs,
    affectedRanges,
    DEFAULT_PLAYER_ID,
  );

  statsStorage.setLastStatsCacheUpdate();
};

export const statsMock = {
  saveMockGameLogs,
};
