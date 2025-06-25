import uuid from 'react-native-uuid';
import {PlayerProfile} from '../types/player';
import {getRandomColorKey} from './colorUtil';
import {DEFAULT_PLAYER_ID, DEFAULT_PLAYER_NAME} from './constants';

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

export const createDefaultPlayer = (totalGames: number): PlayerProfile => ({
  id: DEFAULT_PLAYER_ID,
  name: DEFAULT_PLAYER_NAME,
  avatarColor: getRandomColorKey(),
  createdAt: new Date().toISOString(),
  totalGames,
});
