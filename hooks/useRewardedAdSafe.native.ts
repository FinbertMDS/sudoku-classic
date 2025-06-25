// hooks/useRewardedAdSafe.ts
import {RequestOptions, useRewardedAd} from 'react-native-google-mobile-ads';

export const AD_REQUEST_OPTIONS: RequestOptions = {
  requestNonPersonalizedAdsOnly: true,
  keywords: [
    // Sudoku
    'puzzle',
    'brain',
    'logic',
    'math',
    'killer sudoku',
    'sudoku',
    'mental training',
    // Education
    'education',
    'learning',
    'study',
    'student',
    'cognitive skills',
    'e-learning',
    'mental math',
    // Language
    'language learning',
    'English',
    'Japanese',
    'vocabulary',
    'grammar',
    // Mindfulness
    'focus',
    'meditation',
    'calm',
    'relaxation',
    'mental health',
    'wellness',
    // Sports
    'sports',
    'exercise',
    'fitness',
    'health',
    'yoga',
  ],
};

export function useRewardedAdSafe(adUnitId: string) {
  return useRewardedAd(adUnitId, AD_REQUEST_OPTIONS);
}
