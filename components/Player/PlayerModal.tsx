import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

type PlayerModalProps = {
  onClose: () => void;
  onSubmit: (mode: 'create' | 'edit', name: string) => void;
  mode: 'create' | 'edit';
  initialName?: string;
};

const PlayerModal = ({
  onClose,
  onSubmit,
  mode,
  initialName,
}: PlayerModalProps) => {
  const [name, setName] = useState(initialName ?? '');
  const {t} = useTranslation();
  const {theme} = useTheme();

  useEffect(() => {
    setName(initialName ?? '');
  }, [initialName]);

  const renderModal = () => {
    return (
      <View style={[styles.modal, {backgroundColor: theme.modalBg}]}>
        <Text style={[styles.title, {color: theme.text}]}>
          {mode === 'create' ? t('playerNameLabel') : t('editPlayerTitle')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {color: theme.secondary, borderColor: theme.inputBorder},
          ]}
          placeholderTextColor={theme.placeholder}
          placeholder={t('playerNamePlaceholder')}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              {backgroundColor: theme.cancelButtonBg},
            ]}
            onPress={onClose}>
            <Text style={[styles.cancelText, {color: theme.text}]}>
              {t('cancelBtn')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, {backgroundColor: theme.buttonBlue}]}
            onPress={() => {
              onClose();
              onSubmit(mode, name);
            }}>
            <Text style={[styles.createText, {color: theme.text}]}>
              {mode === 'create' ? t('createBtn') : t('saveBtn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (Platform.OS === 'web') {
    return renderModal();
  }

  return (
    <Pressable onPress={Keyboard.dismiss} style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {renderModal()}
      </KeyboardAvoidingView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  createText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(PlayerModal);
