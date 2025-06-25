import {useEffect, useState} from 'react';
import {playerProfileStorage} from '../storage';
import {PlayerProfile} from '../types/player';

export const usePlayerProfile = () => {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [allPlayers, setAllPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    const currentPlayer = playerProfileStorage.getCurrentPlayer();
    setPlayer(currentPlayer);
    const all = playerProfileStorage.getAllPlayers();
    setAllPlayers(all);
  }, []);

  const switchPlayer = (id: string) => {
    playerProfileStorage.setCurrentPlayerId(id);
    setPlayer(playerProfileStorage.getCurrentPlayer());
  };

  const deletePlayer = (id: string) => {
    const all = playerProfileStorage.getAllPlayers();
    const updated = all.filter((_player) => _player.id !== id);
    playerProfileStorage.savePlayers(updated);
    setAllPlayers(updated);
  };

  const createPlayer = (profile: PlayerProfile) => {
    const all = playerProfileStorage.getAllPlayers();
    const updated = [...all, profile];
    playerProfileStorage.savePlayers(updated);
    setAllPlayers(updated);
  };

  const updatePlayerName = (id: string, name: string) => {
    const all = playerProfileStorage.getAllPlayers();
    const updated = all.map((_player) =>
      _player.id === id ? {..._player, name} : _player,
    );
    playerProfileStorage.savePlayers(updated);
    setAllPlayers(updated);
  };

  const reloadPlayer = () => {
    setPlayer(playerProfileStorage.getCurrentPlayer());
  };

  const reloadAllPlayers = () => {
    setAllPlayers(playerProfileStorage.getAllPlayers());
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
