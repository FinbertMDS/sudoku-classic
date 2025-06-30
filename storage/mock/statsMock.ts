import {StatsService} from '../../services';
import {GameLogEntry, GameLogEntryV2, TimeRange} from '../../types';
import {DEFAULT_PLAYER_ID} from '../../utils/constants';
import {statsStorage} from '../statsStorage';

const gameLog = [
  {
    id: 'sample-uuid-1',
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
    level: 'medium',
    completed: false,
    startTime: '2025-05-22T14:00:00Z',
    endTime: '2025-05-22T14:20:37Z',
    durationSeconds: 1237,
    mistakes: 5,
    hintCount: 0,
  },
] as GameLogEntry[];

const gameLogV2: GameLogEntryV2[] = gameLog.map((log) => ({
  ...log,
  playerId: DEFAULT_PLAYER_ID,
}));

const saveGameLogs = async () => {
  const oldLogs = statsStorage.getGameLogs();
  if (oldLogs.length > 0) {
    return;
  }
  console.log('mock game logs', gameLog);
  statsStorage.saveGameLogs(gameLog);
};

const saveGameLogsV2 = async () => {
  const oldLogs = statsStorage.getGameLogsV2();
  if (oldLogs.length > 0) {
    return;
  }
  console.log('mock game logs', gameLog);
  statsStorage.saveGameLogsV2(gameLogV2);
};

const saveMockGameLogs = async () => {
  await saveGameLogs();
};

const saveMockGameLogsV2 = async () => {
  await saveGameLogsV2();
  await updateStats();
};

const updateStats = async () => {
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogs = await StatsService.getLogs();
  await StatsService.updateStatsWithAllCache(
    allLogs,
    affectedRanges,
    DEFAULT_PLAYER_ID,
  );

  await StatsService.updateStatsDone();
};

export const statsMock = {
  saveMockGameLogs,
  saveMockGameLogsV2,
};
