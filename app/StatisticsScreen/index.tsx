// StatisticsScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import ChartsStats from '../../components/Statistics/ChartsStats';
import LevelStats from '../../components/Statistics/LevelStats';
import TimeFilterDropdown from '../../components/Statistics/TimeFilterDropdown';
import { useTheme } from '../../context/ThemeContext';
import { useAppPause } from '../../hooks/useAppPause';
import { useEnsureStatsCache } from '../../hooks/useEnsureStatsCache';
import { GameStatsManager } from '../../services/GameStatsManager';
import { PlayerService } from '../../services/PlayerService';
import {
  GameLogEntryV2,
  GameStats,
  Level,
  RootStackParamList,
  TimeFilter,
} from '../../types';
import { DEFAULT_PLAYER_ID, SCREENS } from '../../utils/constants';

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState<Record<Level, GameStats> | null>(null);
  const [logs, setLogs] = useState<GameLogEntryV2[]>([]);
  const [activeTab, setActiveTab] = useState<'level' | 'chart'>('level');

  const [filter, setFilter] = useState<TimeFilter>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  const { updateStatsCache } = useEnsureStatsCache();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      updateStatsCache().then((_) => {
        loadData();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]),
  );

  useAppPause(
    () => {},
    () => {
      updateStatsCache().then((_) => {
        loadData();
      });
    },
  );

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadData() {
    const player = await PlayerService.getCurrentPlayer();
    const loadedLogs = await GameStatsManager.getLogsByPlayerId(
      player?.id ?? DEFAULT_PLAYER_ID,
    );
    setLogs(loadedLogs);
    const loadedStats = await GameStatsManager.getStatsWithCache(
      loadedLogs,
      filter,
      player?.id ?? DEFAULT_PLAYER_ID,
    );
    setStats(loadedStats);
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Header
        title={t('statistics')}
        showBack={false}
        showSettings={true}
        showTheme={true}
        showSwitchPlayer={true}
        onSwitchPlayer={() => {
          navigation.navigate(SCREENS.PLAYERS as any);
        }}
        showCustom={true}
        customIconCount={1}
        custom={
          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            style={styles.iconButton}
          >
            <Ionicons name="filter" size={24} color={theme.primary} />
          </TouchableOpacity>
        }
      />
      {/* Tab Chip Selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          testID="LevelStatsTabButton"
          accessibilityLabel="LevelStatsTabButton"
          onPress={() => setActiveTab('level')}
          style={[
            styles.chip,
            {
              backgroundColor:
                activeTab === 'level'
                  ? theme.primary
                  : theme.settingItemBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              { color: activeTab === 'level' ? theme.text : theme.secondary },
            ]}
          >
            {t('levelStats')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="ChartsStatsTabButton"
          accessibilityLabel="ChartsStatsTabButton"
          onPress={() => setActiveTab('chart')}
          style={[
            styles.chip,
            {
              backgroundColor:
                activeTab === 'chart'
                  ? theme.primary
                  : theme.settingItemBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              { color: activeTab === 'chart' ? theme.text : theme.secondary },
            ]}
          >
            {t('chartsStats')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'level' ? (
          <LevelStats stats={stats} />
        ) : (
          <ChartsStats logs={logs} filter={filter} />
        )}
      </View>

      {showDropdown && (
        <TimeFilterDropdown
          selected={filter}
          onSelect={(newFilter) => {
            setFilter(newFilter);
            setShowDropdown(false);
          }}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    width: 30,
    paddingHorizontal: 3,
  },
  tabRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  chipText: {
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
});

export default StatisticsScreen;
