// screens/GameHistoryScreen/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import GameLogCard from '../../components/GameHistory/GameLogCard';
import { useTheme } from '../../context/ThemeContext';
import { useAppPause } from '../../hooks/useAppPause';
import { GameStatsManager } from '../../services/GameStatsManager';
import { PlayerService } from '../../services/PlayerService';
import { GameLogEntryV2 } from '../../types';

const GameHistoryScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [logs, setLogs] = useState<GameLogEntryV2[]>([]);

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  useAppPause(
    () => {},
    () => {
      loadData();
    },
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const player = await PlayerService.getCurrentPlayer();
    if (player && player?.id) {
      const _logs: GameLogEntryV2[] = await GameStatsManager.getLogsByPlayerId(
        player?.id,
      );

      const sortedLogs = _logs.sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
      setLogs(sortedLogs);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>
            {t('noGameHistory')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ backgroundColor: theme.background }}
        >
          {logs.map((log) => (
            <GameLogCard key={log.id} log={log} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default GameHistoryScreen;
