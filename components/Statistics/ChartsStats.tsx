// StatisticsScreen.tsx

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GameLogEntryV2, TimeFilter } from '../../types';
import { getChartConfig } from '../../utils/colorUtil';
import {
  convertToPieData,
  convertToStackedData,
  getDailyStatsFromLogs,
} from '../../utils/statsUtil';
import GameBarChart from './GameBarChart';
import GamePieChart from './GamePieChart';
import GameStackedBarChart from './GameStackedBarChart';
import TimeLineChart from './TimeLineChart';

type ChartsStatsProps = {
  logs: GameLogEntryV2[];
  filter: TimeFilter;
};

const ChartsStats = ({ logs, filter }: ChartsStatsProps) => {
  const { mode, theme } = useTheme();
  const { t } = useTranslation();
  const dailyStats = useMemo(
    () => getDailyStatsFromLogs(logs, filter),
    [logs, filter],
  );
  const levelCounts = useMemo(
    () => convertToPieData(logs, mode, t, filter),
    [logs, mode, t, filter],
  );
  const stackedData = useMemo(
    () => convertToStackedData(logs, mode, t, filter),
    [logs, mode, t, filter],
  );
  const chartConfig = useMemo(() => getChartConfig(mode), [mode]);

  return (
    <>
      {logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>
            {t('noDataAvailable')}
          </Text>
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: theme.background }}>
          <GameBarChart dailyStats={dailyStats} chartConfig={chartConfig} />
          <TimeLineChart dailyStats={dailyStats} chartConfig={chartConfig} />
          <GamePieChart levelCounts={levelCounts} chartConfig={chartConfig} />
          <GameStackedBarChart
            stackedData={stackedData}
            chartConfig={chartConfig}
          />
        </ScrollView>
      )}
    </>
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

export default ChartsStats;
