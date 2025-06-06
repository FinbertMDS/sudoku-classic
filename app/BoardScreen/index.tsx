import { useAlert } from '@/hooks/useAlert';
import { useSafeGoBack } from '@/hooks/useSafeGoBack';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButtons from '../../components/Board/ActionButtons';
import { BannerAdSafe } from '../../components/Board/BannerAdSafe';
import Grid from '../../components/Board/Grid';
import InfoPanel from '../../components/Board/InfoPanel';
import NumberPad from '../../components/Board/NumberPad';
import PauseModal from '../../components/Board/PauseModal';
import ConfirmDialog from '../../components/commons/ConfirmDialog';
import Header from '../../components/commons/Header';
import HowToPlay from '../../components/HowToPlay';
import { useTheme } from '../../context/ThemeContext';
import { CORE_EVENTS } from '../../events';
import eventBus from '../../events/eventBus';
import { GameEndedCoreEvent } from '../../events/types';
import { useAppPause } from '../../hooks/useAppPause';
import { useHintCounter } from '../../hooks/useHintCounter';
import { useMistakeCounter } from '../../hooks/useMistakeCounter';
import { useRewardedAdSafe } from '../../hooks/useRewardedAdSafe';
import { BoardService } from '../../services/BoardService';
import { SettingsService } from '../../services/SettingsService';
import {
  AppSettings,
  BoardParamProps,
  Cell,
  CellValue,
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
  DEFAULT_SETTINGS,
  MAX_HINTS,
  MAX_MISTAKES,
} from '../../utils/constants';
import { getAdUnit } from '../../utils/getAdUnit';

const BoardScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const rawParams = useLocalSearchParams();
  const { id, level, type } = useMemo(() => {
    return {
      id: rawParams.id,
      level: rawParams.level,
      type: rawParams.type,
    } as BoardParamProps;
  }, [rawParams]);

  const goBack = useSafeGoBack();
  const { alert } = useAlert();

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [initialBoard, setInitialBoard] =
    useState<CellValue[][]>(createEmptyGrid<CellValue>());
  const [solvedBoard, setSolvedBoard] = useState<number[][]>(
    createEmptyGridNumber(),
  );
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const handleCellPress = useCallback((cell: Cell | null) => {
    setSelectedCell(cell);
  }, []);

  const [board, setBoard] =
    useState<CellValue[][]>(createEmptyGrid<CellValue>());
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
      setSolvedBoard(initGame.solvedBoard);
      setScore(initGame.savedScore);
      setIsPlaying(true);
    } else {
      const initGame = await BoardService.loadInit();
      const savedGame = await BoardService.loadSaved();
      setIsLoading(false);

      if (initGame && savedGame) {
        setInitialBoard(deepCloneBoard(initGame.initialBoard));
        setBoard(deepCloneBoard(savedGame.savedBoard));
        setHistory(savedGame.savedHistory);
        setNotes(savedGame.savedNotes);
        setSolvedBoard(initGame.solvedBoard);
        setScore(savedGame.savedScore);
        setIsPlaying(true);
      }
    }
  };
  const handleAfterCheckHasPlayed = () => {
    SettingsService.setHasPlayed(true);
    setShowHowToPlay(false);
    handeGameStarted();
  };

  useEffect(() => {
    SettingsService.getHasPlayed().then((hasPlayed) => {
      if (!hasPlayed) {
        setShowHowToPlay(true);
      } else {
        handleAfterCheckHasPlayed();
      }
    });
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
    SettingsService.load().then((data) => {
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

  // Hiển thị rewarded ad và xử lý khi đóng ad
  // ===========================================================
  const {
    isLoaded: isLoadedRewarded,
    isClosed: isClosedRewarded,
    load: loadRewarded,
    show: showRewarded,
  } = useRewardedAdSafe(getAdUnit('rewarded'));
  useEffect(() => {
    loadRewarded();
  }, [loadRewarded]);
  useEffect(() => {
    if (Platform.OS !== 'web' && isClosedRewarded) {
      setIsPlaying(true);
      setIsPaused(false);
      if (limitMistakeReached) {
        resetMistakes();
      } else if (limitHintReached) {
        resetHintCount();
      }
      loadRewarded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosedRewarded]);
  const {
    totalMistakes,
    mistakes,
    limitMistakeReached,
    incrementMistake,
    resetMistakes,
  } = useMistakeCounter({
    maxMistakes: MAX_MISTAKES,
    onLimitReached: () => {
      setIsPlaying(false);
      setIsPaused(true);
    },
  });
  const {
    totalHintCountUsed,
    hintCount,
    limitHintReached,
    decrementHintCount,
    resetHintCount,
    changeLimitHintReached,
  } = useHintCounter({
    maxHintCount: MAX_HINTS,
    onLimitReached: () => {
      setIsPlaying(false);
      setIsPaused(true);
    },
  });

  const handleLimitMistakeReached = async () => {
    await handleResetGame();
    goBack();
  };

  const handleLimitHintReached = (_isPlaying: boolean = false) => {
    if (!_isPlaying) {
      setIsPlaying(false);
      setIsPaused(true);
      changeLimitHintReached(true);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      changeLimitHintReached(false);
    }
  };

  const handleWatchAdToContinue = (typeAd: 'mistake' | 'hint') => {
    if (isLoadedRewarded) {
      showRewarded();
    } else {
      if (typeAd === 'mistake') {
        handleLimitMistakeReached();
      } else {
        handleLimitHintReached(true);
      }
    }
  };
  // ===========================================================

  // Hiển thị thời gian đã chơi
  // ===========================================================
  const secondsRef = useRef(0);
  const handleLimitTimeReached = async () => {
    await handleResetGame();
    goBack();
  };
  // ===========================================================

  const handleResetGame = async () => {
    await BoardService.clear();
    setIsPlaying(false);
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
      savedScore: score,
      savedBoard: board,
      savedHintCount: hintCount,
      savedTotalHintCountUsed: totalHintCountUsed,
      savedMistake: mistakes,
      savedTotalMistake: totalMistakes,
      savedTimePlayed: secondsRef.current,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    goBack();
  };

  const handleGoToSettings = async () => {
    await BoardService.save({
      savedId: id,
      savedLevel: level,
      savedScore: score,
      savedBoard: board,
      savedHintCount: hintCount,
      savedTotalHintCountUsed: totalHintCountUsed,
      savedMistake: mistakes,
      savedTotalMistake: totalMistakes,
      savedTimePlayed: secondsRef.current,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    setIsPaused(true);
    router.push({
      pathname: '/SettingsScreen',
      params: { showAdvancedSettings: '0' },
    });
  };

  const handlePause = async () => {
    setIsPlaying(false);
    setIsPaused(true);
    setShowPauseModal(true);
    await BoardService.save({
      savedId: id,
      savedLevel: level,
      savedScore: score,
      savedBoard: board,
      savedHintCount: hintCount,
      savedTotalHintCountUsed: totalHintCountUsed,
      savedMistake: mistakes,
      savedTotalMistake: totalMistakes,
      savedTimePlayed: secondsRef.current,
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
    setHistory((prev) => [...prev, deepCloneBoard(newBoard)]);
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
    setHistory((prev) => prev.slice(0, -1));
  };

  /**
   * Xoá giá trị của ô đã chọn
   */
  const handleErase = () => {
    if (!selectedCell) {
      return;
    }
    const { row, col } = selectedCell;
    if (initialBoard[row][col]) {
      return;
    }
    const newNotes = deepCloneNotes(notes);
    newNotes[row][col] = [];
    setNotes(newNotes);
    if (board[row][col] === null || board[row][col] === 0) {
      return;
    }
    const newBoard = deepCloneBoard(board);
    newBoard[row][col] = null;
    setSelectedCell({ ...selectedCell, value: null });
    setBoard(newBoard);
    saveHistory(newBoard);
  };

  const handleCheckSolved = (_totalHintCountUsed: number) => {
    setIsPlaying(false);
    setIsPaused(true);

    alert(
      t('done'),
      t('congratulations'),
      [
        {
          text: t('backToMain'),
          onPress: async () => {
            eventBus.emit(CORE_EVENTS.gameEnded, {
              id: id,
              level: level,
              timePlayed: secondsRef.current,
              mistakes: totalMistakes,
              hintCount: _totalHintCountUsed,
            } as GameEndedCoreEvent);
            await BoardService.clear();
            goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleHint = () => {
    if (!selectedCell) {
      return;
    }
    const { row, col } = selectedCell;
    if (
      initialBoard[row][col] != null ||
      board[row][col] === solvedBoard[row][col]
    ) {
      return;
    }
    if (hintCount <= 0) {
      handleLimitHintReached(false);
      return;
    }
    decrementHintCount();
    const solvedNum = solvedBoard[row][col];
    const newBoard = deepCloneBoard(board);
    newBoard[row][col] = solvedNum;
    setSelectedCell({ ...selectedCell, value: solvedNum });
    setBoard(newBoard);
    setNotes((prevNotes) =>
      removeNoteFromPeers(prevNotes, row, col, solvedNum),
    );

    if (checkBoardIsSolved(newBoard, solvedBoard)) {
      handleCheckSolved(totalHintCountUsed + 1);
    }
    saveHistory(newBoard);
  };

  /**
   * Kiểm tra board đã được giải quyết chưa
   */
  const handleSolve = () => {
    alert(t('solution'), t('allDone'), [{ text: t('ok') }], {
      cancelable: false,
    });

    const clonedSolved = deepCloneBoard(solvedBoard);
    setSelectedCell(null);
    setBoard(clonedSolved);
    setNotes(createEmptyGridNotes<string>());
    // handleCheckSolved(solvedBoard);
    saveHistory(clonedSolved);
  };

  /**
   * Điền số vào ô đã chọn
   * @param num Số
   */
  const handleNumberPress = (num: number) => {
    if (!selectedCell) {
      return;
    }
    const { row, col } = selectedCell;
    if (initialBoard[row][col] != null) {
      return;
    }

    if (noteMode) {
      const newNotes = deepCloneNotes(notes);
      const cellNotes = newNotes[row][col];
      if (cellNotes.includes(num.toString())) {
        newNotes[row][col] = cellNotes.filter((n) => n !== num.toString());
      } else {
        newNotes[row][col] = [...cellNotes, num.toString()].sort();
      }
      setNotes(newNotes);
    } else {
      const currentValue = board[row][col];
      if (currentValue === num) {
        return;
      }
      const correctValue = solvedBoard[row][col];
      if (settings.mistakeLimit && num !== correctValue) {
        if (mistakes >= MAX_MISTAKES) {
          return;
        } else {
          incrementMistake();
        }
      }
      const newBoard = deepCloneBoard(board);
      newBoard[row][col] = num;
      setBoard(newBoard);
      setSelectedCell({ ...selectedCell, value: num });

      if (settings.autoRemoveNotes) {
        setNotes((prevNotes) => removeNoteFromPeers(prevNotes, row, col, num));
      }

      if (checkBoardIsSolved(newBoard, solvedBoard)) {
        handleCheckSolved(totalHintCountUsed);
      }
      saveHistory(newBoard);
    }
  };

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRefs.current).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

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
      if (!isPaused) {
        setIsPaused(true);
        setShowPauseModal(true);
      }
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

  useEffect(() => {
    if (limitMistakeReached && !isLoadedRewarded && !isClosedRewarded) {
      Alert.alert(
        t('mistakeWarning.title'),
        t('mistakeWarning.messageNotAd', { max: MAX_MISTAKES }),
        [
          {
            text: t('ok'),
            onPress: () => {
              handleLimitMistakeReached();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitMistakeReached, isLoadedRewarded]);

  useEffect(() => {
    if (limitHintReached && !isLoadedRewarded && !isClosedRewarded) {
      Alert.alert(
        t('hintWarning.title'),
        t('hintWarning.messageNotAd'),
        [
          {
            text: t('ok'),
            onPress: () => {
              handleLimitHintReached(true);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitHintReached, isLoadedRewarded]);

  if (showHowToPlay) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Header
          title={t('appName')}
          showBack={true}
          showSettings={false}
          showTheme={false}
        />
        <HowToPlay onClose={handleAfterCheckHasPlayed} />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Header
          title={t('appName')}
          showBack={true}
          showSettings={true}
          showTheme={true}
          onBack={handleBackPress}
          onSettings={handleGoToSettings}
        />
        <InfoPanel
          isPlaying={isPlaying}
          level={level}
          mistakes={mistakes}
          score={score}
          secondsRef={secondsRef}
          isPaused={isPaused}
          settings={settings}
          onPause={handlePause}
          onLimitTimeReached={handleLimitTimeReached}
        />
        <Grid
          board={board}
          notes={notes}
          solvedBoard={solvedBoard}
          selectedCell={selectedCell}
          settings={settings}
          onPress={handleCellPress}
        />
        <ActionButtons
          noteMode={noteMode}
          hintCount={hintCount}
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
        <BannerAdSafe />
      </SafeAreaView>
      {showPauseModal && (
        <PauseModal
          level={level}
          mistake={mistakes}
          time={secondsRef.current}
          settings={settings}
          onResume={() => handleResume()}
        />
      )}
      {limitMistakeReached && isLoadedRewarded && (
        <ConfirmDialog
          title={t('mistakeWarning.title')}
          message={t('mistakeWarning.message', { max: MAX_MISTAKES })}
          cancelText={t('ad.cancel')}
          confirmText={t('ad.confirm')}
          onCancel={() => {
            handleLimitMistakeReached();
          }}
          onConfirm={() => {
            handleWatchAdToContinue('mistake');
          }}
        />
      )}
      {limitHintReached && isLoadedRewarded && (
        <ConfirmDialog
          title={t('hintWarning.title')}
          message={t('hintWarning.message', { max: MAX_HINTS })}
          cancelText={t('ad.cancel')}
          confirmText={t('ad.confirm')}
          onCancel={() => {
            handleLimitHintReached(true);
          }}
          onConfirm={() => {
            handleWatchAdToContinue('hint');
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
});

export default BoardScreen;
