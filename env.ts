import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? Constants.manifest2?.extra ?? {};

export const UNSPLASH_ACCESS_KEY = extra.UNSPLASH_ACCESS_KEY;

export const AD_UNIT_BANNER_ANDROID = extra.AD_UNIT_BANNER_ANDROID;
export const AD_UNIT_BANNER_IOS = extra.AD_UNIT_BANNER_IOS;
export const AD_UNIT_INTERSTITIAL_ANDROID = extra.AD_UNIT_INTERSTITIAL_ANDROID;
export const AD_UNIT_INTERSTITIAL_IOS = extra.AD_UNIT_INTERSTITIAL_IOS;
export const AD_UNIT_REWARDED_ANDROID = extra.AD_UNIT_REWARDED_ANDROID;
export const AD_UNIT_REWARDED_IOS = extra.AD_UNIT_REWARDED_IOS;
