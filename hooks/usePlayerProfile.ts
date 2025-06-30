// src/hooks/usePlayerProfile.ts

import {useEffect, useState} from 'react';
import {PlayerService} from '../services';
import {PlayerProfile} from '../types';

export const usePlayerProfile = () => {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [allPlayers, setAllPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    reloadPlayer();
    reloadAllPlayers();
  }, []);

  const switchPlayer = async (id: string) => {
    await PlayerService.setCurrentPlayerId(id);
    reloadPlayer();
  };

  const deletePlayer = async (id: string) => {
    await PlayerService.deletePlayer(id);
    reloadAllPlayers();
  };

  const createPlayer = async (profile: PlayerProfile) => {
    await PlayerService.createPlayer(profile);
    reloadAllPlayers();
  };

  const updatePlayerName = async (id: string, name: string) => {
    await PlayerService.updatePlayerName(id, name);
    reloadAllPlayers();
  };

  const reloadPlayer = async () => {
    const _player = await PlayerService.getCurrentPlayer();
    setPlayer(_player);
  };

  const reloadAllPlayers = async () => {
    const all = await PlayerService.getAllPlayers();
    setAllPlayers(all);
  };

  return {
    player,
    allPlayers,
    switchPlayer,
    createPlayer,
    deletePlayer,
    updatePlayerName,
    reloadPlayer,
    reloadAllPlayers,
  };
};
