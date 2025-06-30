import {TFunction} from 'i18next';
import {PlayerHighlight, RankedPlayer} from '../types';
import {PLAYER_STATS_THRESHOLDS} from './constants';

export const getPlayerNotes = (stat: RankedPlayer, t: TFunction): string => {
  const {totalGames, completedGames, winRate, score, totalWeightedWins} = stat;

  if (totalGames === 0) {
    return t('playerNotes_noGames');
  }

  if (winRate === 1) {
    return t('playerNotes_bestPerformance');
  }

  if (winRate === 1) {
    return t('playerNotes_stable');
  }

  if (
    totalGames >= PLAYER_STATS_THRESHOLDS.minGamesForGoodPlayer &&
    winRate >= PLAYER_STATS_THRESHOLDS.highWinRate
  ) {
    return t('playerNotes_manyGames');
  }

  if (
    winRate >= PLAYER_STATS_THRESHOLDS.mediumWinRate &&
    winRate < PLAYER_STATS_THRESHOLDS.highWinRate
  ) {
    return t('playerNotes_even');
  }

  if (completedGames === 0) {
    return t('playerNotes_allNotCompleted');
  }

  if (
    totalWeightedWins > PLAYER_STATS_THRESHOLDS.strongPlayerWins &&
    score > PLAYER_STATS_THRESHOLDS.strongPlayerScore
  ) {
    return t('playerNotes_strongAtHardLevels');
  }

  // Mặc định
  return t('playerNotes_generic');
};

export const generateOverallRankingNotes = (
  statsList: RankedPlayer[],
  t: TFunction,
): PlayerHighlight[] => {
  if (statsList.length === 0) {
    return [];
  }

  const result: PlayerHighlight[] = [];

  const topScore = [...statsList].sort((a, b) => b.score - a.score)[0];
  const topWinRate = [...statsList].sort((a, b) => b.winRate - a.winRate)[0];

  const topFast = [...statsList]
    .filter((s) => s.completedGames > 0 && s.speedScore !== undefined)
    .sort((a, b) => a.speedScore! - b.speedScore!)[0];

  const topGames = [...statsList].sort(
    (a, b) => b.totalGames - a.totalGames,
  )[0];

  for (const stat of statsList) {
    if (stat.totalGames === 0 || stat.completedGames === 0) {
      continue;
    }

    const highlights: string[] = [];

    if (stat.player.id === topScore.player.id) {
      highlights.push(t('playerNotes_highlights_topRanked'));
    }

    if (stat.player.id === topWinRate.player.id) {
      highlights.push(t('playerNotes_highlights_bestPerformance'));
    }

    if (stat.player.id === topFast?.player.id) {
      highlights.push(t('playerNotes_highlights_fastest'));
    }

    if (stat.player.id === topGames.player.id) {
      highlights.push(t('playerNotes_highlights_mostGames'));
    }

    if (stat.completedGames === 0 && stat.totalGames > 0) {
      highlights.push(t('playerNotes_highlights_allNotCompleted'));
    }

    result.push({
      id: stat.player.id,
      name: stat.player.name,
      highlights,
    });
  }

  return result;
};
