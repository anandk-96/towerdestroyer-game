import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../game/constants';
import { useGame } from '../context/GameContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'JoinRoom'>;

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export function JoinRoomScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { joinRoom } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      Alert.alert('Invalid Input', 'Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      Alert.alert('Invalid Input', 'Please enter a room code');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
      
      if (result.success && result.room) {
        navigation.navigate('Lobby', { 
          roomId: result.room.id,
          playerId: result.playerId 
        });
      } else {
        Alert.alert('Error', result.error || 'Invalid room code. Please check and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundOverlay} />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.pageTitle}>JOIN ROOM</Text>
              <Text style={styles.pageSubtitle}>Enter a room code to join</Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={playerName}
                  onChangeText={setPlayerName}
                  maxLength={15}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Room Code</Text>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="XXXXXX"
                  placeholderTextColor={COLORS.textSecondary}
                  value={roomCode}
                  onChangeText={setRoomCode}
                  maxLength={6}
                  autoCapitalize="characters"
                  keyboardType="default"
                />
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🚪</Text>
                  <Text style={styles.infoText}>Enter the code from the host</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>⏳</Text>
                  <Text style={styles.infoText}>Wait for host to start the game</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.joinButton, isLoading && styles.buttonDisabled]}
                onPress={handleJoinRoom}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.joinButtonText}>
                  {isLoading ? '⏳ JOINING...' : '🚪 JOIN ROOM'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
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
  backButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: isSmallDevice ? 28 : 34,
    fontWeight: '900',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    letterSpacing: 3,
  },
  pageSubtitle: {
    fontSize: isSmallDevice ? 12 : 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: isSmallDevice ? 13 : 14,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 12,
    padding: 14,
    fontSize: isSmallDevice ? 15 : 16,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: COLORS.accentLight,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '800',
    letterSpacing: 6,
  },
  infoBox: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: COLORS.textSecondary,
  },
  joinButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: isSmallDevice ? 14 : 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accentLight,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(233, 69, 96, 0.4)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  joinButtonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
});
