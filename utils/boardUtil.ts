// boardUtil.ts

import { Board, generate, solve } from 'sudoku-core';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { CellValue, InitGame, Level } from '../types';
import { BOARD_SIZE } from './constants';

/**
 * Chuyển string thành mảng 2 chiều theo số cột nhất định (thường là 9 với Sudoku).
 * @param input string
 * @param size Số cột trong mảng 2 chiều
 * @returns Mảng 2 chiều
 */
export function stringToGrid(input: string, columns = 9): CellValue[][] {
  const grid: CellValue[][] = [];
  for (let i = 0; i < input.length; i += columns) {
    const row = input
      .slice(i, i + columns)
      .split('')
      .map((ch) => (ch === '-' ? null : parseInt(ch, 10)));
    grid.push(row);
  }
  return grid;
}

export function convertBoardToGrid(board: Board): CellValue[][] {
  const grid: CellValue[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    grid.push(board.slice(i * BOARD_SIZE, i * BOARD_SIZE + BOARD_SIZE));
  }
  return grid;
}

// Tạo mảng 9x9 cho mỗi ô trong Sudoku
export function createEmptyGrid<T>(): (T | null)[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
}

export function createEmptyGridNumber(): number[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0),
  );
}

/**
 * Tạo mảng 9x9x9 cho mỗi note
 * @returns Mảng 9x9x9
 */
export function createEmptyGridNotes<T>(): T[][][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => []),
  );
}

/**
 * Deep clone a 2D array (for board)
 */
export const deepCloneBoard = (board: CellValue[][]): CellValue[][] => {
  return board.map((row) => [...row]);
};

/**
 * Deep clone a 3D array (for notes)
 */
export const deepCloneNotes = (notes: string[][][]): string[][][] => {
  return notes.map((row) => row.map((cell) => [...cell]));
};

/**
 * Kiểm tra xem board đã được giải quyết hay chưa.
 * @param board Mảng 2 chiều đại diện cho board
 * @param solvedBoard Mảng 2 chiều đại diện cho board đã được giải quyết
 * @returns true nếu đã giải quyết, false nếu chưa
 */
export const checkBoardIsSolved = (
  board: CellValue[][],
  solvedBoard: CellValue[][],
): boolean => {
  if (board.length !== solvedBoard.length) {
    return false;
  }

  return board.every(
    (row, rowIndex) =>
      row.length === solvedBoard[rowIndex].length &&
      row.every((cell, colIndex) => cell === solvedBoard[rowIndex][colIndex]),
  );
};

export function removeNoteFromPeers(
  notes: string[][][],
  row: number,
  col: number,
  value: number,
): string[][][] {
  const updatedNotes = notes.map((rowNotes) =>
    rowNotes.map((cellNotes) => [...cellNotes]),
  );

  const valueStr = value.toString();

  const peers = new Set<string>();

  // Same row
  for (let c = 0; c < 9; c++) {
    if (c !== col) {
      peers.add(`${row},${c}`);
    }
  }

  // Same column
  for (let r = 0; r < 9; r++) {
    if (r !== row) {
      peers.add(`${r},${col}`);
    }
  }

  // Same box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if (r !== row || c !== col) {
        peers.add(`${r},${c}`);
      }
    }
  }

  for (const key of peers) {
    const [r, c] = key.split(',').map(Number);
    updatedNotes[r][c] = updatedNotes[r][c].filter((n) => n !== valueStr);
  }

  // Remove notes from current cell
  updatedNotes[row][col] = [];

  return updatedNotes;
}

export const generateBoard = (level: Level, id: string) => {
  const board = generate(level as Difficulty);
  const solvedBoard = solve(board);

  const initGame = {
    id,
    initialBoard: convertBoardToGrid(board),
    solvedBoard: convertBoardToGrid(solvedBoard.board as Board),
    savedLevel: level,
  } as InitGame;

  return initGame;
};

export const isRowFilled = (
  row: number,
  newBoard: CellValue[][],
  solvedBoard: number[][],
): boolean => {
  if (!newBoard[row]) {
    return false;
  } // Nếu dòng không tồn tại, coi như chưa filled
  for (let col = 0; col < BOARD_SIZE; col++) {
    if (!newBoard[row][col] || newBoard[row][col] !== solvedBoard[row][col]) {
      return false; // Nếu có ô nào trong dòng là 0, coi như chưa filled
    }
  }
  return true; // Nếu tất cả ô trong dòng đều khác 0, coi như đã filled
};

export const isColFilled = (
  col: number,
  newBoard: CellValue[][],
  solvedBoard: number[][],
): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    if (!newBoard[row][col] || newBoard[row][col] !== solvedBoard[row][col]) {
      return false; // Nếu có ô nào trong cột là 0, coi như chưa filled
    }
  }
  return true; // Nếu tất cả ô trong cột đều khác 0, coi như đã filled
};
