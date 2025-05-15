import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useNumberCounts} from '../../hooks/useNumberCounts';
import {AppSettings, CellValue} from '../../types';
import {BOARD_SIZE} from '../../utils/constants';

type NumberPadProps = {
  board: CellValue[][];
  settings: AppSettings;
  onSelectNumber: (num: number) => void;
};

const NumberPad = ({board, settings, onSelectNumber}: NumberPadProps) => {
  const {theme} = useTheme();
  const counts = useNumberCounts(board, settings);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {Array.from({length: BOARD_SIZE}, (_, i) => i + 1).map(num => (
        <TouchableOpacity
          key={num}
          style={[styles.button]}
          onPress={() => onSelectNumber(num)}
          disabled={counts[num] === BOARD_SIZE}>
          <Text style={[styles.text, {color: theme.text}]}>
            {counts[num] === BOARD_SIZE ? ' ' : num}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  text: {
    fontSize: 24,
  },
});

export default NumberPad;
