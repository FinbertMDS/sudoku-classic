import {PlayerProfile} from './player';

export interface PlayerStats {
  player: PlayerProfile;
  totalGames: number;
  completedGames: number;
  totalTime: number;
  speedScore?: number;
  winRate: number;
  notes?: string;
  highlights?: string[];
  winStreak?: number;
  byLevel?: {
    [level: string]: {
      wins: number;
      fastestTime: number;
      avgTime: number;
      totalGames: number;
    };
  };
}

export interface RankedPlayer extends PlayerStats {
  score: number;
  totalWeightedWins: number;
}

export type PlayerHighlight = {
  id: string;
  name: string;
  highlights: string[];
};

export type LevelStatEntry = {
  playerId: string;
  playerName: string;
  completedGames: number;
  totalDuration: number;
  avgDuration: number;
};
