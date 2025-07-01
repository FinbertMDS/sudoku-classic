import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {StackedBarChart} from 'react-native-chart-kit';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import {useTheme} from '../../context/ThemeContext';
import {DailyStatsStackedData} from '../../types';
import {CHART2_WIDTH} from '../../utils/constants';
import EmptyContainer from '../commons/EmptyContainer';

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
  const {width: screenWidth} = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  if (!stackedData || stackedData.data.length === 0) {
    return <EmptyContainer text={t('gamesDistributionByLevel')} />;
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.background}]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <Text style={[styles.title, {color: theme.text}]}>
        {t('gamesDistributionByLevel')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <StackedBarChart
          data={stackedData}
          width={Math.max(
            stackedData.labels.length * CHART2_WIDTH,
            containerWidth,
          )}
          height={250}
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.7,
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

export default GameStackedBarChart;
