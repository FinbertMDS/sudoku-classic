import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppPause = (onPause: () => void, onResume: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        onPause();
      }
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onResume();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [onPause, onResume]);
};
