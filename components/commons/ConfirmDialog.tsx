import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

type ConfirmDialogProps = {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDialog = ({
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const {theme} = useTheme();

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View
          style={[styles.dialogWrapper, {backgroundColor: theme.background}]}>
          <View style={styles.dialog}>
            <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
            <Text style={[styles.message, {color: theme.secondary}]}>
              {message}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, styles.borderRight]}>
              <Text style={[styles.cancelText, {color: theme.text}]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.button}>
              <Text style={[styles.confirmText, {color: theme.danger}]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialogWrapper: {
    width: 270,
    borderRadius: 13,
    overflow: 'hidden' as const,
    elevation: 5,
  },
  dialog: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  message: {
    fontSize: 13,
    textAlign: 'center' as const,
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  borderRight: {
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  cancelText: {
    fontSize: 17,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
});

export default ConfirmDialog;
