// hooks/useRewardedAdSafe.ts
import { useRewardedAd } from "react-native-google-mobile-ads";

export function useRewardedAdSafe(adUnitId: string) {
  return useRewardedAd(adUnitId);
}
