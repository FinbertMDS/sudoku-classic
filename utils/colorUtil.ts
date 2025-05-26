// getLevelColor.ts

import { ColorSchemeName } from 'react-native';
import { Level } from '../types';
import { LEVELS } from './constants';

export const levelColors: Record<Level, { light: string; dark: string }> = {
  easy: {
    light: '#4ade80', // green-400
    dark: '#22c55e', // green-500
  },
  medium: {
    light: '#60a5fa', // blue-400
    dark: '#3b82f6', // blue-500
  },
  hard: {
    light: '#facc15', // yellow-400
    dark: '#eab308', // yellow-500
  },
  expert: {
    light: '#f87171', // red-400
    dark: '#ef4444', // red-500
  },
  master: {
    light: '#f472b6', // rose-400
    dark: '#ec4899', // rose-500
  },
};

export const getChartConfig = (mode: ColorSchemeName = 'light') => ({
  backgroundGradientFrom: mode === 'dark' ? '#1E1E1E' : '#ffffff',
  backgroundGradientTo: mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
  decimalPlaces: 0,
  color: (opacity = 1) =>
    mode === 'dark'
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => (mode === 'dark' ? '#ccc' : '#333'),
  propsForBackgroundLines: {
    stroke: mode === 'dark' ? '#333' : '#e0e0e0',
  },
  propsForLabels: {
    fill: mode === 'dark' ? '#fff' : '#111',
    fontSize: 12,
  },
});

export function getLevelColor(
  level: Level,
  scheme: ColorSchemeName = 'light',
): string {
  return levelColors[level][scheme!];
}

export function getLevelColorsBySchema(
  scheme: ColorSchemeName = 'light',
): string[] {
  return LEVELS.map((level) => levelColors[level][scheme!]);
}
