// boardUtil.ts
import {getSudoku} from 'sudoku-gen';
import {Difficulty} from 'sudoku-gen/dist/types/difficulty.type';
import {CellValue, InitGame, Level} from '../types';
import {BOARD_SIZE} from './constants';

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

// Tạo mảng 9x9 cho mỗi ô trong Sudoku
export function createEmptyGrid<T>(): (T | null)[][] {
  return Array.from({length: BOARD_SIZE}, () =>
    Array.from({length: BOARD_SIZE}, () => null),
  );
}

export function createEmptyGridNumber(): number[][] {
  return Array.from({length: BOARD_SIZE}, () =>
    Array.from({length: BOARD_SIZE}, () => 0),
  );
}

/**
 * Tạo mảng 9x9x9 cho mỗi note
 * @returns Mảng 9x9x9
 */
export function createEmptyGridNotes<T>(): T[][][] {
  return Array.from({length: BOARD_SIZE}, () =>
    Array.from({length: BOARD_SIZE}, () => []),
  );
}

export function getCellFromIndex(index: number): {row: number; col: number} {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
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

  const boardLength = board.length;
  for (let i = 0; i < boardLength; i++) {
    const row = board[i];
    const solvedRow = solvedBoard[i];

    if (row.length !== solvedRow.length) {
      return false;
    }

    const rowLength = row.length;
    for (let j = 0; j < rowLength; j++) {
      if (row[j] !== solvedRow[j]) {
        return false;
      }
    }
  }

  return true;
};

export function removeNoteFromPeers(
  notes: string[][][],
  row: number,
  col: number,
  value: number,
): string[][][] {
  // Clone notes array
  const updatedNotes = notes.map((rowNotes) =>
    rowNotes.map((cellNotes) => [...cellNotes]),
  );

  const valueStr = value.toString();

  // Get all peers in same row, column and box
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  // Update notes for all peers
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // Skip if same cell
      if (r === row && c === col) {
        continue;
      }

      // Check if peer is in same row, column or box
      const inSameRow = r === row;
      const inSameCol = c === col;
      const inSameBox =
        r >= boxStartRow &&
        r < boxStartRow + 3 &&
        c >= boxStartCol &&
        c < boxStartCol + 3;

      if (inSameRow || inSameCol || inSameBox) {
        updatedNotes[r][c] = updatedNotes[r][c].filter((n) => n !== valueStr);
      }
    }
  }

  // Clear notes for current cell
  updatedNotes[row][col] = [];

  return updatedNotes;
}

export const generateBoard = (level: Level, id: string) => {
  const board = getSudoku(level as Difficulty);

  const initGame = {
    id,
    initialBoard: stringToGrid(board.puzzle),
    solvedBoard: stringToGrid(board.solution),
    savedLevel: level,
    // savedScore: 0,
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

export function getFontSizesFromCellSize() {
  return {
    cellText: 22,
    noteText: 8,
    cageText: 9,
    noteWidth: 9,
  };
}
