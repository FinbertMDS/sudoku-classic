// hooks/useRewardedAdSafe.web.ts
export function useRewardedAdSafe(adUnitId: string) {
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    load: () => {},
    show: () => {},
  };
}
