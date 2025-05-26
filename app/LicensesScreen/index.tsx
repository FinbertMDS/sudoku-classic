import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Header from '../../components/commons/Header';
import { useTheme } from '../../context/ThemeContext';

const LicensesScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const licensesSource =
    Platform.OS === 'android'
      ? { uri: 'file:///android_asset/licenses.html' }
      : require('../../assets/htmls/licenses.html');

  // access to file assets/licenses.html
  const webSource = '/assets/assets/htmls/licenses.html';
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Header
        title={t('licenses')}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />

      {Platform.OS === 'web' ? (
        <View style={{ flex: 1 }}>
          <iframe
            src={webSource}
            style={{ width: '100%', height: '100%', borderWidth: 0 }}
          />
        </View>
      ) : (
        <WebView originWhitelist={['*']} source={licensesSource} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LicensesScreen;
