import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appConfig } from '../../appConfig';
import Header from '../../components/commons/Header';
import { ThemeType, useTheme } from '../../context/ThemeContext';
import { SCREENS } from '../../utils/constants';

export default function AboutGame() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL', err));
  };

  const year = new Date().getFullYear();
  const copyrightYear = year === 2025 ? year : `2025 - ${year}`;

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={t('aboutGame')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('appNameWithAuthor', {
              appName: t('appName'),
              author: t('author'),
            })}
          </Text>
          <Text style={[styles.version, { color: theme.secondary }]}>
            {t('version', { version: appConfig.version })}
          </Text>
          <Text style={[styles.copyright, { color: theme.secondary }]}>
            {t('copyright', { year: copyrightYear, appName: t('appName') })}
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.background }]}>
          {/* <Item
            theme={theme}
            label="Terms of Service"
            onPress={() => openURL('https://yourdomain.com/terms')}
          />
          <Item
            theme={theme}
            label="Privacy Policy"
            onPress={() => openURL('https://yourdomain.com/privacy')}
          /> */}
          <Item
            theme={theme}
            label={t('licenses')}
            onPress={() => router.push(SCREENS.LICENSES as any)}
            isLast={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Item = ({
  theme,
  label,
  isLast = false,
  onPress,
}: {
  theme: ThemeType;
  label: string;
  isLast?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.item,
      {
        backgroundColor: theme.background,
        borderBottomColor: isLast ? 'transparent' : '#ccc',
      },
    ]}>
    <Text style={[styles.itemText, { color: theme.text }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  version: {
    marginTop: 6,
    fontSize: 14,
  },
  copyright: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
  },
});
