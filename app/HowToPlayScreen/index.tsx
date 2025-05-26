import { useSafeGoBack } from '@/hooks/useSafeGoBack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import HowToPlay from '../../components/HowToPlay';

const HowToPlayScreen = () => {
  const goBack = useSafeGoBack();
  const { t } = useTranslation();
  return <HowToPlay headerTitle={t('howToPlay.title')} onClose={goBack} />;
};

export default HowToPlayScreen;
