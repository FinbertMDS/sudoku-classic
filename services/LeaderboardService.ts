// src/services/LeaderboardService.ts

import {TFunction} from 'i18next';
import {RankedPlayer} from '../types';
import {
  getAllPlayerHighlights,
  getAllStats,
  getRankedPlayers,
} from '../utils/leaderboardUtil';

const getAllPlayerStats = async (t: TFunction): Promise<RankedPlayer[]> => {
  const playerStats = await getAllStats();
  const rankedPlayerStats = getRankedPlayers(playerStats);
  const rankedPlayerHighlights = await getAllPlayerHighlights(
    rankedPlayerStats,
    t,
  );
  return rankedPlayerHighlights;
};

export const LeaderboardService = {
  getAllPlayerStats,
};
