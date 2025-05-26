import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ChartsStatsNotice = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { utcOffset, offset } = useMemo(() => {
    const offsetMinutes = new Date().getTimezoneOffset(); // ví dụ: -420
    const offsetInHours = -offsetMinutes / 60; // => +7
    const updateHourUtc =
      offsetInHours >= 0 ? offsetInHours : 24 + offsetInHours;
    return {
      utcOffset: offsetInHours >= 0 ? `+${offsetInHours}` : `${offsetInHours}`,
      offset: `${updateHourUtc}:00`,
    };
  }, []);

  return (
    <Text style={[styles.text, { color: theme.secondary }]}>
      {t('chartsStats.noticeUtc', { utcOffset, offset })}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center' as const,
    marginBottom: 8,
    marginTop: 8,
    opacity: 0.6,
  },
});

export default ChartsStatsNotice;
