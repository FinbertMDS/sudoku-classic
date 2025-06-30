import {playerProfileStorage, statsStorage} from '..';
import {StatsService} from '../../services';
import {GameLogEntryV2, TimeRange} from '../../types';
import {PlayerProfile} from '../../types/player';

const mockPlayers: PlayerProfile[] = [
  {
    id: 'p1',
    name: 'Alice',
    avatarColor: 'red',
    createdAt: '2025-05-01T10:00:00Z',
    totalGames: 10,
  },
  {
    id: 'p2',
    name: 'Bob',
    avatarColor: 'blue',
    createdAt: '2025-05-02T10:00:00Z',
    totalGames: 8,
  },
  {
    id: 'p3',
    name: 'Charlie',
    avatarColor: 'green',
    createdAt: '2025-05-03T10:00:00Z',
    totalGames: 5,
  },
  {
    id: 'p4',
    name: 'Daisy',
    avatarColor: 'yellow',
    createdAt: '2025-05-04T10:00:00Z',
    totalGames: 3,
  },
];

const mockGameLogs: GameLogEntryV2[] = [
  {
    id: 'g1',
    level: 'easy',
    completed: true,
    startTime: '2025-06-20T10:00:00Z',
    endTime: '2025-06-20T10:03:00Z',
    durationSeconds: 180,
    mistakes: 1,
    hintCount: 2,
    playerId: 'p1',
  },
  {
    id: 'g2',
    level: 'medium',
    completed: true,
    startTime: '2025-06-21T10:00:00Z',
    endTime: '2025-06-21T10:08:00Z',
    durationSeconds: 480,
    mistakes: 0,
    hintCount: 1,
    playerId: 'p1',
  },
  {
    id: 'g3',
    level: 'hard',
    completed: false,
    startTime: '2025-06-22T10:00:00Z',
    endTime: '2025-06-22T10:05:00Z',
    durationSeconds: 300,
    mistakes: 3,
    hintCount: 5,
    playerId: 'p1',
  },

  {
    id: 'g4',
    level: 'easy',
    completed: true,
    startTime: '2025-06-20T11:00:00Z',
    endTime: '2025-06-20T11:06:00Z',
    durationSeconds: 360,
    mistakes: 2,
    hintCount: 1,
    playerId: 'p2',
  },
  {
    id: 'g5',
    level: 'medium',
    completed: false,
    startTime: '2025-06-21T11:00:00Z',
    endTime: '2025-06-21T11:10:00Z',
    durationSeconds: 600,
    mistakes: 4,
    hintCount: 4,
    playerId: 'p2',
  },

  {
    id: 'g6',
    level: 'easy',
    completed: true,
    startTime: '2025-06-22T09:00:00Z',
    endTime: '2025-06-22T09:02:00Z',
    durationSeconds: 120,
    mistakes: 0,
    hintCount: 0,
    playerId: 'p3',
  },
  {
    id: 'g7',
    level: 'medium',
    completed: true,
    startTime: '2025-06-23T09:00:00Z',
    endTime: '2025-06-23T09:06:00Z',
    durationSeconds: 360,
    mistakes: 1,
    hintCount: 0,
    playerId: 'p3',
  },

  {
    id: 'g8',
    level: 'easy',
    completed: false,
    startTime: '2025-06-24T08:00:00Z',
    endTime: '2025-06-24T08:05:00Z',
    durationSeconds: 300,
    mistakes: 4,
    hintCount: 3,
    playerId: 'p4',
  },
  {
    id: 'g9',
    level: 'medium',
    completed: false,
    startTime: '2025-06-25T08:00:00Z',
    endTime: '2025-06-25T08:12:00Z',
    durationSeconds: 720,
    mistakes: 5,
    hintCount: 5,
    playerId: 'p4',
  },
];

const saveMockRanking = async () => {
  const oldLogs = statsStorage.getGameLogsV2();
  if (oldLogs.length > 0) {
    return;
  }

  // save mock players
  playerProfileStorage.savePlayers(mockPlayers);
  playerProfileStorage.setCurrentPlayerId(mockPlayers[0].id);

  // save mock game logs
  console.log('mock game logs', mockGameLogs);
  statsStorage.saveGameLogsV2(mockGameLogs);
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogs = statsStorage.getGameLogsV2();

  mockPlayers.forEach(async (player) => {
    await StatsService.updateStatsWithAllCache(
      allLogs,
      affectedRanges,
      player.id,
    );
  });

  await StatsService.updateStatsDone();
};

export const rankingMock = {
  saveMockRanking,
};
