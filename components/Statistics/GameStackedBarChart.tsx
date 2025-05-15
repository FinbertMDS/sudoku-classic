import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {StackedBarChart} from 'react-native-chart-kit';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import {useTheme} from '../../context/ThemeContext';
import {DailyStatsStackedData} from '../../types';
import {CHART2_WIDTH} from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

type GameStackedBarChartProps = {
  stackedData: DailyStatsStackedData | null;
  chartConfig: AbstractChartConfig;
};

const GameStackedBarChart = ({
  stackedData,
  chartConfig,
}: GameStackedBarChartProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  if (!stackedData) {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={[styles.title, {color: theme.text}]}>
          {t('gamesDistributionByLevel')}
        </Text>
        <Text style={[{color: theme.text}]}>{t('noDataAvailable')}</Text>
      </View>
    );
  }
  const chartWidth = Math.max(
    stackedData.labels.length * CHART2_WIDTH,
    screenWidth,
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.title, {color: theme.text}]}>
        {t('gamesDistributionByLevel')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <StackedBarChart
          data={stackedData}
          width={chartWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
          }}
          style={styles.chart}
          hideLegend={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  chart: {
    borderRadius: 12,
  },
});

export default GameStackedBarChart;
