import * as Device from 'expo-device';
import React, {useMemo} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

  // Tạo mảng số từ 1-9 một lần duy nhất
  const numbers = useMemo(
    () => Array.from({length: BOARD_SIZE}, (_, i) => i + 1),
    [],
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {numbers.map((num) => (
        <TouchableOpacity
          key={num}
          style={[styles.button]}
          onPress={() => onSelectNumber(num)}
          disabled={counts[num] === BOARD_SIZE}>
          <Text
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {color: theme.text, fontSize: 32},
            ]}>
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
    justifyContent: 'center' as const,
    width: '100%' as const,
    alignItems: 'center' as const,
    marginTop:
      Platform.OS !== 'web' && Device.deviceType === Device.DeviceType.TABLET
        ? 10
        : 0,
    marginBottom: 20,
    paddingHorizontal: 32,
  },
  button: {
    width:
      Platform.OS !== 'web' && Device.deviceType === Device.DeviceType.TABLET
        ? 60
        : 40,
    height:
      Platform.OS !== 'web' && Device.deviceType === Device.DeviceType.TABLET
        ? 60
        : 40,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

export default React.memo(NumberPad);
