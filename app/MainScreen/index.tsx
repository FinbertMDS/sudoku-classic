// src/screens/MainScreen/index.tsx
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import Header from '../../components/commons/Header';
import NewGameMenu from '../../components/Main/NewGameMenu';
import {useTheme} from '../../context/ThemeContext';
import {CORE_EVENTS} from '../../events';
import eventBus from '../../events/eventBus';
import {useDailyBackground} from '../../hooks/useDailyBackground';
import {BoardService} from '../../services/BoardService';
import {Level, RootStackParamList} from '../../types/index';
import {SCREENS} from '../../utils/constants';

const MainScreen = () => {
  const {mode, theme} = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const {backgroundUrl, loadBackgrounds} = useDailyBackground(mode);

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      checkSavedGame();
      loadBackgrounds();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const checkSavedGame = async () => {
    const saved = await BoardService.loadSaved();
    setHasSavedGame(!!saved);
  };

  const handleNewGame = async (level: Level) => {
    await BoardService.clear();
    const id = uuid.v4().toString();
    eventBus.emit(CORE_EVENTS.initGame, {level, id});
    navigation.navigate(SCREENS.BOARD, {
      id,
      level,
      type: 'init',
    });
  };

  const handleContinueGame = async () => {
    const savedGame = await BoardService.loadSaved();
    if (savedGame) {
      navigation.navigate(SCREENS.BOARD, {
        id: savedGame.savedId,
        level: savedGame.savedLevel,
        type: 'saved',
      });
    }
  };

  const handleClearStorage = async () => {
    eventBus.emit(CORE_EVENTS.clearStorage);
    BoardService.clear().then(checkSavedGame);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container]}>
      {backgroundUrl && (
        <ImageBackground
          source={{uri: backgroundUrl}}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          blurRadius={2}
        />
      )}
      <Header
        title={t('appName')}
        showBack={false}
        showSettings={true}
        showTheme={true}
      />

      {/* <LanguageSwitcher /> */}
      <View style={[styles.content]}>
        {hasSavedGame && (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.primary,
                borderColor: theme.buttonBorder,
              },
            ]}
            onPress={handleContinueGame}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>
              {t('continueGame')}
            </Text>
          </TouchableOpacity>
        )}

        <NewGameMenu handleNewGame={handleNewGame} />

        {__DEV__ && (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.danger,
                borderColor: theme.buttonBorder,
              },
            ]}
            onPress={handleClearStorage}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>
              {t('clearStorage')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default MainScreen;
