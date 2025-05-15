import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { AppSettings, Cell, CellValue } from '../../types';
import { getAdjacentCellsInSameCage } from '../../utils/boardUtil';
import {
  ANIMATION_CELL_KEY_SEPARATOR,
  ANIMATION_DURATION,
  ANIMATION_TYPE,
  BOARD_SIZE,
  CAGE_PADDING,
  CAGE_PADDING_FIRST_1,
  CAGE_PADDING_FIRST_2,
  CELL_SIZE,
} from '../../utils/constants';

type GridProps = {
  board: CellValue[][];
  cages: { cells: [number, number][]; sum: number }[];
  notes: string[][][];
  solvedBoard: number[][];
  selectedCell: Cell | null;
  animatedCells: { [key: string]: number };
  settings: AppSettings;
  onPress: (cell: Cell | null) => void;
};

const Grid = ({
  board,
  cages,
  notes,
  solvedBoard,
  selectedCell,
  animatedCells,
  settings,
  onPress,
}: GridProps) => {
  const { theme } = useTheme();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const rowScales = Array.from({ length: BOARD_SIZE }, () => useSharedValue(1));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const colScales = Array.from({ length: BOARD_SIZE }, () => useSharedValue(1));

  const animatedStyles = useRef(
    Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (__, col) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useAnimatedStyle(() => ({
          transform: [{ scale: rowScales[row].value * colScales[col].value }],
        })),
      ),
    ),
  ).current;

  useEffect(() => {
    // Kiểm tra animatedCells có tồn tại không và có chứa ít nhất 1 key không
    if (!animatedCells || Object.keys(animatedCells).length === 0) {
      return;
    }

    // Chỉ cần lặp qua các ô đã được animate
    Object.keys(animatedCells).forEach(key => {
      const [row, col] = key.split(ANIMATION_CELL_KEY_SEPARATOR).map(Number);

      if (animatedCells[key] === ANIMATION_TYPE.NONE) {
        return;
      }

      if (
        animatedCells[key] === ANIMATION_TYPE.ROW ||
        animatedCells[key] === ANIMATION_TYPE.ROW_COL
      ) {
        rowScales[row].value = withSequence(
          withTiming(0.9, { duration: ANIMATION_DURATION / 3 }),
          withTiming(1, { duration: ANIMATION_DURATION / 3 }),
        );
      }
      if (
        animatedCells[key] === ANIMATION_TYPE.COL ||
        animatedCells[key] === ANIMATION_TYPE.ROW_COL
      ) {
        colScales[col].value = withSequence(
          withTiming(0.9, { duration: ANIMATION_DURATION / 3 }),
          withTiming(1, { duration: ANIMATION_DURATION / 3 }),
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedCells]);

  const isCellInSameRowOrColOrBox = (row: number, col: number) => {
    if (!selectedCell) {
      return false;
    }
    const selRow = selectedCell.row;
    const selCol = selectedCell.col;
    const inSameBox =
      Math.floor(selRow / 3) === Math.floor(row / 3) &&
      Math.floor(selCol / 3) === Math.floor(col / 3);
    return selRow === row || selCol === col || inSameBox;
  };

  const getCageForCell = (row: number, col: number) => {
    return cages.find(cage =>
      cage.cells.some(cell => cell[0] === row && cell[1] === col),
    );
  };

  const renderCageBorders = () => {
    // Map từ (row,col) => cage index
    const cageMap = new Map<string, number>();
    cages.forEach((cage, index) => {
      for (const [r, c] of cage.cells) {
        cageMap.set(`${r},${c}`, index);
      }
    });

    const lines = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const thisCageIdx = cageMap.get(`${r},${c}`);

        if (thisCageIdx == null) {
          continue;
        } // bỏ qua ô không thuộc cage nào

        const cage = getCageForCell(r, c);
        const cagePaddingFirst =
          cage && cage?.sum <= 10 ? CAGE_PADDING_FIRST_1 : CAGE_PADDING_FIRST_2;
        const isCageFirst =
          cage && cage?.cells[0][0] === r && cage?.cells[0][1] === c;

        const adjacentCells = getAdjacentCellsInSameCage(r, c, cages);

        // 1. Vẽ bên phải nếu neighbor khác cage
        if (c <= 8) {
          const rightCageIdx = cageMap.get(`${r},${c + 1}`);
          if (thisCageIdx !== rightCageIdx) {
            lines.push(
              <Line
                key={`right-${r}-${c}`}
                x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
                y1={r * CELL_SIZE + (adjacentCells.top ? 0 : CAGE_PADDING)}
                x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
                y2={
                  (r + 1) * CELL_SIZE -
                  (adjacentCells.bottom ? 0 : CAGE_PADDING)
                }
                stroke={theme.secondary}
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />,
            );
          }
        }

        // 2. Vẽ bên dưới nếu neighbor khác cage
        if (r <= 8) {
          const bottomCageIdx = cageMap.get(`${r + 1},${c}`);
          if (thisCageIdx !== bottomCageIdx) {
            lines.push(
              <Line
                key={`bottom-${r}-${c}`}
                x1={c * CELL_SIZE + (adjacentCells.left ? 0 : CAGE_PADDING)}
                y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
                x2={
                  (c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : CAGE_PADDING)
                }
                y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
                stroke={theme.secondary}
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />,
            );
          }
        }

        // 3. Vẽ bên trái nếu là cột 0 hoặc neighbor left khác cage
        if (c === 0 || cageMap.get(`${r},${c - 1}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`left-${r}-${c}`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={
                r * CELL_SIZE +
                (isCageFirst ? cagePaddingFirst : 0) +
                (adjacentCells.top ? 0 : CAGE_PADDING)
              }
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={
                (r + 1) * CELL_SIZE - (adjacentCells.bottom ? 0 : CAGE_PADDING)
              }
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 4. Vẽ bên trên nếu là hàng 0 hoặc neighbor top khác cage
        if (r === 0 || cageMap.get(`${r - 1},${c}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`top-${r}-${c}`}
              x1={
                c * CELL_SIZE +
                (isCageFirst ? cagePaddingFirst : 0) +
                (adjacentCells.left
                  ? adjacentCells.right
                    ? -CAGE_PADDING
                    : 0
                  : CAGE_PADDING)
              }
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={
                (c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : CAGE_PADDING)
              }
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 5. Vẽ góc phần tư thứ nhất nếu có neighbor trên và bên trái cùng cage
        if (adjacentCells.top && adjacentCells.left && !adjacentCells.topleft) {
          lines.push(
            <Line
              key={`top-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={r * CELL_SIZE}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 6. Vẽ góc phần tư thứ hai nếu có neighbor trên và bên phải cùng cage
        if (
          adjacentCells.top &&
          adjacentCells.right &&
          !adjacentCells.topright
        ) {
          lines.push(
            <Line
              key={`top-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={r * CELL_SIZE + CAGE_PADDING}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={r * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={r * CELL_SIZE + CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 7. Vẽ góc phần tư thứ ba nếu có neighbor dưới và bên trái cùng cage
        if (
          adjacentCells.bottom &&
          adjacentCells.left &&
          !adjacentCells.bottomleft
        ) {
          lines.push(
            <Line
              key={`bottom-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={c * CELL_SIZE + CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 8. Vẽ góc phần tư thứ tư nếu có neighbor dưới và bên phải cùng cage
        if (
          adjacentCells.bottom &&
          adjacentCells.right &&
          !adjacentCells.bottomright
        ) {
          lines.push(
            <Line
              key={`bottom-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE - CAGE_PADDING}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - CAGE_PADDING}
              y2={(r + 1) * CELL_SIZE - CAGE_PADDING}
              stroke={theme.secondary}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
      }
    }

    return lines;
  };

  const checkSameValueConflict = (
    row: number,
    col: number,
    cellValue: CellValue,
    _selectedCell: Cell | null,
  ): boolean => {
    if (!cellValue || !_selectedCell) {
      return false;
    }

    const sameValue = cellValue === _selectedCell.value;
    const sameRow = row === _selectedCell.row;
    const sameCol = col === _selectedCell.col;
    const sameBox =
      Math.floor(row / 3) === Math.floor(_selectedCell.row / 3) &&
      Math.floor(col / 3) === Math.floor(_selectedCell.col / 3);

    return sameValue && (sameRow || sameCol || sameBox);
  };

  const renderCell = useCallback(
    (row: number, col: number, animatedStyle: any) => {
      const cellValue = board[row][col];
      const cellNotes = notes[row][col];
      const cage = getCageForCell(row, col);
      const isCageFirst =
        cage?.cells[0][0] === row && cage?.cells[0][1] === col;

      const isSelected = selectedCell?.row === row && selectedCell?.col === col;

      const isRelated =
        settings.highlightAreas && isCellInSameRowOrColOrBox(row, col);

      const isSameValue =
        settings.highlightIdenticalNumbers &&
        !isSelected &&
        cellValue &&
        cellValue === selectedCell?.value;

      const isSameValueConflict =
        settings.highlightDuplicates &&
        checkSameValueConflict(row, col, cellValue, selectedCell);

      const isMistake = cellValue !== 0 && cellValue !== solvedBoard[row][col];

      const showRelatedOverlay = !isSelected && isRelated;
      const showOverlay = isSelected || isSameValue;
      const overlayColor = isSelected
        ? theme.selectedOverlayColor
        : isSameValueConflict
          ? theme.conflictOverlayColor
          : theme.sameValueOverlayColor;

      const showValue = cellValue !== 0;
      const showMistake = settings.autoCheckMistake && isMistake;

      const isBoldBorder = (index: number) => index % 3 === 0;
      const isLastBolBorder = (index: number) => index === BOARD_SIZE - 1;

      const borderStyle = {
        borderColor: theme.cellBorderColor,
        borderTopWidth: isBoldBorder(row) ? 1.2 : 0.2,
        borderBottomWidth: isLastBolBorder(row) ? 1.2 : 0.2,
        borderLeftWidth: isBoldBorder(col) ? 1.2 : 0.2,
        borderRightWidth: col === BOARD_SIZE - 1 ? 1.2 : 0.2,
      };

      return (
        <View
          key={`cell-${row}-${col}`}
          style={[styles.cellWrapper, { backgroundColor: theme.background }]}>
          {showRelatedOverlay && (
            <View
              style={[
                styles.relatedOverlay,
                { backgroundColor: theme.overlayColor },
              ]}
            />
          )}

          {showOverlay && (
            <View
              style={[styles.selectedOverlay, { backgroundColor: overlayColor }]}
            />
          )}

          <TouchableOpacity
            style={[styles.cell, borderStyle]}
            onPress={() => onPress({ row, col, value: cellValue })}
            activeOpacity={0.8}>
            {isCageFirst && (
              <Text style={[styles.cageText, { color: theme.secondary }]}>
                {cage?.sum}
              </Text>
            )}

            <View style={styles.notesContainerTop}>
              {Array.from({ length: BOARD_SIZE }, (_, i) => {
                const noteValue = (i + 1).toString();
                return (
                  <Text key={i} style={[styles.noteText, { color: theme.text }]}>
                    {cellNotes.includes(noteValue) ? i + 1 : ' '}
                  </Text>
                );
              })}
            </View>

            <Animated.View style={[styles.cell, animatedStyle]}>
              {showValue && (
                <Text
                  style={[
                    styles.cellText,
                    { color: theme.text },
                    showMistake && { color: theme.danger },
                  ]}>
                  {cellValue}
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [board, notes, selectedCell, settings, solvedBoard, theme, onPress],
  );

  return (
    <>
      {/* Board Sudoku */}
      <View style={styles.boardContainer}>
        <View style={styles.gridWrapper}>
          <View style={styles.grid}>
            {board.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((col, j) => {
                  return renderCell(i, j, animatedStyles[i][j]);
                })}
              </View>
            ))}
          </View>

          {/* Cage borders */}
          <Svg
            width={CELL_SIZE * BOARD_SIZE}
            height={CELL_SIZE * BOARD_SIZE}
            style={[styles.cageBordersSvg, { pointerEvents: 'none' }]}>
            {renderCageBorders()}
          </Svg>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    paddingVertical: 10,
    alignItems: 'center' as const,
  },
  gridWrapper: {
    width: CELL_SIZE * BOARD_SIZE,
    height: CELL_SIZE * BOARD_SIZE,
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'column' as const,
    width: '100%' as const,
    height: '100%' as const,
  },
  row: {
    flexDirection: 'row' as const,
  },
  cageBordersSvg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  cellWrapper: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'relative' as const,
  },
  selectedOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%' as const,
    height: '100%' as const,
    zIndex: 5,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    // borderWidth: 0.1,
    zIndex: 20,
  },
  relatedOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%' as const,
    height: '100%' as const,
    zIndex: 4,
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  notesContainerTop: {
    position: 'absolute' as const,
    left: 4,
    right: 4,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'flex-start' as const,
  },
  noteText: {
    top: 2,
    left: 3,
    fontSize: 8,
    width: 10,
  },
  cageText: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    fontSize: 9,
  },
});

export default React.memo(Grid);
