import {useSafeGoBack} from '@/hooks/useSafeGoBack';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showTheme?: boolean;
  showCustom?: boolean;
  customIconCount?: number;
  custom?: React.ReactNode;
  onBack?: () => void;
  onSettings?: () => void;
  showSwitchPlayer?: boolean;
  onSwitchPlayer?: () => void;
};

const Header = ({
  title,
  showBack = false,
  showSettings = false,
  showTheme = true,
  showCustom = false,
  customIconCount = 0,
  custom = undefined,
  onBack = undefined,
  onSettings = undefined,
  showSwitchPlayer = false,
  onSwitchPlayer = undefined,
}: HeaderProps) => {
  const {theme, toggleTheme, mode} = useTheme();
  const goBack = useSafeGoBack();

  const defaultOnSettings = () => {
    router.push({
      pathname: '/OptionsScreen',
    });
  };

  const defaultOnBack = () => {
    goBack();
  };

  const getLeftSideCount = () => {
    let count = 0;
    if (showBack) {
      count++;
    }
    if (showSwitchPlayer) {
      count++;
    }
    return count;
  };

  const getRightSideCount = () => {
    let count = 0;
    if (showTheme) {
      count++;
    }
    if (showSettings) {
      count++;
    }
    if (customIconCount > 0) {
      count += customIconCount;
    }
    return count;
  };

  return (
    <View style={[styles.header, {backgroundColor: theme.background}]}>
      {getLeftSideCount() > 0 && (
        <View style={[styles.side, styles.left]}>
          {showBack && (
            <View style={styles.iconButton}>
              <TouchableOpacity onPress={onBack ? onBack : defaultOnBack}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={28}
                  color={theme.primary}
                />
              </TouchableOpacity>
            </View>
          )}
          {showSwitchPlayer && (
            <View style={[styles.iconButton]}>
              <TouchableOpacity onPress={onSwitchPlayer}>
                <MaterialCommunityIcons
                  name="account-switch"
                  size={24}
                  color={theme.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {/* nếu số icon ít của bên trái ít hơn bên phải, thì thêm các icon trống để cân bằng giữa 2 bên. số icon trống được thêm bằng số icon bên phải trừ số icon bên trái */}
      {getLeftSideCount() < getRightSideCount() &&
        Array.from({length: getRightSideCount() - getLeftSideCount()}).map(
          (_, index) => <View key={index} style={styles.iconButton} />,
        )}
      {title && (
        <View style={styles.center}>
          <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
        </View>
      )}
      {/* Right side */}
      {getRightSideCount() > 0 && (
        <View style={[styles.side, styles.right]}>
          {showCustom && custom ? <>{custom}</> : null}
          {showTheme && (
            <TouchableOpacity
              accessibilityLabel="ThemeButton"
              testID="ThemeButton"
              onPress={toggleTheme}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons
                name={mode === 'light' ? 'weather-night' : 'weather-sunny'}
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          )}
          {showSettings && (
            <TouchableOpacity
              accessibilityLabel="SettingsButton"
              testID="SettingsButton"
              onPress={onSettings ? onSettings : defaultOnSettings}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* nếu số icon ít của bên phải ít hơn bên trái, thì thêm các icon trống để cân bằng giữa 2 bên. số icon trống được thêm bằng số icon bên trái trừ số icon bên phải */}
      {getRightSideCount() < getLeftSideCount() &&
        Array.from({length: getLeftSideCount() - getRightSideCount()}).map(
          (_, index) => <View key={index} style={styles.side} />,
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
  },
  side: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  left: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
  },
  right: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
  },
  center: {
    flex: 1,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  iconButton: {
    width: 30,
    paddingHorizontal: 3,
  },
});

export default React.memo(Header);
