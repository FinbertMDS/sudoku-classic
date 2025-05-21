// BannerAdSafe.tsx
import { useTheme } from '@/context/ThemeContext';
import { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  useForeground,
} from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAdUnit } from '../../utils/getAdUnit';

export const BannerAdSafe = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const bannerRef = useRef<BannerAd>(null);
  const bannerId = getAdUnit('banner');

  useForeground(() => {
    if (Platform.OS === 'ios' && bannerRef?.current?.load) {
      bannerRef.current.load();
    }
  });
  return (
    <View
      style={[
        styles.adContainer,
        {
          bottom: insets.bottom,
          backgroundColor: theme.background,
        },
      ]}>
      <BannerAd
        ref={bannerRef}
        unitId={bannerId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
  },
});