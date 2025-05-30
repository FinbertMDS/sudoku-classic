import React from 'react';
import { useTranslation } from 'react-i18next';
import { HowToPlay } from '../../components/HowToPlay';
import { useSafeGoBack } from '../../hooks/useSafeGoBack';

const HowToPlayScreen = () => {
  const goBack = useSafeGoBack();
  const { t } = useTranslation();

  return (
    <HowToPlay headerTitle={t('howToPlay.title')} onClose={() => goBack} />
  );
};

export default HowToPlayScreen;
