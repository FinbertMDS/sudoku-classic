import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.primary,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('main'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="StatisticsScreen"
        options={{
          tabBarLabel: t('statistics'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
