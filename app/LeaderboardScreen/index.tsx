// src/screens/LeaderboardScreen.tsx
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
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
import LoadingContainer from '../../components/commons/LoadingContainer';
import PlayerRanking from '../../components/Leaderboard/PlayerRanking';
import {useTheme} from '../../context/ThemeContext';
import {useAppPause} from '../../hooks/useAppPause';
import {LeaderboardService} from '../../services';
import {LeaderboardTab, PlayerStats} from '../../types';

const LeaderboardScreen = () => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [activeTab, setActiveTab] = useState<LeaderboardTab['key']>('player');
  // const [logs, setLogs] = useState<GameLogEntryV2[]>([]);
  // const [players, setPlayers] = useState<PlayerProfile[]>([]);

  const leaderboardTabs: LeaderboardTab[] = [
    // PlayerRanking
    {
      key: 'player',
      label: t('playerLeaderboard'),
      testID: 'PlayerLeaderboardTabButton',
    },
    // // LevelRanking
    // {
    //   key: 'level',
    //   label: t('levelLeaderboard'),
    //   testID: 'LevelLeaderboardTabButton',
    // },
    // // PerformanceRanking
    // {
    //   key: 'performance',
    //   label: t('performanceLeaderboard'),
    //   testID: 'PerformanceLeaderboardTabButton',
    // },
    // // CompletionRanking
    // {
    //   key: 'completion',
    //   label: t('completionLeaderboard'),
    //   testID: 'CompletionLeaderboardTabButton',
    // },
    // // TimeRanking
    // {
    //   key: 'time',
    //   label: t('timeLeaderboard'),
    //   testID: 'TimeLeaderboardTabButton',
    // },
    // // StreakRanking
    // {
    //   key: 'streak',
    //   label: t('streakLeaderboard'),
    //   testID: 'StreakLeaderboardTabButton',
    // },
  ];

  const loadLeaderboardStats = async () => {
    try {
      setIsLoading(true);

      const _playerStats = await LeaderboardService.getAllPlayerStats(t);
      setPlayerStats(_playerStats);

      // const _logs = await StatsService.getLogs();
      // setLogs(_logs);

      // const _players = await PlayerService.getAllPlayers();
      // setPlayers(_players);
    } catch (error) {
      console.error('Failed to load leaderboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      loadLeaderboardStats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useAppPause(
    () => {},
    () => {
      loadLeaderboardStats();
    },
  );

  const renderTabContent: Record<string, React.ReactNode> = {
    player: <PlayerRanking playerStats={playerStats} />,
    // level: <LevelRanking logs={logs} players={players} />,
    // performance: <PerformanceRanking />,
    // completion: <CompletionRanking />,
    // time: <TimeRanking />,
    // streak: <StreakRanking />,
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('leaderboard')}
        showBack={false}
        showSettings={true}
        showTheme={true}
        showSwitchPlayer={false}
        showCustom={false}
      />

      {/* Tab Chip Selector */}
      <View style={styles.tabRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}>
          {leaderboardTabs.map(tab => {
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
      <View style={styles.content}>
        {isLoading ? <LoadingContainer /> : renderTabContent[activeTab]}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default LeaderboardScreen;
