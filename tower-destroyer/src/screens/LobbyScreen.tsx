import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../game/constants';
import { useGame } from '../context/GameContext';
import { Player } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Lobby'>;

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export function LobbyScreen({ route, navigation }: Props) {
  const { roomId, playerId } = route.params;
  const { state, startGame, leaveRoom } = useGame();
  const [isStarting, setIsStarting] = useState(false);

  const room = state.currentRoom;
  const currentPlayer = room?.players.find(p => p.id === playerId);
  const playerIsHost = room?.hostId === playerId;

  // Check if game has started
  useEffect(() => {
    if (room?.isStarted || state.isGameStarted) {
      navigation.replace('GameScreen', { roomId, playerId });
    }
  }, [room?.isStarted, state.isGameStarted]);

  // Handle leaving the room
  const handleLeave = async () => {
    Alert.alert(
      'Leave Room',
      'Are you sure you want to leave?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: async () => {
            await leaveRoom();
            navigation.navigate('StartScreen');
          }
        }
      ]
    );
  };

  // Handle starting the game (host only)
  const handleStartGame = async () => {
    if (!playerIsHost) return;

    if (room && room.players.length < 2) {
      Alert.alert('Not Enough Players', 'Need at least 2 players to start the game.');
      return;
    }

    setIsStarting(true);
    const result = await startGame();
    setIsStarting(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to start game');
    }
  };

  // Copy room code to clipboard (for sharing)
  const handleShareCode = () => {
    if (room?.code) {
      Alert.alert(
        '📤 Share Room Code',
        `Share this code with your friend:\n\n    ${room.code}\n\nThey can join from the Join Room screen!`,
        [{ text: 'Got it!' }]
      );
    }
  };

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const isCurrentPlayer = item.id === playerId;
    const isPlayerHost = item.isHost;

    return (
      <View style={[styles.playerItem, isCurrentPlayer && styles.currentPlayerItem]}>
        <View style={[styles.playerAvatar, isPlayerHost && styles.hostAvatar]}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerStatus}>
            {isPlayerHost ? '👑 Host' : '⚔️ Ready'}
          </Text>
        </View>
        {isCurrentPlayer && (
          <View style={styles.youBadge}>
            <Text style={styles.youText}>YOU</Text>
          </View>
        )}
      </View>
    );
  };

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundOverlay} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>😕</Text>
          <Text style={styles.errorText}>Room not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('StartScreen')}
          >
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundOverlay} />

      {/* Leave Button */}
      <TouchableOpacity 
        style={styles.leaveButton}
        onPress={handleLeave}
        activeOpacity={0.7}
      >
        <Text style={styles.leaveButtonText}>← Leave</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.lobbyTitle}>GAME LOBBY</Text>
          <Text style={styles.roomName}>{room.name}</Text>
          
          <TouchableOpacity style={styles.roomCode} onPress={handleShareCode}>
            <Text style={styles.codeLabel}>ROOM CODE</Text>
            <Text style={styles.codeValue}>{room.code}</Text>
            <Text style={styles.tapToShare}>tap to share</Text>
          </TouchableOpacity>
        </View>

        {/* Players Section */}
        <View style={styles.playersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PLAYERS</Text>
            <View style={styles.playerCount}>
              <Text style={styles.playerCountText}>{room.players.length}/{room.maxPlayers}</Text>
            </View>
          </View>
          
          <FlatList
            data={room.players}
            renderItem={renderPlayer}
            keyExtractor={item => item.id}
            style={styles.playersList}
            contentContainerStyle={styles.playersListContent}
          />
          
          {room.players.length < room.maxPlayers && (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingText}>
                Waiting for opponent to join...
              </Text>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        {playerIsHost ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.startButton,
              (room.players.length < 2 || isStarting) && styles.buttonDisabled
            ]}
            onPress={handleStartGame}
            disabled={room.players.length < 2 || isStarting}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {isStarting ? '⏳ STARTING...' : room.players.length < 2 ? '⏳ WAITING FOR PLAYERS' : '🎮 START GAME'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.actionButton, styles.waitingButton]}>
            <Text style={styles.waitingButtonText}>⏳ Waiting for host to start...</Text>
          </View>
        )}

        {/* Weapons Preview */}
        <View style={styles.weaponsContainer}>
          <Text style={styles.weaponsTitle}>AVAILABLE WEAPONS</Text>
          <View style={styles.weaponsRow}>
            <View style={styles.weaponBadge}>
              <Text style={styles.weaponEmoji}>⚡</Text>
              <Text style={styles.weaponName}>Laser</Text>
            </View>
            <View style={styles.weaponBadge}>
              <Text style={styles.weaponEmoji}>💣</Text>
              <Text style={styles.weaponName}>Bomb</Text>
            </View>
            <View style={styles.weaponBadge}>
              <Text style={styles.weaponEmoji}>🔫</Text>
              <Text style={styles.weaponName}>Gun</Text>
            </View>
            <View style={styles.weaponBadge}>
              <Text style={styles.weaponEmoji}>🚀</Text>
              <Text style={styles.weaponName}>Rocket</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.6,
  },
  leaveButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    zIndex: 10,
  },
  leaveButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lobbyTitle: {
    fontSize: isSmallDevice ? 12 : 14,
    color: COLORS.textSecondary,
    letterSpacing: 4,
    marginBottom: 4,
  },
  roomName: {
    fontSize: isSmallDevice ? 24 : 30,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  roomCode: {
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(108, 92, 231, 0.25)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  codeLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  codeValue: {
    fontSize: isSmallDevice ? 28 : 36,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 6,
    marginTop: 4,
  },
  tapToShare: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  playersSection: {
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 92, 231, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    fontWeight: '600',
  },
  playerCount: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playerCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  playersList: {
    maxHeight: isSmallDevice ? 120 : 160,
  },
  playersListContent: {
    gap: 8,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.15)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  currentPlayerItem: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
  },
  playerAvatar: {
    width: isSmallDevice ? 40 : 46,
    height: isSmallDevice ? 40 : 46,
    borderRadius: isSmallDevice ? 20 : 23,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hostAvatar: {
    backgroundColor: COLORS.accent,
  },
  avatarText: {
    fontSize: isSmallDevice ? 18 : 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  playerStatus: {
    fontSize: isSmallDevice ? 12 : 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  youText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
  },
  waitingContainer: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  waitingText: {
    fontSize: isSmallDevice ? 13 : 14,
    color: COLORS.textSecondary,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  dot1: { opacity: 0.3 },
  dot2: { opacity: 0.6 },
  dot3: { opacity: 1 },
  actionButton: {
    borderRadius: 14,
    paddingVertical: isSmallDevice ? 14 : 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(108, 92, 231, 0.3)',
    borderColor: 'rgba(162, 155, 254, 0.3)',
  },
  actionButtonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  waitingButton: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  waitingButtonText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  weaponsContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  weaponsTitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 10,
  },
  weaponsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weaponBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  weaponEmoji: {
    fontSize: isSmallDevice ? 20 : 24,
  },
  weaponName: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
