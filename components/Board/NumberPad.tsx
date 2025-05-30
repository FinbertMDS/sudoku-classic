import React, { useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNumberCounts } from '../../hooks/useNumberCounts';
import { AppSettings, CellValue } from '../../types';
import { BOARD_SIZE } from '../../utils/constants';

type NumberPadProps = {
  board: CellValue[][];
  settings: AppSettings;
  onSelectNumber: (num: number) => void;
};

const NumberPad = ({ board, settings, onSelectNumber }: NumberPadProps) => {
  const { theme } = useTheme();
  const counts = useNumberCounts(board, settings);

  // Tính toán kích thước button dựa trên width màn hình
  const { buttonWidth, buttonHeight } = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const containerPadding = 8; // padding left/right của container
    const availableWidth = screenWidth - containerPadding * 2; // width khả dụng
    const width = availableWidth / 9; // chia đều cho 9 button
    const height = width + 20; // height = width + padding top/bottom 10px
    return { buttonWidth: width, buttonHeight: height };
  }, []);

  // Tạo mảng số từ 1-9 một lần duy nhất
  const numbers = useMemo(
    () => Array.from({ length: BOARD_SIZE }, (_, i) => i + 1),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {numbers.map((num) => (
        <TouchableOpacity
          key={num}
          style={[
            styles.button,
            {
              width: buttonWidth,
              height: buttonHeight,
            },
          ]}
          onPress={() => onSelectNumber(num)}
          disabled={counts[num] === BOARD_SIZE}
        >
          <Text style={[styles.text, { color: theme.text }]}>
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
    marginTop: 30,
    paddingHorizontal: 32,
  },
  button: {
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  text: {
    fontSize: 32,
  },
});

export default React.memo(NumberPad);
