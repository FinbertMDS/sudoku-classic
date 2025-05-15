// utils/navigation.ts
import { router, useNavigation } from 'expo-router';

export const safeGoBack = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigation = useNavigation();

  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    router.replace('/'); // Fallback về trang chính (ví dụ: tabs screen)
  }
};
