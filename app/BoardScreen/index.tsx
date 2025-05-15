import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Alert, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ActionButtons from '../../components/Board/ActionButtons';
import Grid from '../../components/Board/Grid';
import InfoPanel from '../../components/Board/InfoPanel';
import NumberPad from '../../components/Board/NumberPad';
import PauseModal from '../../components/Board/PauseModal';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {CORE_EVENTS} from '../../events';
import eventBus from '../../events/eventBus';
import {useAppPause} from '../../hooks/useAppPause';
import {useGameTimer} from '../../hooks/useGameTimer';
import {useMistakeCounter} from '../../hooks/useMistakeCounter';
import {BoardService} from '../../services/BoardService';
import {SettingsService} from '../../services/SettingsService';
import {
  AppSettings,
  BoardParamProps,
  BoardScreenRouteProp,
  Cage,
  Cell,
  CellValue,
  RootStackParamList,
  SavedGame,
} from '../../types';
import {
  checkBoardIsSolved,
  createEmptyGrid,
  createEmptyGridNotes,
  createEmptyGridNumber,
  deepCloneBoard,
  deepCloneNotes,
  removeNoteFromPeers,
} from '../../utils/boardUtil';
import {
  ANIMATION_CELL_KEY_SEPARATOR,
  ANIMATION_DURATION,
  ANIMATION_TYPE,
  BOARD_SIZE,
  DEFAULT_SETTINGS,
  MAX_MISTAKES,
  MAX_TIMEPLAYED,
  SCREENS,
} from '../../utils/constants';
import {formatTime} from '../../utils/dateUtil';

const BoardScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const route = useRoute<BoardScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {id, level, type} = route.params as BoardParamProps;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [initialBoard, setInitialBoard] = useState<CellValue[][]>(
    createEmptyGrid<CellValue>(),
  );
  const [cages, setCages] = useState<Cage[]>([]);
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(
    createEmptyGridNumber(),
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const handleCellPress = useCallback((cell: Cell | null) => {
    setSelectedCell(cell);
  }, []);
  // Xử lý animation khi nhập xong 1 hàng/cột
  const [animatedCells, setAnimatedCells] = useState<{[key: string]: number}>(
    {},
  );

  const [board, setBoard] = useState<CellValue[][]>(
    createEmptyGrid<CellValue>(),
  );
  const [history, setHistory] = useState<CellValue[][][]>([
    createEmptyGrid<CellValue>(),
  ]);
  const [notes, setNotes] = useState<string[][][]>(
    createEmptyGridNotes<string>(),
  );

  // Lấy initGame and savedGame
  // ===========================================================
  const handeGameStarted = async () => {
    if (type === 'init') {
      let initGame = await BoardService.loadInit();
      if (!initGame) {
        return;
      }
      setIsLoading(false);
      setInitialBoard(deepCloneBoard(initGame.initialBoard));
      setBoard(deepCloneBoard(initGame.initialBoard));
      setHistory([deepCloneBoard(initGame.initialBoard)]);
      setNotes(createEmptyGridNotes<string>());
      setCages(initGame.cages);
      setSolvedBoard(initGame.solvedBoard);
      setIsPlaying(true);
    } else {
      const initGame = await BoardService.loadInit();
      const savedGame = await BoardService.loadSaved();
      setIsLoading(false);

      if (initGame && savedGame) {
        setInitialBoard(deepCloneBoard(savedGame.savedBoard));
        setBoard(deepCloneBoard(savedGame.savedBoard));
        setHistory(savedGame.savedHistory);
        setNotes(savedGame.savedNotes);
        setCages(initGame.cages);
        setSolvedBoard(initGame.solvedBoard);
        setIsPlaying(true);
      }
    }
  };
  useEffect(() => {
    handeGameStarted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    eventBus.on(CORE_EVENTS.gameStarted, handeGameStarted);
    return () => eventBus.off(CORE_EVENTS.gameStarted, handeGameStarted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ===========================================================

  // Lấy settings
  // ===========================================================
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const savedSettingsRef = useRef<AppSettings>(null);
  useEffect(() => {
    SettingsService.load().then(data => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);
  useEffect(() => {
    const handeSettingUpdated = async (_settings: AppSettings) => {
      savedSettingsRef.current = _settings;
    };
    eventBus.on(CORE_EVENTS.settingsUpdated, handeSettingUpdated);
    return () => eventBus.off(CORE_EVENTS.settingsUpdated, handeSettingUpdated);
  }, []);
  // ===========================================================

  // Hiển thị số lần sai
  // ===========================================================
  const {mistakes, incrementMistake, resetMistakes} = useMistakeCounter({
    maxMistakes: MAX_MISTAKES,
    onLimitReached: async () => {
      // Gọi khi người chơi đã sai quá nhiều lần
      await handleResetGame();
      // Bạn có thể show modal thua hoặc reset game
      Alert.alert(
        t('mistakeWarning'),
        t('tooManyMistakes', {max: MAX_MISTAKES}),
        [
          {
            text: t('ok'),
            onPress: () => {
              // setIsPlaying(true);
              navigation.goBack();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
  });
  // ===========================================================

  // Hiển thị thời gian đã chơi
  // ===========================================================
  const {seconds, resetTimer} = useGameTimer(isPlaying, {
    maxTimePlayed: MAX_TIMEPLAYED,
    onLimitReached: async () => {
      await handleResetGame();
      Alert.alert(
        t('timeWarning'),
        t('playedLimit', {limit: formatTime(MAX_TIMEPLAYED)}),
        [
          {
            text: t('ok'),
            onPress: () => {
              // setIsPlaying(true);
              navigation.goBack();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
  });
  // ===========================================================

  const handleResetGame = async () => {
    await BoardService.clear();
    setIsPlaying(false);
    resetTimer();
    setIsPaused(false);
    setShowPauseModal(false);
    setSelectedCell(null);
    setNoteMode(false);
    setBoard(deepCloneBoard(initialBoard));
    setNotes(createEmptyGridNotes<string>());
    setHistory([]);
    resetMistakes();
  };
  // ===========================================================

  const handleBackPress = async () => {
    await BoardService.save({
      savedId: id,
      savedLevel: level,
      savedBoard: board,
      savedMistake: mistakes,
      savedTimePlayed: seconds,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    navigation.goBack();
  };

  const handleGoToSettings = async () => {
    await BoardService.save({
      savedId: id,
      savedLevel: level,
      savedBoard: board,
      savedMistake: mistakes,
      savedTimePlayed: seconds,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    setIsPaused(true);
    navigation.navigate(SCREENS.SETTINGS, {
      showAdvancedSettings: false,
    });
  };

  const handlePause = async () => {
    setIsPlaying(false);
    setIsPaused(true);
    setShowPauseModal(true);
    await BoardService.save({
      savedId: id,
      savedLevel: level,
      savedBoard: board,
      savedMistake: mistakes,
      savedTimePlayed: seconds,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
  };

  const handleResume = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const saveHistory = (newBoard: CellValue[][]) => {
    setHistory(prev => [...prev, deepCloneBoard(newBoard)]);
  };

  /**
   * Quay trở lại trạng thái board trước đó
   */
  const handleUndo = () => {
    if (history.length <= 1) {
      return;
    }

    const lastState = history[history.length - 2];
    setBoard(deepCloneBoard(lastState));
    setHistory(prev => prev.slice(0, -1));
  };

  /**
   * Xoá giá trị của ô đã chọn
   */
  const handleErase = () => {
    if (!selectedCell) {
      return;
    }
    const {row, col} = selectedCell;
    if (initialBoard[row][col]) {
      return;
    }
    if (board[row][col] === null || board[row][col] === 0) {
      return;
    }

    const newBoard = deepCloneBoard(board);
    newBoard[row][col] = null;
    setBoard(newBoard);
    const newNotes = deepCloneNotes(notes);
    newNotes[row][col] = [];
    setNotes(newNotes);
    saveHistory(newBoard);
    setSelectedCell({...selectedCell, value: null});
  };

  const handleHint = () => {
    if (!selectedCell) {
      return;
    }
    const {row, col} = selectedCell;
    if (initialBoard[row][col] != null) {
      return;
    }
    const solvedNum = solvedBoard[row][col];
    const newBoard = deepCloneBoard(board);
    newBoard[row][col] = solvedNum;
    setBoard(newBoard);
    saveHistory(newBoard);
    setNotes(prevNotes => removeNoteFromPeers(prevNotes, row, col, solvedNum));
    handleCheckSolved(newBoard);
  };

  /**
   * Kiểm tra board đã được giải quyết chưa
   */
  const handleSolve = () => {
    Alert.alert(t('solution'), t('allDone'), [{text: t('ok')}], {
      cancelable: false,
    });

    const clonedSolved = deepCloneBoard(solvedBoard);
    setSelectedCell(null);
    setBoard(clonedSolved);
    saveHistory(clonedSolved);
    setNotes(createEmptyGridNotes<string>());
    // handleCheckSolved(solvedBoard);
  };

  /**
   * Điền số vào ô đã chọn
   * @param num Số
   */
  const handleNumberPress = (num: number) => {
    if (!selectedCell) {
      return;
    }
    const {row, col} = selectedCell;
    if (initialBoard[row][col] != null) {
      return;
    }

    if (noteMode) {
      const newNotes = deepCloneNotes(notes);
      const cellNotes = newNotes[row][col];
      if (cellNotes.includes(num.toString())) {
        newNotes[row][col] = cellNotes.filter(n => n !== num.toString());
      } else {
        newNotes[row][col] = [...cellNotes, num.toString()].sort();
      }
      setNotes(newNotes);
    } else {
      const correctValue = solvedBoard[row][col];
      const newBoard = deepCloneBoard(board);
      newBoard[row][col] = num;
      setBoard(newBoard);
      saveHistory(newBoard);
      setSelectedCell({...selectedCell, value: num});

      if (settings.autoRemoveNotes) {
        setNotes(prevNotes => removeNoteFromPeers(prevNotes, row, col, num));
      }

      if (settings.mistakeLimit && num !== correctValue) {
        incrementMistake();
        return;
      }

      handleCheckRowOrColResolved(row, col, newBoard);
      handleCheckSolved(newBoard);
    }
  };

  const isRowFilled = (row: number, newBoard: CellValue[][]): boolean => {
    if (!newBoard[row]) {
      return false;
    } // Nếu dòng không tồn tại, coi như chưa filled
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!newBoard[row][col]) {
        return false; // Nếu có ô nào trong dòng là 0, coi như chưa filled
      }
    }
    return true; // Nếu tất cả ô trong dòng đều khác 0, coi như đã filled
  };

  const isColFilled = (col: number, newBoard: CellValue[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (!newBoard[row][col]) {
        return false; // Nếu có ô nào trong cột là 0, coi như chưa filled
      }
    }
    return true; // Nếu tất cả ô trong cột đều khác 0, coi như đã filled
  };

  const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleCheckRowOrColResolved = (
    row: number,
    col: number,
    newBoard: CellValue[][],
  ) => {
    const key = `${row}${ANIMATION_CELL_KEY_SEPARATOR}${col}`;

    let animationType = ANIMATION_TYPE.NONE as number;
    if (isRowFilled(row, newBoard) && isColFilled(col, newBoard)) {
      animationType = ANIMATION_TYPE.ROW_COL;
    } else if (isRowFilled(row, newBoard)) {
      animationType = ANIMATION_TYPE.ROW;
    } else if (isColFilled(col, newBoard)) {
      animationType = ANIMATION_TYPE.COL;
    }

    // Clear timeout cũ nếu có
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
    }
    // Set lại animation
    setAnimatedCells(prev => ({...prev, [key]: animationType}));
    // Tạo timeout mới
    timeoutRefs.current[key] = setTimeout(() => {
      setAnimatedCells(prev => {
        const updated = {...prev};
        delete updated[key];
        return updated;
      });
      delete timeoutRefs.current[key]; // Xóa timeoutRef sau khi done
    }, ANIMATION_DURATION);
  };

  const handleCheckSolved = (newBoard: CellValue[][]) => {
    if (checkBoardIsSolved(newBoard, solvedBoard)) {
      setIsPlaying(false);
      setIsPaused(true);

      Alert.alert(
        t('done'),
        t('congratulations'),
        [
          {
            text: t('backToMain'),
            onPress: async () => {
              eventBus.emit(CORE_EVENTS.gameEnded, {
                id: id,
                level: level,
                timePlayed: seconds,
                mistakes: mistakes,
              });
              await BoardService.clear();
              navigation.goBack();
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  useAppPause(
    () => {
      if (!isPaused) {
        setTimeout(async () => {
          try {
            await handlePause();
          } catch (error) {
            console.error('AppStateChange:', error);
          }
        }, 100);
      }
    },
    () => {
      setIsPaused(true);
      setShowPauseModal(true);
    },
  );

  useFocusEffect(
    useCallback(() => {
      setIsPlaying(true);
      setIsPaused(false);
      if (savedSettingsRef.current) {
        setSettings(savedSettingsRef.current);
      }
    }, []),
  );

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.loadingContainer, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('appName')}
        showBack={true}
        showSettings={true}
        showTheme={true}
        onBack={handleBackPress}
        onSettings={handleGoToSettings}
      />
      <InfoPanel
        level={level}
        mistakes={mistakes}
        time={seconds}
        isPaused={isPaused}
        settings={settings}
        onPause={handlePause}
      />
      <Grid
        board={board}
        cages={cages}
        notes={notes}
        solvedBoard={solvedBoard}
        selectedCell={selectedCell}
        settings={settings}
        onPress={handleCellPress}
        animatedCells={animatedCells}
      />
      <ActionButtons
        noteMode={noteMode}
        onNote={setNoteMode}
        onUndo={handleUndo}
        onErase={handleErase}
        onHint={handleHint}
        onSolve={handleSolve}
      />
      <NumberPad
        board={board}
        settings={settings}
        onSelectNumber={handleNumberPress}
      />
      {showPauseModal && (
        <PauseModal
          level={level}
          mistake={mistakes}
          time={seconds}
          onResume={handleResume}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BoardScreen;
