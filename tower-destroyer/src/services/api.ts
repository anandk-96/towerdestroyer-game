// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://your-production-server.com/api';

// Types
export interface GameState {
  towers: Record<string, number>;
  lastFireAt: Record<string, number>;
  isGameOver: boolean;
  winnerId: string | null;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  isStarted: boolean;
  gameState?: GameState;
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateRoomData {
  room: Room;
  playerId: string;
}

export interface JoinRoomData {
  room: Room;
  playerId: string;
}

// API Helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

// Room API
export const roomApi = {
  // Create a new room
  create: async (roomName: string, playerName: string): Promise<ApiResponse<CreateRoomData>> => {
    return apiRequest<CreateRoomData>('/rooms', {
      method: 'POST',
      body: JSON.stringify({ roomName, playerName }),
    });
  },

  // Join an existing room
  join: async (roomCode: string, playerName: string): Promise<ApiResponse<JoinRoomData>> => {
    return apiRequest<JoinRoomData>('/rooms/join', {
      method: 'POST',
      body: JSON.stringify({ roomCode, playerName }),
    });
  },

  // Get room by ID
  get: async (roomId: string): Promise<ApiResponse<{ room: Room }>> => {
    return apiRequest<{ room: Room }>(`/rooms/${roomId}`);
  },

  // Leave a room
  leave: async (roomId: string, playerId: string): Promise<ApiResponse<{ room?: Room }>> => {
    return apiRequest<{ room?: Room }>(`/rooms/${roomId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    });
  },

  // Start the game (host only)
  startGame: async (roomId: string, playerId: string): Promise<ApiResponse<{ room: Room }>> => {
    return apiRequest<{ room: Room }>(`/rooms/${roomId}/start`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    });
  },

  fireWeapon: async (roomId: string, playerId: string): Promise<ApiResponse<{ gameState: GameState }>> => {
    return apiRequest<{ gameState: GameState }>(`/rooms/${roomId}/fire`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    });
  },
};

export default roomApi;
