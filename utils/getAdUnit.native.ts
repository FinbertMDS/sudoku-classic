import {
  AD_UNIT_BANNER_ANDROID,
  AD_UNIT_BANNER_IOS,
  AD_UNIT_INTERSTITIAL_ANDROID,
  AD_UNIT_INTERSTITIAL_IOS,
  AD_UNIT_REWARDED_ANDROID,
  AD_UNIT_REWARDED_IOS,
} from '@/env';
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

type AdType = 'banner' | 'interstitial' | 'rewarded';

const DEV_AD_UNITS: Record<AdType, string> = {
  banner: TestIds.BANNER,
  interstitial: TestIds.INTERSTITIAL,
  rewarded: TestIds.REWARDED,
};

const PROD_AD_UNITS_IOS: Record<AdType, string> = {
  banner: AD_UNIT_BANNER_IOS,
  interstitial: AD_UNIT_INTERSTITIAL_IOS,
  rewarded: AD_UNIT_REWARDED_IOS,
};

const PROD_AD_UNITS_ANDROID: Record<AdType, string> = {
  banner: AD_UNIT_BANNER_ANDROID,
  interstitial: AD_UNIT_INTERSTITIAL_ANDROID,
  rewarded: AD_UNIT_REWARDED_ANDROID,
};

export function getAdUnit(type: AdType): string {
  if (__DEV__) {
    return DEV_AD_UNITS[type];
  }

  const platformUnits =
    Platform.OS === 'ios' ? PROD_AD_UNITS_IOS : PROD_AD_UNITS_ANDROID;

  return platformUnits[type];
}
