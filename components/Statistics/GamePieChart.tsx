import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {AbstractChartConfig} from 'react-native-chart-kit/dist/AbstractChart';
import {useTheme} from '../../context/ThemeContext';
import {DailyStatsPieData} from '../../types';
import EmptyContainer from '../commons/EmptyContainer';

type GamePieChartProps = {
  levelCounts: DailyStatsPieData[];
  chartConfig: AbstractChartConfig;
};

const GamePieChart = ({levelCounts, chartConfig}: GamePieChartProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {width: screenWidth} = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  if (levelCounts.length === 0) {
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
        <PieChart
          data={levelCounts}
          width={containerWidth}
          height={220}
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
