// src/hooks/useAppUpdateChecker.ts
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {appConfig} from '../appConfig';

const parseVersion = (version: string): [number, number, number] => {
  const [major, minor, patch] = version.split('.').map((v) => parseInt(v, 10));
  return [major || 0, minor || 0, patch || 0];
};

const isForceUpdate = (current: string, latest: string): boolean => {
  const [currMajor, currMinor] = parseVersion(current);
  const [latestMajor, latestMinor] = parseVersion(latest);

  return latestMajor > currMajor || latestMinor > currMinor;
};

export const useAppUpdateChecker = () => {
  const [needUpdate, setNeedUpdate] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');

  const checkVersion = async () => {
    try {
      if (Platform.OS === 'web') {
        return;
      }
      const _storeUrl =
        Platform.OS === 'ios'
          ? await VersionCheck.getAppStoreUrl({appID: appConfig.iosAppId})
          : await VersionCheck.getPlayStoreUrl({
              packageName: appConfig.androidPackageName,
            });
      setStoreUrl(_storeUrl);

      const currentVersion = VersionCheck.getCurrentVersion();
      const latestVersion = await VersionCheck.getLatestVersion();
      const updateInfo = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });

      setNeedUpdate(updateInfo.isNeeded);
      if (updateInfo.isNeeded) {
        const force = isForceUpdate(currentVersion, latestVersion);
        setForceUpdate(force);
      }
    } catch (e) {
      console.error('Check version error:', e);
    }
  };

  useEffect(() => {
    checkVersion();
  }, []);

  return {needUpdate, forceUpdate, storeUrl, checkVersion};
};
