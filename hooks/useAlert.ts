import { useTranslation } from 'react-i18next';
import { Alert, AlertButton, AlertOptions, Platform } from 'react-native';

export const useAlert = () => {
  const { t } = useTranslation();

  const alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions,
  ) => {
    if (Platform.OS === 'web') {
      // Nếu có nhiều button, dùng confirm
      if (buttons?.length && buttons.length > 1) {
        const confirmButton = buttons.find((b) => b.style !== 'cancel');
        const cancelButton = buttons.find((b) => b.style === 'cancel');

        const confirmText = confirmButton?.text ?? t('ok');
        const cancelText = cancelButton?.text ?? t('cancel');

        const result = window.confirm(`${title}\n\n${message ?? ''}`);

        if (result) {
          confirmButton?.onPress?.();
        } else {
          cancelButton?.onPress?.();
        }
      } else if (buttons?.length === 1) {
        // Nếu chỉ có 1 button và có onPress, gọi khi alert bị đóng
        const button = buttons[0];
        window.alert(`${title}\n\n${message ?? ''}`);
        button?.onPress?.();
      } else {
        // Không có button, chỉ hiện alert đơn giản
        window.alert(`${title}\n\n${message ?? ''}`);
      }
    } else {
      // Native: dùng Alert như thường
      Alert.alert(
        title,
        message,
        buttons?.map((button) => ({
          ...button,
          text:
            button.text ?? (button.style === 'cancel' ? t('cancel') : t('ok')),
        })),
        options,
      );
    }
  };

  return { alert };
};
