import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStatsPieData } from '../../types';

const screenWidth = Dimensions.get('window').width;

type GamePieChartProps = {
  levelCounts: DailyStatsPieData[];
  chartConfig: AbstractChartConfig;
};

const GamePieChart = ({ levelCounts, chartConfig }: GamePieChartProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (levelCounts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('gamesDistributionByLevel')}
        </Text>
        <Text style={[{ color: theme.text }]}>{t('noDataAvailable')}</Text>
      </View>
    );
  }

  const chartWidth = screenWidth - 32;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t('gamesDistributionByLevel')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <PieChart
          data={levelCounts}
          width={chartWidth}
          height={300}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="0"
          chartConfig={chartConfig}
          style={styles.chart}
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
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  chart: {
    borderRadius: 12,
  },
});

export default GamePieChart;
