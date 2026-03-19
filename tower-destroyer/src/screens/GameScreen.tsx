import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { COLORS, WEAPONS, GAME_CONFIG } from '../game/constants';
import { useGame } from '../context/GameContext';
import { WeaponType, Tower } from '../types/game';

type Props = NativeStackScreenProps<RootStackParamList, 'GameScreen'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function GameScreen({ route, navigation }: Props) {
  const { playerId } = route.params;
  const { state, fireWeapon, getTowerHealth, getEnemyHealth, getReloadRemaining } = useGame();
  
  const selectedWeapon: WeaponType = 'gun';
  const [reloadRemaining, setReloadRemaining] = useState(0);
  const [enemyName, setEnemyName] = useState('ENEMY');
  
  // Game state
  const [playerTower, setPlayerTower] = useState<Tower>({
    id: 'player-tower',
    health: GAME_CONFIG.TOWER_MAX_HEALTH,
    maxHealth: GAME_CONFIG.TOWER_MAX_HEALTH,
    position: { x: 50, y: SCREEN_HEIGHT - 350 },
    width: GAME_CONFIG.TOWER_WIDTH,
    height: GAME_CONFIG.TOWER_HEIGHT,
    blocks: [],
  });
  
  const [enemyTower, setEnemyTower] = useState<Tower>({
    id: 'enemy-tower',
    health: GAME_CONFIG.TOWER_MAX_HEALTH,
    maxHealth: GAME_CONFIG.TOWER_MAX_HEALTH,
    position: { x: SCREEN_WIDTH - 170, y: SCREEN_HEIGHT - 350 },
    width: GAME_CONFIG.TOWER_WIDTH,
    height: GAME_CONFIG.TOWER_HEIGHT,
    blocks: [],
  });

  // Sync tower health and reload
  useEffect(() => {
    const interval = setInterval(() => {
      setReloadRemaining(getReloadRemaining());
    }, 200);

    return () => clearInterval(interval);
  }, [getReloadRemaining]);

  useEffect(() => {
    if (!playerId || !state.currentRoom) {
      return;
    }

    const currentPlayerHealth = getTowerHealth(playerId);
    const enemy = state.currentRoom.players.find(player => player.id !== playerId);
    const enemyHealth = enemy ? getTowerHealth(enemy.id) : getEnemyHealth();

    setPlayerTower(prev => ({
      ...prev,
      health: currentPlayerHealth,
      maxHealth: GAME_CONFIG.TOWER_MAX_HEALTH,
    }));

    setEnemyTower(prev => ({
      ...prev,
      health: enemyHealth,
      maxHealth: GAME_CONFIG.TOWER_MAX_HEALTH,
    }));

    if (enemy) {
      setEnemyName(enemy.name.toUpperCase());
    }
  }, [state.gameState, state.currentRoom, playerId, getTowerHealth, getEnemyHealth]);

  const handleFire = async () => {
    if (reloadRemaining > 0 || state.gameState?.isGameOver) {
      return;
    }

    await fireWeapon();
  };

  const getReloadPercentage = (): number => {
    const weapon = WEAPONS.gun;
    if (weapon.cooldown <= 0) {
      return 0;
    }
    return reloadRemaining / weapon.cooldown;
  };

  const renderWeaponButton = (weaponType: WeaponType) => {
    const weapon = WEAPONS[weaponType];
    const isSelected = selectedWeapon === weaponType;
    const isDisabled = weaponType !== 'gun';

    return (
      <View key={weaponType} style={styles.weaponButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.weaponButton,
            isSelected && styles.weaponSelected,
            isDisabled && styles.weaponOnCooldown,
          ]}
          activeOpacity={0.7}
          disabled={isDisabled}
        >
          <Text style={styles.weaponIcon}>{weapon.icon}</Text>
          <Text style={styles.weaponName}>{weapon.name}</Text>
          {weaponType === 'gun' && reloadRemaining > 0 && (
            <View style={styles.cooldownOverlay}>
              <View 
                style={[
                  styles.cooldownFill, 
                  { height: `${getReloadPercentage() * 100}%` }
                ]} 
              />
            </View>
          )}
          <Text style={styles.weaponDamage}>DMG: {weapon.damage}</Text>
        </TouchableOpacity>
        {isDisabled && <Text style={styles.weaponLocked}>LOCKED</Text>}
      </View>
    );
  };

  const renderTower = (tower: Tower, isEnemy: boolean) => {
    const healthPercent = tower.health / tower.maxHealth;
    const healthColor = healthPercent > 0.6 
      ? COLORS.healthHigh 
      : healthPercent > 0.3 
        ? COLORS.healthMedium 
        : COLORS.healthLow;

    return (
      <View style={[styles.towerContainer, isEnemy && styles.towerEnemy]}>
        {/* Health bar */}
        <View style={styles.healthBarContainer}>
          <View style={styles.healthBarBackground}>
            <View 
              style={[
                styles.healthBarFill, 
                { width: `${healthPercent * 100}%`, backgroundColor: healthColor }
              ]} 
            />
          </View>
          <Text style={styles.healthText}>
            {Math.round(tower.health)}/{tower.maxHealth}
          </Text>
        </View>

        {/* Tower structure */}
        <View style={styles.towerStructure}>
          {[...Array(8)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.towerBlock,
                { opacity: Math.min(1, (tower.health / tower.maxHealth) + (i * 0.1)) },
                isEnemy && styles.towerBlockEnemy,
              ]} 
            />
          ))}
        </View>

        {/* Player name */}
        <Text style={styles.towerLabel}>
          {isEnemy ? enemyName : 'YOU'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.gameBackground}>
        {/* Ground */}
        <View style={styles.ground} />
        
        {/* Sky gradient effect */}
        <View style={styles.sky} />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>YOUR TOWER: {Math.round(playerTower.health)} HP</Text>
        <Text style={styles.statusText}>{enemyName}: {Math.round(enemyTower.health)} HP</Text>
      </View>

      {/* Game area */}
      <View style={styles.gameArea}>
        {/* Player tower */}
        {renderTower(playerTower, false)}

        {/* VS indicator */}
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>⚔️ VS ⚔️</Text>
        </View>

        {/* Enemy tower */}
        {renderTower(enemyTower, true)}
      </View>

      {/* Weapon selection */}
      <View style={styles.weaponPanel}>
        <Text style={styles.panelTitle}>
          {reloadRemaining > 0 ? `GUN READY IN ${Math.ceil(reloadRemaining / 1000)}s` : 'GUN READY'}
        </Text>
        <View style={styles.weaponsRow}>
          {(Object.keys(WEAPONS) as WeaponType[]).map(renderWeaponButton)}
        </View>
      </View>

      {/* Fire button */}
      <TouchableOpacity
        style={[
          styles.fireButton,
          reloadRemaining > 0 && styles.fireButtonDisabled,
        ]}
        onPress={handleFire}
        disabled={reloadRemaining > 0 || state.gameState?.isGameOver}
        activeOpacity={0.8}
      >
        <Text style={styles.fireButtonText}>
          {state.gameState?.isGameOver
            ? 'GAME OVER'
            : reloadRemaining > 0 
              ? `RELOAD ${Math.ceil(reloadRemaining / 1000)}s` 
              : '🔫 FIRE!'}
        </Text>
      </TouchableOpacity>

      {/* Pause button */}
      <TouchableOpacity
        style={styles.pauseButton}
        onPress={() => navigation.navigate('StartScreen')}
      >
        <Text style={styles.pauseText}>⏸️</Text>
      </TouchableOpacity>

      {state.gameState?.isGameOver && state.winnerId && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverTitle}>GAME OVER</Text>
          <Text style={styles.gameOverSubtitle}>
            {state.winnerId === playerId ? 'YOU WIN!' : `${enemyName} WINS!`}
          </Text>
          <TouchableOpacity
            style={styles.gameOverButton}
            onPress={() => navigation.navigate('StartScreen')}
          >
            <Text style={styles.gameOverButtonText}>RETURN TO MENU</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gameBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: COLORS.backgroundSecondary,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#2d3436',
    borderTopWidth: 4,
    borderTopColor: '#636e72',
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 150,
  },
  towerContainer: {
    alignItems: 'center',
  },
  towerEnemy: {
    // Enemy tower specific styles
  },
  healthBarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  healthBarBackground: {
    width: 100,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  healthBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  healthText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  towerStructure: {
    alignItems: 'center',
  },
  towerBlock: {
    width: 80,
    height: 30,
    backgroundColor: COLORS.towerBlock,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.tower,
  },
  towerBlockEnemy: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accent,
  },
  towerLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 2,
  },
  vsContainer: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  weaponPanel: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  panelTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 10,
  },
  weaponsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  weaponButtonWrapper: {
    alignItems: 'center',
  },
  weaponButton: {
    width: 80,
    height: 90,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    overflow: 'hidden',
  },
  weaponLocked: {
    marginTop: 6,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  weaponSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(108, 92, 231, 0.3)',
  },
  weaponOnCooldown: {
    opacity: 0.7,
  },
  weaponIcon: {
    fontSize: 28,
  },
  weaponName: {
    fontSize: 10,
    color: COLORS.text,
    marginTop: 4,
    fontWeight: '600',
  },
  weaponDamage: {
    fontSize: 9,
    color: COLORS.accent,
    marginTop: 2,
  },
  cooldownOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cooldownFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },
  fireButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    height: 60,
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.accentLight,
  },
  fireButtonDisabled: {
    backgroundColor: 'rgba(233, 69, 96, 0.5)',
    borderColor: 'rgba(255, 107, 107, 0.5)',
  },
  fireButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 2,
  },
  pauseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    fontSize: 24,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 3,
    marginBottom: 12,
  },
  gameOverSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  gameOverButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  gameOverButtonText: {
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
