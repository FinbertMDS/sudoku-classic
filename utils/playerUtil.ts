import uuid from 'react-native-uuid';
import {getLanguage} from '../i18n/i18n';
import {PlayerProfile} from '../types/player';
import {getRandomColorKey} from './colorUtil';
import {DEFAULT_PLAYER_ID} from './constants';

const generatePlayerId = () => {
  let id = uuid.v4().toString();
  while (id === DEFAULT_PLAYER_ID) {
    id = uuid.v4().toString();
  }
  return id;
};

export const createNewPlayer = (name: string): PlayerProfile => ({
  id: generatePlayerId(),
  name,
  avatarColor: getRandomColorKey(),
  createdAt: new Date().toISOString(),
  totalGames: 0,
});

export const createDefaultPlayer = (totalGames: number): PlayerProfile => {
  let language = getLanguage();

  let defaultPlayerName;
  switch (language) {
    case 'ja':
      defaultPlayerName = 'プレイヤー';
      break;
    case 'vi':
      defaultPlayerName = 'Người chơi';
      break;
    default:
      defaultPlayerName = 'Player';
  }

  return {
    id: DEFAULT_PLAYER_ID,
    name: defaultPlayerName,
    avatarColor: getRandomColorKey(),
    createdAt: new Date().toISOString(),
    totalGames,
  };
};
