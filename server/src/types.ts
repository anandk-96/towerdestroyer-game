// Player Types
export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: Date;
}

// Game State
export interface GameState {
  towers: Record<string, number>;
  lastFireAt: Record<string, number>;
  isGameOver: boolean;
  winnerId: string | null;
}

// Room Types
export interface Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  isStarted: boolean;
  gameState?: GameState;
  createdAt: Date;
}


// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateRoomResponse {
  room: Room;
  playerId: string;
}

export interface JoinRoomResponse {
  room: Room;
  playerId: string;
}
