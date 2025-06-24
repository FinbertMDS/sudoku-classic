// hooks/useInterstitialAdSafe.web.ts
export function useInterstitialAdSafe(adUnitId: string) {
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    load: () => {},
    show: () => {},
  };
}
