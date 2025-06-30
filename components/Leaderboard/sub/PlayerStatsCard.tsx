import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import {PlayerStats} from '../../../types';
import {formatDuration} from '../../../utils/dateUtil';
import {renderMedal} from './RankingComponents';

type PlayerStatsCardProps = {
  stat: PlayerStats;
  rank: number;
};

const PlayerStatsCard = ({stat, rank}: PlayerStatsCardProps) => {
  const {mode, theme} = useTheme();
  const {
    player,
    totalGames,
    completedGames,
    totalTime,
    winRate,
    notes,
    highlights,
  } = stat;

  return (
    <View style={[styles.card, {backgroundColor: theme.card}]}>
      {/* Header */}
      <View style={styles.header}>
        {renderMedal(mode, rank)}
        <View style={[styles.avatar, {backgroundColor: player.avatarColor}]} />
        <Text style={[styles.name, {color: theme.text}]}>{player.name}</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <Ionicons
              name="game-controller-outline"
              size={16}
              color={theme.primary}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.secondary}]}>
              Tổng ván
            </Text>
          </View>
          <Text style={[styles.value, {color: theme.text}]}>{totalGames}</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={16}
              color={theme.primary}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.secondary}]}>
              Hoàn thành
            </Text>
          </View>
          <Text style={[styles.value, {color: theme.text}]}>
            {completedGames}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.primary}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.secondary}]}>
              Tổng thời gian
            </Text>
          </View>
          <Text style={[styles.value, {color: theme.text}]}>
            {formatDuration(totalTime)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons
              name="progress-check"
              size={16}
              color={theme.primary}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.secondary}]}>
              Tỷ lệ thắng
            </Text>
          </View>
          <Text style={[styles.value, {color: theme.text}]}>
            {(winRate * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Notes */}
      {notes && (
        <View style={styles.section}>
          <MaterialCommunityIcons
            name="account-check-outline"
            size={16}
            color={theme.primary}
          />
          <Text style={[styles.noteText, {color: theme.text}]}>{notes}</Text>
        </View>
      )}

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <View style={styles.section}>
          <Ionicons name="trophy-outline" size={16} color={theme.primary} />
          <View style={styles.highlightList}>
            {highlights.map((h) => (
              <Text key={h} style={[styles.noteText, {color: theme.text}]}>
                {h}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    width: '47%',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteText: {
    marginLeft: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  highlightList: {
    flex: 1,
  },
});

export default PlayerStatsCard;
