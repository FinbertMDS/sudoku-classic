import {useEffect, useMemo, useState} from 'react';
import {getDailyBackgrounds} from '../utils/getDailyBackground';

export const useDailyBackground = (mode: 'light' | 'dark') => {
  const [backgrounds, setBackgrounds] = useState<{
    light: string | null;
    dark: string | null;
  }>({light: null, dark: null});

  const loadBackgrounds = async () => {
    const {light, dark} = await getDailyBackgrounds();
    setBackgrounds({light, dark});
  };

  useEffect(() => {
    loadBackgrounds();
  }, []);

  const backgroundUrl = useMemo(() => {
    return mode === 'dark' ? backgrounds.dark : backgrounds.light;
  }, [mode, backgrounds]);

  return {
    backgroundUrl,
    loadBackgrounds,
  };
};
