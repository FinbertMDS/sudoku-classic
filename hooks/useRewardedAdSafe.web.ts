// hooks/useRewardedAdSafe.web.ts
export function useRewardedAdSafe() {
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    load: () => { },
    show: () => { },
  };
}
