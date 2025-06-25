import {useSafeGoBack} from '@/hooks/useSafeGoBack';
import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ConfirmDialog from '../../components/commons/ConfirmDialog';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {CORE_EVENTS} from '../../events';
import eventBus from '../../events/eventBus';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import {SettingsService} from '../../services/SettingsService';
import {AppSettings, SettingsParamProps} from '../../types';
import {DEFAULT_SETTINGS, MAX_MISTAKES} from '../../utils/constants';

const SettingsScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const rawParams = useLocalSearchParams();

  const {showAdvancedSettings} = useMemo(() => {
    return {
      showAdvancedSettings:
        typeof rawParams.showAdvancedSettings === 'string'
          ? rawParams.showAdvancedSettings === '1'
          : false,
    } as SettingsParamProps;
  }, [rawParams]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const goBack = useSafeGoBack();

  useEffect(() => {
    SettingsService.load().then((data) => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  useEffect(() => {
    SettingsService.save(settings);
  }, [settings]);

  const toggle = (key: string, value: boolean) => {
    setSettings((prev) => {
      const updated = SettingsService.normalizeSettings({
        ...prev,
        [key]: value,
      });
      eventBus.emit(CORE_EVENTS.settingsUpdated, updated as AppSettings);
      return updated;
    });
  };

  const labels = {
    // sounds: t('setting.sounds'),
    // autoLock: t('setting.autoLock'),
    timer: t('setting.timer'),
    // score: t('setting.score'),
    // statisticsMsg: t('setting.statisticsMsg'),
    // numberFirst: t('setting.numberFirst'),
    mistakeLimit: t('setting.mistakeLimit'),
    autoCheckMistake: t('setting.autoCheckMistake'),
    highlightDuplicates: t('setting.highlightDuplicates'),
    highlightAreas: t('setting.highlightAreas'),
    highlightIdenticalNumbers: t('setting.highlightIdenticalNumbers'),
    hideUsedNumbers: t('setting.hideUsedNumbers'),
    autoRemoveNotes: t('setting.autoRemoveNotes'),
  };

  const descriptions = {
    // statisticsMsg: t('desc.statisticsMsg'),
    // numberFirst: t('desc.numberFirst'),
    mistakeLimit: t('desc.mistakeLimit', {limit: MAX_MISTAKES}),
    autoCheckMistake: t('desc.autoCheckMistake'),
    highlightDuplicates: t('desc.highlightDuplicates'),
    highlightAreas: t('desc.highlightAreas'),
    highlightIdenticalNumbers: t('desc.highlightIdenticalNumbers'),
    hideUsedNumbers: t('desc.hideUsedNumbers'),
    autoRemoveNotes: t('desc.autoRemoveNotes'),
  };

  const handleClearStorage = async () => {
    eventBus.emit(CORE_EVENTS.clearStorage);
    goBack();
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <Header
        title={t('settings')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      {showConfirmDialog && (
        <ConfirmDialog
          title={t('clearDataTitle')}
          message={t('clearDataMessage')}
          cancelText={t('cancel')}
          confirmText={t('delete')}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={handleClearStorage}
        />
      )}
      <LanguageSwitcher />
      <ScrollView
        style={[
          styles.contentContainer,
          {backgroundColor: theme.backgroundSecondary},
        ]}
      >
        {Object.entries(labels).map(([key, label]) => (
          <View
            key={key}
            style={[
              styles.settingRow,
              {backgroundColor: theme.settingItemBackground},
            ]}
          >
            <View style={styles.labelContainer}>
              <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
              {descriptions[key as keyof typeof descriptions] && (
                <Text style={[styles.desc, {color: theme.secondary}]}>
                  {descriptions[key as keyof typeof descriptions]}
                </Text>
              )}
            </View>
            <Switch
              value={settings[key as keyof typeof DEFAULT_SETTINGS]}
              onValueChange={(value) => toggle(key, value)}
            />
          </View>
        ))}

        {showAdvancedSettings && (
          <TouchableOpacity
            style={[
              styles.deleteButton,
              {
                backgroundColor: theme.danger,
                borderColor: theme.buttonBorder,
              },
            ]}
            onPress={() => setShowConfirmDialog(true)}
          >
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>
              {t('clearStorage')}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: 'bold' as const,
  },
  bottomSpacer: {
    height: 16,
  },
});

export default SettingsScreen;
