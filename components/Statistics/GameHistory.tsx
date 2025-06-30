// src/components/Statistics/GameHistory.tsx
import React, {useMemo} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {GameLogEntryV2, TimeFilter} from '../../types';
import {getGameHistory} from '../../utils/statsUtil';
import EmptyContainer from '../commons/EmptyContainer';
import GameLogCard from '../GameHistory/GameLogCard';

type GameHistoryProps = {
  logs: GameLogEntryV2[];
  filter: TimeFilter;
};

const GameHistory = ({logs, filter}: GameHistoryProps) => {
  const {theme} = useTheme();

  const sortedLogs = useMemo(
    () => getGameHistory(logs, filter),
    [logs, filter],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {sortedLogs.length === 0 ? (
        <EmptyContainer />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{backgroundColor: theme.background}}>
          {sortedLogs.map((log) => (
            <GameLogCard key={log.id} log={log} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});

export default GameHistory;
