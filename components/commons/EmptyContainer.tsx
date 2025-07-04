// src/components/commons/EmptyContainer.tsx

import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

type EmptyContainerProps = {
  text?: string;
};

const EmptyContainer = ({text}: EmptyContainerProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  if (text) {
    return (
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={[styles.title, {color: theme.text}]}>{text}</Text>
        <Text style={[{color: theme.text}]}>{t('noDataAvailable')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, {color: theme.secondary}]}>
        {t('noDataAvailable')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default EmptyContainer;
