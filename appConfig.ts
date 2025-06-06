import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import { Platform } from 'react-native';

export const appConfig = {
  iosAppId: '1234567890',
  androidPackageName: 'com.finbertngo.sudokuclassic',
  developerMail: 'finbertngo@gmail.com',
  version: nativeApplicationVersion,
  buildNumber: nativeBuildVersion,
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
      web: `https://github.com/FinbertMDS/sudoku-classic`,
    }),
  supportUrl: 'https://buymeacoffee.com/finbertngo',
};
