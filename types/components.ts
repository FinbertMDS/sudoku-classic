import { RouteProp } from '@react-navigation/native';
import { Level } from '.';

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: BoardParamProps;
  Options: undefined;
  Settings: SettingsParamProps;
  HowToPlay: undefined;
  AboutGame: undefined;
  Licenses: undefined;
  SkWebView: SkWebViewParamProps;
};

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;
export type SkWebViewScreenRouteProp = RouteProp<
  RootStackParamList,
  'SkWebView'
>;

export type BoardParamProps = {
  id: string;
  level: Level;
  type: 'init' | 'saved';
};

export type SettingsParamProps = {
  showAdvancedSettings?: boolean;
};

export type SkWebViewParamProps = {
  title: string;
  type: SkWebViewType;
  needPadding?: boolean;
};

export type SkWebViewType = 'licenses' | 'privacy' | 'terms';

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

export type DailyQuotes = {
  q: string;
  a: string;
  h: string;
  date?: string;
};

export type ActionButtonProps = {
  id: string;
  label: string;
  icon: string[];
  iconChangeFlag?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
  onPress?: () => void;
};
