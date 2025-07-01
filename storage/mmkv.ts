// storage/mmkv.ts
import {Platform} from 'react-native';

const storage = Platform.select({
  ios: () => require('./mmkv.native').storage,
  android: () => require('./mmkv.native').storage,
  web: () => require('./mmkv.web').storage,
});

export default storage;
