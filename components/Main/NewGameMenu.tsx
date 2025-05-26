import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Level } from '../../types';
import { LEVELS } from '../../utils/constants';

interface NewGameMenuProps {
  handleNewGame: (level: Level) => void;
}

const NewGameMenu: React.FC<NewGameMenuProps> = ({ handleNewGame }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.secondary,
            borderColor: theme.buttonBorder,
          },
        ]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>
          {t('newGame')}
        </Text>
      </TouchableOpacity>

      {visible && (
        <Modal transparent onRequestClose={() => setVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlay}>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: theme.background },
                ]}
              >
                {LEVELS.map((level, index) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.option,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        borderBottomColor:
                          index === LEVELS.length - 1
                            ? 'transparent'
                            : theme.itemBorderColor,
                      },
                      index === 0 && styles.firstOption,
                    ]}
                    onPress={() => {
                      setVisible(false);
                      handleNewGame(level);
                    }}
                  >
                    <Text style={[styles.label, { color: theme.text }]}>
                      {t(`level.${level}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  firstOption: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default React.memo(NewGameMenu);
