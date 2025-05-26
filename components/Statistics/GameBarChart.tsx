import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats } from '../../types';
import { CHART_WIDTH } from '../../utils/constants';
import { formatShortChartDate } from '../../utils/dateUtil';

const screenWidth = Dimensions.get('window').width;

type GameBarChartProps = {
  dailyStats: DailyStats[];
  chartConfig: AbstractChartConfig;
};

const GameBarChart = ({ dailyStats, chartConfig }: GameBarChartProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (dailyStats.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('gamesPerDay')}
        </Text>
        <Text style={[{ color: theme.text }]}>{t('noDataAvailable')}</Text>
      </View>
    );
  }

  const labels = dailyStats.map((s) => formatShortChartDate(s.date));
  const data = dailyStats.map((s) => s.games);
  const chartWidth = Math.max(dailyStats.length * CHART_WIDTH, screenWidth);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t('gamesPerDay')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={chartWidth}
          height={220}
          fromZero
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel={''}
          yAxisSuffix={''}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  chart: {
    borderRadius: 12,
  },
});

export default GameBarChart;
