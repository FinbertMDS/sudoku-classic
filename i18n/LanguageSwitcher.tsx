// LanguageSwitcher.tsx

import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {appStorage} from '../storage';
import {LANGUAGES} from '../utils/constants';
import i18n, {autoDetectLanguage} from './i18n';

export default function LanguageSwitcher() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useFocusEffect(
    useCallback(() => {
      autoDetectLanguage().then(lang => {
        if (lang) {
          setSelectedLang(lang);
        }
      });
    }, []),
  );

  useEffect(() => {
    autoDetectLanguage().then(lang => {
      if (lang) {
        setSelectedLang(lang);
      }
    });
  }, []);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    appStorage.saveLangKeyPreferred(code);
    setSelectedLang(code);
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.backgroundSecondary}]}>
      <Text style={[styles.label, {color: theme.text}]}>{t('language')}</Text>
      <View style={styles.buttons}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              selectedLang === lang.code && {backgroundColor: theme.buttonBlue},
            ]}
            onPress={() => changeLanguage(lang.code)}>
            <Text
              style={[
                selectedLang === lang.code ? styles.selectedText : styles.text,
                {color: theme.text},
              ]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
