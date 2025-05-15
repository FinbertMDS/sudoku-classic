import {RouteProp} from '@react-navigation/native';
import {Level} from '.';

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: BoardParamProps;
  Options: undefined;
  Settings: SettingsParamProps;
  HowToPlay: undefined;
  AboutGame: undefined;
  Licenses: undefined;
};

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

export type BoardParamProps = {
  id: string;
  level: Level;
  type: 'init' | 'saved';
};

export type SettingsParamProps = {
  showAdvancedSettings?: boolean;
};

export type OptionMenuItem = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList;
  onPress?: () => void;
};

export type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export type DailyBackgrounds = {
  light: string | null;
  dark: string | null;
  date?: string;
};
