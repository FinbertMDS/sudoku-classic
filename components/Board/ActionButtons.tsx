import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type ActionButtonsProps = {
  noteMode: boolean;
  onNote: (mode: boolean) => void;
  onUndo: () => void;
  onErase: () => void;
  onHint: () => void;
  onSolve: () => void;
};

const ActionButtons = ({
  noteMode,
  onNote,
  onUndo,
  onErase,
  onHint,
  onSolve,
}: ActionButtonsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleNote = useCallback(
    (mode: boolean) => {
      onNote(mode);
    },
    [onNote],
  );
  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  const handleErase = useCallback(() => {
    onErase();
  }, [onErase]);

  const handleHint = useCallback(() => {
    onHint();
  }, [onHint]);

  const handleSolve = useCallback(() => {
    onSolve();
  }, [onSolve]);

  const buttons = useMemo(() => {
    let allButtons = [
      { label: t('undo'), icon: ['undo'], onPress: handleUndo },
      { label: t('erase'), icon: ['eraser'], onPress: handleErase },
      {
        label: t('notes'),
        icon: ['note-outline', 'note-edit-outline'],
        iconChangeFlag: noteMode,
        onPress: () => handleNote(!noteMode),
      },
      { label: t('hint'), icon: ['lightbulb-outline'], onPress: handleHint },
    ];
    if (__DEV__) {
      allButtons.push({
        label: t('solve'),
        icon: ['lightbulb-on-outline'],
        onPress: handleSolve,
      });
    }
    return allButtons;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteMode, handleNote, handleUndo, handleErase, handleHint, handleSolve]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {buttons.map((btn, idx) => (
        <TouchableOpacity key={idx} style={styles.button} onPress={btn.onPress}>
          <MaterialCommunityIcons
            name={
              btn.icon.length > 0 && btn.iconChangeFlag
                ? btn.icon[1] as any
                : btn.icon[0] as any
            }
            size={24}
            color={
              btn.icon.length > 0 && btn.iconChangeFlag
                ? theme.buttonBlue
                : theme.secondary
            }
          />
          <Text
            style={{
              color:
                btn.icon.length > 0 && btn.iconChangeFlag
                  ? theme.buttonBlue
                  : theme.secondary,
            }}>
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginTop: 10,
  },
  button: {
    alignItems: 'center' as const,
    marginHorizontal: 10,
  },
});

export default ActionButtons;
