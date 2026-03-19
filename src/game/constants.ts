import { Weapon } from '../types/game';

export const GAME_CONFIG = {
  // Screen dimensions (will be updated at runtime)
  SCREEN_WIDTH: 800,
  SCREEN_HEIGHT: 600,
  
  // Tower settings
  TOWER_WIDTH: 120,
  TOWER_HEIGHT: 300,
  TOWER_BLOCK_WIDTH: 40,
  TOWER_BLOCK_HEIGHT: 30,
  TOWER_MAX_HEALTH: 100,
  
  // Player settings
  PLAYER_STARTING_HEALTH: 100,
  
  // Physics
  GRAVITY: 0.5,
  AIR_RESISTANCE: 0.99,
  
  // Game timing
  TICK_RATE: 1000 / 60, // 60 FPS
};

export const WEAPONS: Record<string, Omit<Weapon, 'id' | 'lastUsed'>> = {
  laser: {
    type: 'laser',
    name: 'Laser Beam',
    damage: 15,
    cooldown: 500, // 0.5 seconds
    range: 500,
    speed: 20,
    icon: '⚡',
  },
  bomb: {
    type: 'bomb',
    name: 'Bomb',
    damage: 100,
    cooldown: 3000, // 3 seconds
    range: 300,
    speed: 8,
    icon: '💣',
  },
  gun: {
    type: 'gun',
    name: 'Machine Gun',
    damage: 10,
    cooldown: 3000, // 3 seconds
    range: 400,
    speed: 15,
    icon: '🔫',
  },
  rocket: {
    type: 'rocket',
    name: 'Rocket Launcher',
    damage: 75,
    cooldown: 2000, // 2 seconds
    range: 600,
    speed: 12,
    icon: '🚀',
  },
};

export const COLORS = {
  // Primary colors
  primary: '#6c5ce7',
  secondary: '#a29bfe',
  
  // Background colors
  background: '#1a1a2e',
  backgroundSecondary: '#16213e',
  
  // Accent colors
  accent: '#e94560',
  accentLight: '#ff6b6b',
  
  // UI colors
  text: '#ffffff',
  textSecondary: '#b2b2b2',
  
  // Game element colors
  tower: '#4a69bd',
  towerBlock: '#6a89cc',
  towerDamaged: '#e55039',
  
  // Weapon colors
  laser: '#00ff00',
  bomb: '#ff4444',
  gun: '#ffaa00',
  rocket: '#ff6600',
  
  // Health bar colors
  healthHigh: '#26de81',
  healthMedium: '#fed330',
  healthLow: '#fc5c65',
};
