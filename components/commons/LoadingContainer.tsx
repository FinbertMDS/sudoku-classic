// src/components/commons/LoadingContainer.tsx

import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const LoadingContainer = () => {
  const {theme} = useTheme();

  return (
    <View
      style={[styles.loadingContainer, {backgroundColor: theme.background}]}>
      <ActivityIndicator size="large" color={theme.secondary} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
});

export default LoadingContainer;
