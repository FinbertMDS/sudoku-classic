// i18n.ts

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {AppState} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {LANGUAGES} from '../utils/constants';

import {appStorage} from '../storage';
import en from './locales/en.json';
import ja from './locales/ja.json';
import vi from './locales/vi.json';

const resources = {
  en: {translation: en},
  vi: {translation: vi},
  ja: {translation: ja},
};

const fallback = {languageTag: LANGUAGES[0].code};
const getBestLanguage = () => {
  const bestLang = RNLocalize.findBestLanguageTag(LANGUAGES.map(l => l.code));
  return bestLang?.languageTag || fallback.languageTag;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getBestLanguage(),
  fallbackLng: fallback.languageTag,
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Auto-detects the system language and updates the i18n language if it differs from the stored language.
 * Also updates the stored language in AsyncStorage.
 */
export const autoDetectLanguage = async () => {
  const systemLang = getBestLanguage();
  let oldLanguage = appStorage.getLangKeyDefault();
  if (systemLang !== oldLanguage) {
    i18n.changeLanguage(systemLang);
    appStorage.saveLangKeyDefault(systemLang);
    appStorage.saveLangKeyPreferred(systemLang);
    return systemLang;
  }
  let preferedLanguage = appStorage.getLangKeyPreferred();
  if (preferedLanguage) {
    i18n.changeLanguage(preferedLanguage);
  }
  return preferedLanguage;
};

AppState.addEventListener('change', async state => {
  if (state === 'active') {
    await autoDetectLanguage();
  }
});

export default i18n;
