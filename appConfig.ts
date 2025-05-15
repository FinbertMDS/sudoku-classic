import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { Platform } from 'react-native';

export const appConfig = {
  iosAppId: '1234567890',
  androidPackageName: 'com.finbertngo.sudokukiller',
  developerMail: 'ngovanhuy.jp@gmail.com',
  version: nativeApplicationVersion,
  buildNumber: nativeBuildVersion,
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
    }),
  supportUrl: 'https://buymeacoffee.com/finbertngo',
};
