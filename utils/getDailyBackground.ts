// utils/getDailyBackground.ts
import { DailyBackgrounds } from '../types';

const getRandomKeyword = (list: string[]) =>
  list[Math.floor(Math.random() * list.length)];

export const getDailyBackgrounds = async (): Promise<DailyBackgrounds> => {
  return { light: null, dark: null };
  // const today = new Date().toISOString().split('T')[0];
  // const cached = await BackgroundService.load();
  // if (cached) {
  //   const { date, light, dark } = cached;
  //   if ((__DEV__ || date === today) && light && dark) {
  //     return { light, dark };
  //   }
  // }

  // const [lightUrl, darkUrl] = await Promise.all([
  //   BackgroundService.fetchUnsplashImage(
  //     getRandomKeyword(UNSPLASH_KEYWORDS_LIGHT),
  //   ),
  //   BackgroundService.fetchUnsplashImage(
  //     getRandomKeyword(UNSPLASH_KEYWORDS_DARK),
  //   ),
  // ]);

  // if (lightUrl && darkUrl) {
  //   const result = { date: today, light: lightUrl, dark: darkUrl };
  //   await BackgroundService.save(result);
  //   return { light: lightUrl, dark: darkUrl };
  // } else {
  //   const oldCached = await BackgroundService.load();
  //   if (oldCached) {
  //     const { light, dark } = oldCached;
  //     if (light && dark) {
  //       return { light, dark };
  //     }
  //   }
  // }
  // return { light: null, dark: null };
};
