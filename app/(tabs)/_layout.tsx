import {useTheme} from '@/context/ThemeContext';
import {Ionicons} from '@expo/vector-icons';
import {Tabs} from 'expo-router';
import React from 'react';
import {useTranslation} from 'react-i18next';

const icons: any = {
  index: 'home',
  StatisticsScreen: 'bar-chart',
  LeaderboardScreen: 'trophy',
};

export default function TabLayout() {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <Tabs
      screenOptions={({route}) => ({
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
        tabBarIcon: ({color, size}) => {
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
      })}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('main'),
        }}
      />
      <Tabs.Screen
        name="StatisticsScreen"
        options={{
          tabBarLabel: t('statistics'),
        }}
      />
      <Tabs.Screen
        name="LeaderboardScreen"
        options={{
          tabBarLabel: t('leaderboard'),
        }}
      />
    </Tabs>
  );
}
