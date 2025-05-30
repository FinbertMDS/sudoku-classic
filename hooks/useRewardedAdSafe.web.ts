// hooks/useRewardedAdSafe.web.ts
export function useRewardedAdSafe(adUnitId: string, options: any) {
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    load: () => {},
    show: () => {},
  };
}
