// StatisticsScreen.tsx

import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import ChartsStats from '../../components/Statistics/ChartsStats';
import LevelStats from '../../components/Statistics/LevelStats';
import TimeFilterDropdown from '../../components/Statistics/TimeFilterDropdown';
import {useTheme} from '../../context/ThemeContext';
import {useAppPause} from '../../hooks/useAppPause';
import {useEnsureStatsCache} from '../../hooks/useEnsureStatsCache';
import {GameStatsManager} from '../../services/GameStatsManager';
import {PlayerService} from '../../services/PlayerService';
import {
  GameLogEntryV2,
  GameStats,
  Level,
  RootStackParamList,
  StatsTab,
  TimeFilter,
} from '../../types';
import {DEFAULT_PLAYER_ID, SCREENS} from '../../utils/constants';
import GameHistoryScreen from '../GameHistoryScreen';

const StatisticsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [stats, setStats] = useState<Record<Level, GameStats> | null>(null);
  const [logs, setLogs] = useState<GameLogEntryV2[]>([]);
  const [activeTab, setActiveTab] = useState<StatsTab['key']>('level');

  const [filter, setFilter] = useState<TimeFilter>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  const statsTabs: StatsTab[] = [
    {
      key: 'level',
      label: t('levelStats'),
      testID: 'LevelStatsTabButton',
    },
    {
      key: 'chart',
      label: t('chartsStats'),
      testID: 'ChartsStatsTabButton',
    },
    {
      key: 'history',
      label: t('gameHistoryTitle'),
      testID: 'GameHistoryTabButton',
    },
  ];

  const {updateStatsCache} = useEnsureStatsCache();

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

  const renderTabContent: Record<string, React.ReactNode> = {
    level: <LevelStats stats={stats} />,
    chart: <ChartsStats logs={logs} filter={filter} />,
    history: <GameHistoryScreen />,
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
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
            style={styles.iconButton}>
            <Ionicons name="filter" size={24} color={theme.primary} />
          </TouchableOpacity>
        }
      />
      {/* Tab Chip Selector */}
      <View style={styles.tabRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}>
          {statsTabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                testID={tab.testID}
                accessibilityLabel={tab.testID}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive
                      ? theme.primary
                      : theme.settingItemBackground,
                  },
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isActive ? theme.text : theme.secondary,
                    },
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderTabContent[activeTab]}</View>

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
    paddingHorizontal: 8,
    gap: 4,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
