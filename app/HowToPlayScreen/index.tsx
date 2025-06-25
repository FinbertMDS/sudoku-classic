import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import HowToPlay from '../../components/HowToPlay';
import {useTheme} from '../../context/ThemeContext';
import {useSafeGoBack} from '../../hooks/useSafeGoBack';

const HowToPlayScreen = () => {
  const goBack = useSafeGoBack();
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('howToPlay.title')}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />
      <HowToPlay onClose={() => goBack()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HowToPlayScreen;
