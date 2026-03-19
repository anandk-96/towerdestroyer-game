import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../game/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export function GameOverScreen({ route, navigation }: Props) {
  const { winner } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundOverlay} />
      
      {/* Victory particles effect */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.particle, 
              { 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? COLORS.primary : COLORS.accent,
              }
            ]} 
          />
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.victoryText}>🏆 VICTORY! 🏆</Text>
        
        <View style={styles.winnerContainer}>
          <View style={styles.crownIcon}>
            <Text style={styles.crownText}>👑</Text>
          </View>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerText}>Tower Destroyer Champion</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1000</Text>
            <Text style={styles.statLabel}>SCORE</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>DEATHS</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1st</Text>
            <Text style={styles.statLabel}>RANK</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={() => navigation.navigate('StartScreen')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🎮 PLAY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.mainMenuButton]}
            onPress={() => navigation.navigate('StartScreen')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>🏠 MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.7,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
  victoryText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 30,
    letterSpacing: 4,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  crownIcon: {
    marginBottom: 10,
  },
  crownText: {
    fontSize: 60,
  },
  winnerName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 2,
  },
  winnerText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 50,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginTop: 5,
  },
  buttonsContainer: {
    gap: 15,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: COLORS.accent,
    borderWidth: 3,
    borderColor: COLORS.accentLight,
  },
  mainMenuButton: {
    backgroundColor: 'rgba(108, 92, 231, 0.3)',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 2,
  },
});
