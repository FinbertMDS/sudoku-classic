import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Level} from '../../types';
import {MAX_MISTAKES} from '../../utils/constants';
import {formatTime} from '../../utils/dateUtil';

type PauseModalProps = {
  level: Level;
  mistake: number;
  time: number;
  onResume: () => void;
};

const PauseModal = ({level, mistake, time, onResume}: PauseModalProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <>
      {/* Modal tạm dừng */}
      <Modal transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modalBox, {backgroundColor: theme.background}]}>
            {/* Header */}
            <Text style={[styles.modalHeader, {color: theme.text}]}>
              {t('paused')}
            </Text>

            {/* Thông tin Board */}
            <View style={styles.modalBoardInfo}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('level')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {t(`level.${level}`)}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('mistakes')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {mistake}/{MAX_MISTAKES}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoTitle}>{t('time')}</Text>
                <Text style={[styles.infoValue, {color: theme.text}]}>
                  {formatTime(time)}
                </Text>
              </View>
            </View>

            {/* Button Tiếp tục */}
            <TouchableOpacity
              style={[styles.resumeButton, {backgroundColor: theme.primary}]}
              onPress={onResume}>
              <Text
                style={[styles.resumeButtonText, {color: theme.buttonText}]}>
                {t('continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  modalBox: {
    backgroundColor: 'white',
    width: '90%' as const,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center' as const,
  },

  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    color: '#333',
  },

  modalBoardInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginBottom: 20,
  },

  infoBlock: {
    alignItems: 'center' as const,
  },

  infoTitle: {
    fontSize: 14,
    color: '#888',
  },

  infoValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },

  resumeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  resumeButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
});

export default React.memo(PauseModal);
