import {useAlert} from '@/hooks/useAlert';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {router} from 'expo-router';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appConfig} from '../../appConfig';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {OptionMenuItem, RootStackParamList} from '../../types';
import {SCREENS} from '../../utils/constants';

const OptionsScreen = () => {
  const {theme} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();
  const {alert} = useAlert();

  const handleGoToSettings = () => {
    router.push({
      pathname: '/SettingsScreen',
      params: {showAdvancedSettings: '1'},
    });
  };

  const handleRateApp = () => {
    const storeUrl = appConfig.getStoreUrl();
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  const handleShareApp = async () => {
    const storeUrl = appConfig.getStoreUrl();
    if (storeUrl) {
      await Share.share({
        message: `${t('shareAppMsg')} ${storeUrl}`,
      });
    }
  };

  const handleSendFeedback = async () => {
    const url = `mailto:${appConfig.developerMail}?subject=${t(
      'sendFeedbackTitle',
    )}&body=${t('sendFeedbackMsg')}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      alert(
        t('mailNotSupported'),
        t('mailNotSupportedMsg', {mail: appConfig.developerMail}),
      );
    }
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error opening URL', err),
    );
  };

  const menuItems: OptionMenuItem[] = [
    {icon: 'account-group', label: t('players'), screen: SCREENS.PLAYERS},
    {icon: 'cog', label: t('settings'), onPress: handleGoToSettings},
    {icon: 'school', label: t('howToPlay'), screen: SCREENS.HOW_TO_PLAY},
    {icon: 'star-outline', label: t('rateApp'), onPress: handleRateApp},
    {icon: 'share-variant', label: t('shareApp'), onPress: handleShareApp},
    {
      icon: 'email-outline',
      label: t('sendFeedback'),
      onPress: handleSendFeedback,
    },
    {icon: 'information', label: t('aboutGame'), screen: SCREENS.ABOUT_GAME},
    {
      icon: 'coffee',
      label: t('support'),
      onPress: () => openURL(appConfig.supportUrl),
    },
    // {icon: 'shield-account', label: t('privacyRights')},
    // {icon: 'account-check', label: t('privacyPreferences')},
    // {icon: 'ad-off', label: t('removeAds')},
    // {icon: 'restore', label: t('restorePurchase')},
  ];

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <Header
        title={t('options')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      <ScrollView
        style={[
          styles.contentContainer,
          {backgroundColor: theme.backgroundSecondary},
        ]}
      >
        {menuItems.map(({icon, label, screen, onPress}) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.item,
              {backgroundColor: theme.settingItemBackground},
            ]}
            onPress={() =>
              screen
                ? navigation.navigate(screen as any)
                : onPress
                  ? onPress()
                  : () => {}
            }
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={24}
              color={theme.iconColor}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  icon: {
    marginRight: 12,
  },
});

export default OptionsScreen;
