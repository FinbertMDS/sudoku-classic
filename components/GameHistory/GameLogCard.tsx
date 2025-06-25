// components/GameHistory/GameLogCard.tsx

import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {GameLogEntryV2} from '../../types';
import {getLevelColor} from '../../utils/colorUtil';
import {formatDateTime, formatDuration} from '../../utils/dateUtil';

const GameLogCard = ({log}: {log: GameLogEntryV2}) => {
  const {t} = useTranslation();
  const {mode, theme} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: theme.card}]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.level, {color: getLevelColor(log.level, mode)}]}>
          {t(`level.${log.level}`)}
        </Text>
        <Text
          style={[
            styles.status,
            {color: log.completed ? theme.success : theme.error},
          ]}
        >
          {log.completed ? t('completed') : t('incomplete')}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.rowValue}>
          <MaterialCommunityIcons
            style={styles.icon}
            name={'timer-outline'}
            size={18}
            color={theme.secondary}
          />
          <Text style={[styles.item, {color: theme.text}]}>
            {formatDuration(log.durationSeconds)}
          </Text>
        </View>
        <View style={styles.rowValue}>
          <MaterialCommunityIcons
            style={styles.icon}
            name={'close-circle-outline'}
            size={18}
            color={theme.secondary}
          />
          <Text style={[styles.item, {color: theme.text}]}>
            {log.mistakes ?? 0}
          </Text>
        </View>
        <View style={styles.rowValue}>
          <MaterialCommunityIcons
            style={styles.icon}
            name={'lightbulb-outline'}
            size={18}
            color={theme.secondary}
          />
          <Text style={[styles.item, {color: theme.text}]}>
            {log.hintCount ?? 0}
          </Text>
        </View>
      </View>

      <View style={styles.rowValue}>
        <MaterialCommunityIcons
          style={styles.icon}
          name={'clock-outline'}
          size={14}
          color={theme.secondary}
        />
        <Text style={[styles.timeLabel, {color: theme.secondary}]}>
          {t('startTime')}: {formatDateTime(log.startTime)}
        </Text>
      </View>
      <View style={styles.rowValue}>
        <MaterialCommunityIcons
          style={styles.icon}
          name={'stop-circle'}
          size={14}
          color={theme.secondary}
        />
        <Text style={[styles.timeLabel, {color: theme.secondary}]}>
          {t('endTime')}: {formatDateTime(log.endTime)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  item: {
    fontSize: 18,
  },
  timeLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  icon: {
    marginRight: 6,
  },
});

export default GameLogCard;
