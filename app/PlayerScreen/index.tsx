import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import CreatePlayerModal from '../../components/Player/CreatePlayerModal';
import PlayerCard from '../../components/Player/PlayerCard';
import { useTheme } from '../../context/ThemeContext';
import { CORE_EVENTS } from '../../events';
import eventBus from '../../events/eventBus';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';
import { useSafeGoBack } from '../../hooks/useSafeGoBack';
import { PlayerService } from '../../services/PlayerService';
import { PlayerProfile } from '../../types/player';
import { DEFAULT_PLAYER_ID } from '../../utils/constants';
import { createNewPlayer } from '../../utils/playerUtil';

const PlayerScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    allPlayers,
    switchPlayer,
    player,
    deletePlayer,
    createPlayer,
    updatePlayerName,
  } = usePlayerProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerProfile | null>(
    null,
  );

  const goBack = useSafeGoBack();

  const handleSelect = (id: string) => {
    switchPlayer(id);
    eventBus.emit(CORE_EVENTS.switchPlayer, id);
    goBack();
  };
  const handleEdit = (_player: PlayerProfile) => {
    setEditingPlayer(_player);
    setShowCreateModal(true);
  };

  const handleModalSubmit = (mode: 'create' | 'edit', newName: string) => {
    if (!newName.trim()) {
      return;
    }
    if (mode === 'create' || editingPlayer?.id === DEFAULT_PLAYER_ID) {
      const newPlayer: PlayerProfile = createNewPlayer(newName);
      createPlayer(newPlayer);
      switchPlayer(newPlayer.id);
      if (editingPlayer?.id === DEFAULT_PLAYER_ID) {
        eventBus.emit(CORE_EVENTS.defaultPlayerUpdated, newPlayer.id);
      }
      goBack();
    } else {
      if (editingPlayer) {
        updatePlayerName(editingPlayer.id, newName);
      }
      goBack();
    }
  };

  const handleDelete = (id: string) => {
    if (!PlayerService.canDeletePlayer(id)) {
      Alert.alert(t('cannotDeletePlayerTitle'), t('cannotDeletePlayerMessage'));
      return;
    }
    Alert.alert(t('deletePlayerTitle'), t('deletePlayerMessage'), [
      { text: t('cancelBtn'), style: 'cancel' },
      {
        text: t('deleteBtn'),
        style: 'destructive',
        onPress: () => {
          deletePlayer(id);
          eventBus.emit(CORE_EVENTS.deletePlayer, id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Header
        title={t('players')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      <ScrollView
        style={[
          styles.contentContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {t('selectPlayerTitle')}
        </Text>
        {allPlayers.map((p) => (
          <PlayerCard
            key={p.id}
            player={p}
            isSelected={p.id === player?.id}
            canDelete={p.id !== DEFAULT_PLAYER_ID}
            onPress={() => handleSelect(p.id)}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={styles.button}
        >
          <Text style={[styles.buttonText, { color: theme.buttonBlue }]}>
            {t('addPlayerBtn')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {showCreateModal && (
        <CreatePlayerModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingPlayer(null);
          }}
          initialName={editingPlayer?.name ?? ''}
          onSubmit={handleModalSubmit}
          mode={editingPlayer ? 'edit' : 'create'}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default PlayerScreen;
