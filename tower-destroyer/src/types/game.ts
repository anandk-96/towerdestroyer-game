// Weapon Types
export type WeaponType = 'laser' | 'bomb' | 'gun' | 'rocket';

export interface Weapon {
  id: string;
  type: WeaponType;
  name: string;
  damage: number;
  cooldown: number; // in milliseconds
  lastUsed: number;
  range: number;
  speed: number;
  icon: string;
}

export interface Tower {
  id: string;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  width: number;
  height: number;
  blocks: TowerBlock[];
}

export interface TowerBlock {
  id: string;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  width: number;
  height: number;
  isDestroyed: boolean;
}

export interface Player {
  id: string;
  name: string;
  tower: Tower;
  weapons: Weapon[];
  selectedWeapon: WeaponType;
  score: number;
}

export interface Projectile {
  id: string;
  weaponType: WeaponType;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
  playerId: string;
}

export interface GameState {
  players: Player[];
  projectiles: Projectile[];
  isGameOver: boolean;
  winner: string | null;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  isStarted: boolean;
  createdAt: Date;
}

// Game Events
export type GameEventType = 
  | 'PLAYER_JOIN'
  | 'PLAYER_LEAVE'
  | 'GAME_START'
  | 'WEAPON_FIRE'
  | 'PROJECTILE_HIT'
  | 'TOWER_DAMAGE'
  | 'TOWER_DESTROYED'
  | 'GAME_OVER';

export interface GameEvent {
  type: GameEventType;
  payload: any;
  timestamp: number;
}
