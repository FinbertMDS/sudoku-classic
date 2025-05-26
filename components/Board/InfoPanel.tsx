import { useAlert } from '@/hooks/useAlert';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useGameTimer } from '../../hooks/useGameTimer';
import { AppSettings } from '../../types';
import { MAX_MISTAKES, MAX_TIMEPLAYED } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

type InfoPanelProps = {
  isPlaying: boolean;
  level: string;
  mistakes: number;
  score: number;
  secondsRef: React.RefObject<number>;
  isPaused: boolean;
  settings: AppSettings;
  onPause: () => void;
  onLimitTimeReached: () => Promise<void>;
};

const InfoPanel = ({
  isPlaying,
  level,
  mistakes,
  score,
  secondsRef,
  isPaused,
  settings,
  onPause,
  onLimitTimeReached,
}: InfoPanelProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { alert } = useAlert();

  const { getSeconds, stopTimer } = useGameTimer(isPlaying, {
    maxTimePlayed: MAX_TIMEPLAYED,
    onLimitReached: async () => {
      stopTimer();
      alert(
        t('timeWarning'),
        t('playedLimit', { limit: formatTime(MAX_TIMEPLAYED) }),
        [
          {
            text: t('ok'),
            onPress: () => {
              onLimitTimeReached();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      secondsRef.current = getSeconds();
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.infoBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{t('level')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {t(`level.${level}`)}
        </Text>
      </View>

      {settings.mistakeLimit && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('mistakes')}
          </Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {mistakes}/{MAX_MISTAKES}
          </Text>
        </View>
      )}

      {settings.timer && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, { color: theme.text }]}>{t('time')}</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {tick > 0 ? formatTime(getSeconds()) : '-'}
          </Text>
        </View>
      )}
      <View style={styles.infoBlock}>
        <Text style={[styles.title, { color: theme.text }]}>{t('score')}</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {Math.round(score)}
        </Text>
      </View>

      <TouchableOpacity style={styles.infoBlock} onPress={onPause}>
        {!isPaused ? (
          <MaterialCommunityIcons
            name="pause-circle-outline"
            size={28}
            color={theme.iconColor}
          />
        ) : (
          <MaterialCommunityIcons
            name="play-circle-outline"
            size={28}
            color={theme.iconColor}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    marginTop: 30,
  },
  infoBlock: {
    alignItems: 'center' as const,
    minWidth: 70,
  },
  title: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});

export default React.memo(InfoPanel);
