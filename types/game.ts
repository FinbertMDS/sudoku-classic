import {LEVELS} from '../utils/buildConstants';

export type Cell = {
  row: number;
  col: number;
  value: CellValue;
};

export type CellValue = number | null;

export type Level = (typeof LEVELS)[number];

export type GameInfo = {
  id: string;
  initialBoard: CellValue[][];
  solvedBoard: number[][];
};

export type InitGame = GameInfo & {
  savedLevel: Level;
  savedScore: number;
};

export type SavedGame = {
  savedId: string;
  savedLevel: Level;
  savedScore: number;
  savedBoard: CellValue[][];
  savedHintCount: number;
  savedTotalHintCountUsed: number;
  savedMistake: number;
  savedTotalMistake: number;
  savedTimePlayed: number;
  savedHistory: CellValue[][][];
  savedNotes: string[][][];
  lastSaved: Date;
};

export type SavedMistake = {
  savedMistake: number;
  savedTotalMistake: number;
};

export type SavedHintCount = {
  savedHintCount: number;
  savedTotalHintCountUsed: number;
};
