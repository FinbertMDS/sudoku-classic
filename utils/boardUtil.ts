// boardUtil.ts

import { generateKillerSudoku } from 'killer-sudoku-generator';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { Cage, CellValue, InitGame, Level } from '../types';
import { BOARD_SIZE, LEVELS } from './constants';

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
      .map(ch => (ch === '-' ? null : parseInt(ch, 10)));
    grid.push(row);
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
  return board.map(row => [...row]);
};

/**
 * Deep clone a 3D array (for notes)
 */
export const deepCloneNotes = (notes: string[][][]): string[][][] => {
  return notes.map(row => row.map(cell => [...cell]));
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

export function sortAreasCells(areas: Cage[]): Cage[] {
  return areas.map(cage => ({
    ...cage,
    cells: [...cage.cells].sort((a, b) => {
      if (a[0] !== b[0]) {
        // Ưu tiên hàng (row) trước
        return a[0] - b[0];
      }
      // Nếu cùng hàng, ưu tiên cột (col)
      return a[1] - b[1];
    }),
  }));
}

export function getAdjacentCellsInSameCage(
  row: number,
  col: number,
  cages: Cage[],
) {
  // Danh sách các vị trí xung quanh: trên, dưới, trái, phải
  const adjacentCells = [
    { direction: 'top', row: row - 1, col: col },
    { direction: 'bottom', row: row + 1, col: col },
    { direction: 'left', row: row, col: col - 1 },
    { direction: 'right', row: row, col: col + 1 },
  ];

  const result = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    topleft: false,
    topright: false,
    bottomleft: false,
    bottomright: false,
  };

  // Duyệt qua tất cả các cage để tìm các ô xung quanh thuộc cùng *cage*
  for (let cage of cages) {
    let currentCell = [row, col];

    // Kiểm tra nếu ô hiện tại có trong cage
    if (
      cage.cells.some(
        cell => JSON.stringify(cell) === JSON.stringify(currentCell),
      )
    ) {
      // Duyệt qua các ô xung quanh
      for (let adj of adjacentCells) {
        // Kiểm tra nếu ô xung quanh có trong cùng một cage
        if (
          cage.cells.some(
            cell => JSON.stringify(cell) === JSON.stringify([adj.row, adj.col]),
          )
        ) {
          result[adj.direction as keyof typeof result] = true; // Gán true cho ô xung quanh nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía trên bên trái có trong cùng một cage
        if (
          adj.direction === 'top' &&
          cage.cells.some(
            cell => JSON.stringify(cell) === JSON.stringify([row - 1, col - 1]),
          )
        ) {
          result.topleft = true; // Gán true cho ô trên bên trái nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía trên bên phải có trong cùng một cage
        if (
          adj.direction === 'top' &&
          cage.cells.some(
            cell => JSON.stringify(cell) === JSON.stringify([row - 1, col + 1]),
          )
        ) {
          result.topright = true; // Gán true cho ô trên bên phải nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía dưới bên trái có trong cùng một cage
        if (
          adj.direction === 'bottom' &&
          cage.cells.some(
            cell => JSON.stringify(cell) === JSON.stringify([row + 1, col - 1]),
          )
        ) {
          result.bottomleft = true; // Gán true cho ô dưới bên trái nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía dưới bên phải có trong cùng một cage
        if (
          adj.direction === 'bottom' &&
          cage.cells.some(
            cell => JSON.stringify(cell) === JSON.stringify([row + 1, col + 1]),
          )
        ) {
          result.bottomright = true; // Gán true cho ô dưới bên phải nếu thuộc cùng cage
        }
      }
      break; // Nếu đã tìm được cage, không cần duyệt qua các cage khác nữa
    }
  }

  return result;
}

export function removeNoteFromPeers(
  notes: string[][][],
  row: number,
  col: number,
  value: number,
): string[][][] {
  const updatedNotes = notes.map(rowNotes =>
    rowNotes.map(cellNotes => [...cellNotes]),
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
    updatedNotes[r][c] = updatedNotes[r][c].filter(n => n !== valueStr);
  }

  // Remove notes from current cell
  updatedNotes[row][col] = [];

  return updatedNotes;
}

export const increaseDifficulty = (level: Level): Difficulty => {
  const mapping: Record<Level, Difficulty> = {
    easy: 'medium',
    medium: 'hard',
    hard: 'expert',
    expert: 'expert',
  };
  return mapping[level];
};

export const generateBoard = (level: Level, id: string) => {
  const adjustedDifficulty = increaseDifficulty(level as Level);

  const sudoku = generateKillerSudoku(adjustedDifficulty);

  // if level is expert
  const shouldHideAllCells = level === LEVELS[LEVELS.length - 1];
  const puzzleString = shouldHideAllCells ? '-'.repeat(81) : sudoku.puzzle;

  const initGame = {
    id,
    initialBoard: stringToGrid(puzzleString),
    solvedBoard: stringToGrid(sudoku.solution),
    cages: sortAreasCells(sudoku.areas),
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
