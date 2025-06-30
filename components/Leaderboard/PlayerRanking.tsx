// src/components/Leaderboard/PlayerRanking.tsx

import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PlayerStats} from '../../types';
import EmptyContainer from '../commons/EmptyContainer';
import PlayerStatsCard from './sub/PlayerStatsCard';

type PlayerRankingProps = {
  playerStats: PlayerStats[];
};

const PlayerRanking = ({playerStats}: PlayerRankingProps) => {
  return (
    <>
      {playerStats.length === 0 ? (
        <EmptyContainer />
      ) : (
        <ScrollView>
          <View style={styles.cardContainer}>
            {playerStats.map((playerStat, index) => (
              <PlayerStatsCard
                key={playerStat.player.id}
                stat={playerStat}
                rank={index + 1}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default PlayerRanking;
