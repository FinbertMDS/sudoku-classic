// StatisticsScreen.tsx

import * as Device from 'expo-device';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GameStats, Level } from '../../types';
import { getLevelColor } from '../../utils/colorUtil';
import { LEVELS } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

let SCREEN_WIDTH = Dimensions.get('window').width;
if (Device.deviceType === Device.DeviceType.TABLET) {
  SCREEN_WIDTH = Math.min(SCREEN_WIDTH, Dimensions.get('window').height);
}

type LevelStatsProps = {
  stats: Record<Level, GameStats> | null;
};

const LevelStats = ({ stats }: LevelStatsProps) => {
  const { mode, theme } = useTheme();
  const { t } = useTranslation();

  if (!stats) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.title}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.cardsContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView style={{ backgroundColor: theme.background }}>
        {LEVELS.map((level) => (
          <View
            key={level}
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderLeftColor: getLevelColor(level, mode),
              },
            ]}
          >
            <Text style={[styles.level, { color: theme.text }]}>
              {t(`level.${level}`)}
            </Text>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>
                {t('gamesStarted')}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {stats[level].gamesStarted}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>
                {t('gamesCompleted')}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {stats[level].gamesCompleted}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>
                {t('bestTime')}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {formatTime(stats[level].bestTimeSeconds)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>
                {t('averageTime')}
              </Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {formatTime(stats[level].averageTimeSeconds)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    marginBottom: 20,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: 20,
  },
  card: {
    width: SCREEN_WIDTH - 100,
    maxWidth: SCREEN_WIDTH - 100,
    padding: 8,
    marginBottom: 16,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  level: {
    fontSize: 20 as const,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});

export default LevelStats;
