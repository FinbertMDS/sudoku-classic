import * as Device from 'expo-device';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats } from '../../types';
import { CHART_WIDTH } from '../../utils/constants';
import { formatShortChartDate } from '../../utils/dateUtil';

let screenWidth = Dimensions.get('window').width;
if (Device.deviceType === Device.DeviceType.TABLET) {
  screenWidth = Math.min(screenWidth, Dimensions.get('window').height);
}

type TimeLineChartProps = {
  dailyStats: DailyStats[];
  chartConfig: AbstractChartConfig;
};

const TimeLineChart = ({ dailyStats, chartConfig }: TimeLineChartProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (dailyStats.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('timesPerDay')}
        </Text>
        <Text style={[{ color: theme.text }]}>{t('noDataAvailable')}</Text>
      </View>
    );
  }

  const labels = dailyStats.map((s) => formatShortChartDate(s.date));
  const timeData = dailyStats.map((s) => Math.floor(s.totalTimeSeconds / 60)); // phút
  const chartWidth = Math.max(dailyStats.length * CHART_WIDTH, screenWidth);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t('timesPerDay')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: timeData }],
          }}
          width={chartWidth}
          height={220}
          fromZero
          chartConfig={{
            ...chartConfig,
          }}
          yLabelsOffset={32}
          style={styles.chart}
          bezier
          renderDotContent={({ x, y, index }) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  top: y - 16,
                  left: x - 15,
                },
              ]}
            >
              <Text style={[styles.dotText, { color: theme.secondary }]}>
                {timeData[index]}
              </Text>
            </View>
          )}
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
  dot: {
    position: 'absolute',
    width: 30,
    alignItems: 'center',
  },
  dotText: {
    fontSize: 12,
  },
});

export default TimeLineChart;
