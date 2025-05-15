import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppSettings } from '../../types';
import { MAX_MISTAKES } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

type InfoPanelProps = {
  level: string;
  mistakes: number;
  time: number;
  isPaused: boolean;
  settings: AppSettings;
  onPause: () => void;
};

const InfoPanel = ({
  level,
  mistakes,
  time,
  isPaused,
  settings,
  onPause,
}: InfoPanelProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.infoBlock}>
        <Text style={[styles.title, {color: theme.text}]}>{t('level')}</Text>
        <Text style={[styles.value, {color: theme.text}]}>
          {t(`level.${level}`)}
        </Text>
      </View>

      {settings.mistakeLimit && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, {color: theme.text}]}>
            {t('mistakes')}
          </Text>
          <Text style={[styles.value, {color: theme.text}]}>
            {mistakes}/{MAX_MISTAKES}
          </Text>
        </View>
      )}

      {settings.timer && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, {color: theme.text}]}>{t('time')}</Text>
          <Text style={[styles.value, styles.timeValue, {color: theme.text}]}>
            {formatTime(time)}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.infoBlock} onPress={onPause}>
        {!isPaused ? (
          <MaterialCommunityIcons name="pause-circle-outline" size={28} color={theme.iconColor} />
        ) : (
          <MaterialCommunityIcons name="play-circle-outline" size={28} color={theme.iconColor} />
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
    paddingVertical: 20,
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
  timeValue: {
    minWidth: 50,
  },
});

export default React.memo(InfoPanel);
