// components/Player/PlayerCard.tsx
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {PlayerProfile} from '../../types/player';
import {getAvatarColor, PlayerColorKey} from '../../utils/colorUtil';
import {DEFAULT_PLAYER_ID} from '../../utils/constants';

type PlayerCardProps = {
  player: PlayerProfile;
  isSelected: boolean;
  canDelete: boolean;
  onPress: () => void;
  onDelete: (id: string) => void;
  onEdit: (player: PlayerProfile) => void;
};

const PlayerCard = ({
  player,
  isSelected,
  canDelete,
  onPress,
  onDelete,
  onEdit,
}: PlayerCardProps) => {
  const {t} = useTranslation();
  const {mode, theme} = useTheme();
  const bgColor = getAvatarColor(player.avatarColor as PlayerColorKey, mode);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {backgroundColor: theme.background},
        isSelected && [
          {
            borderWidth: 1,
            borderColor: theme.buttonBlue,
            backgroundColor: theme.selectedCardBg,
          },
        ],
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.avatar,
          {backgroundColor: bgColor},
          isSelected && [
            styles.selectedAvatar,
            {borderColor: theme.buttonBlue},
          ],
        ]}>
        <Text style={styles.avatarText}>
          {player.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, {color: theme.text}]}>
          {player.name} {player.id === DEFAULT_PLAYER_ID && t('defaultPlayer')}
        </Text>
        <Text style={[styles.subtext, {color: theme.secondary}]}>
          {t('gamesCount', {count: player.totalGames})}
        </Text>
      </View>
      <TouchableOpacity style={[styles.button]} onPress={() => onEdit(player)}>
        <MaterialCommunityIcons name="pencil" size={20} color={theme.text} />
      </TouchableOpacity>
      {!isSelected && canDelete && (
        <TouchableOpacity
          onPress={() => onDelete(player.id)}
          style={styles.button}>
          <Ionicons name="trash" size={20} color={theme.danger} />
        </TouchableOpacity>
      )}
      {isSelected && (
        <View style={styles.button}>
          <View style={[styles.checkMark, {backgroundColor: theme.buttonBlue}]}>
            <Text style={[styles.checkText, {color: theme.text}]}>✓</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedAvatar: {
    borderWidth: 1,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 13,
    marginTop: 4,
  },
  checkMark: {
    width: 22,
    height: 22,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 16,
  },
  button: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(PlayerCard);
