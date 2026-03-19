import { v4 as uuidv4 } from 'uuid';
import { Room, Player, GameState } from './types';

// Generate a 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// In-memory storage for rooms
class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private playerRooms: Map<string, string> = new Map(); // playerId -> roomId

  // Create a new room
  createRoom(roomName: string, playerName: string): { room: Room; playerId: string } {
    const playerId = uuidv4();
    const roomCode = this.generateUniqueCode();
    
    const host: Player = {
      id: playerId,
      name: playerName,
      isHost: true,
      joinedAt: new Date(),
    };

    const room: Room = {
      id: uuidv4(),
      code: roomCode,
      name: roomName,
      hostId: playerId,
      players: [host],
      maxPlayers: 2,
      isStarted: false,
      gameState: {
        towers: {
          [playerId]: 100,
        },
        lastFireAt: {
          [playerId]: 0,
        },
        isGameOver: false,
        winnerId: null,
      },
      createdAt: new Date(),
    };

    this.rooms.set(room.id, room);
    this.playerRooms.set(playerId, room.id);

    return { room, playerId };
  }

  // Join an existing room
  joinRoom(roomCode: string, playerName: string): { room: Room; playerId: string } | { error: string } {
    const room = this.findRoomByCode(roomCode);
    
    if (!room) {
      return { error: 'Room not found. Please check the room code.' };
    }

    if (room.isStarted) {
      return { error: 'Game has already started.' };
    }

    if (room.players.length >= room.maxPlayers) {
      return { error: 'Room is full.' };
    }

    // Check if player name is already taken
    if (room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      return { error: 'Player name is already taken in this room.' };
    }

    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      joinedAt: new Date(),
    };

    room.players.push(player);
    this.playerRooms.set(playerId, room.id);

    if (room.gameState) {
      room.gameState.towers[playerId] = 100;
      room.gameState.lastFireAt[playerId] = 0;
    }

    return { room, playerId };
  }

  // Leave a room
  leaveRoom(roomId: string, playerId: string): { success: boolean; room?: Room; error?: string } {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found.' };
    }

    const playerIndex = room.players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      return { success: false, error: 'Player not in room.' };
    }

    const wasHost = room.players[playerIndex].isHost;
    room.players.splice(playerIndex, 1);
    this.playerRooms.delete(playerId);

    // If host left, assign new host or delete room
    if (wasHost && room.players.length > 0) {
      room.players[0].isHost = true;
      room.hostId = room.players[0].id;
    } else if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { success: true };
    }

    if (room.gameState) {
      delete room.gameState.towers[playerId];
      delete room.gameState.lastFireAt[playerId];
      if (room.gameState.winnerId === playerId) {
        room.gameState.winnerId = null;
        room.gameState.isGameOver = false;
      }
    }

    return { success: true, room };
  }

  // Start the game
  startGame(roomId: string, playerId: string): { success: boolean; room?: Room; error?: string } {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found.' };
    }

    if (room.hostId !== playerId) {
      return { success: false, error: 'Only the host can start the game.' };
    }

    if (room.players.length < 2) {
      return { success: false, error: 'Need at least 2 players to start.' };
    }

    this.resetGameState(room);
    room.isStarted = true;
    return { success: true, room };
  }

  fireWeapon(roomId: string, playerId: string): { success: boolean; room?: Room; gameState?: GameState; error?: string } {
    const room = this.rooms.get(roomId);

    if (!room || !room.gameState) {
      return { success: false, error: 'Room not found.' };
    }

    if (!room.isStarted) {
      return { success: false, error: 'Game has not started.' };
    }

    if (room.gameState.isGameOver) {
      return { success: false, error: 'Game is already over.' };
    }

    if (!room.players.some(player => player.id === playerId)) {
      return { success: false, error: 'Player not in room.' };
    }

    const now = Date.now();
    const lastFireAt = room.gameState.lastFireAt[playerId] ?? 0;
    const reloadMs = 3000;

    if (now - lastFireAt < reloadMs) {
      return { success: false, error: 'Weapon is reloading.' };
    }

    const opponent = room.players.find(player => player.id !== playerId);
    if (!opponent) {
      return { success: false, error: 'No opponent found.' };
    }

    const currentHealth = room.gameState.towers[opponent.id] ?? 100;
    const updatedHealth = Math.max(0, currentHealth - 10);

    room.gameState.towers[opponent.id] = updatedHealth;
    room.gameState.lastFireAt[playerId] = now;

    if (updatedHealth <= 0) {
      room.gameState.isGameOver = true;
      room.gameState.winnerId = playerId;
    }

    return { success: true, room, gameState: room.gameState };
  }

  private resetGameState(room: Room): void {
    if (!room.gameState) {
      room.gameState = {
        towers: {},
        lastFireAt: {},
        isGameOver: false,
        winnerId: null,
      };
    }

    room.players.forEach(player => {
      room.gameState!.towers[player.id] = 100;
      room.gameState!.lastFireAt[player.id] = 0;
    });
    room.gameState.isGameOver = false;
    room.gameState.winnerId = null;
  }

  // Get room by ID
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // Get room by code
  findRoomByCode(code: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.code === code.toUpperCase()) {
        return room;
      }
    }
    return undefined;
  }

  // Get room by player ID
  getRoomByPlayer(playerId: string): Room | undefined {
    const roomId = this.playerRooms.get(playerId);
    if (roomId) {
      return this.rooms.get(roomId);
    }
    return undefined;
  }

  // Check if player is host
  isHost(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    return room ? room.hostId === playerId : false;
  }

  // Generate unique room code
  private generateUniqueCode(): string {
    let code: string;
    let attempts = 0;
    
    do {
      code = generateRoomCode();
      attempts++;
      if (attempts > 100) {
        throw new Error('Failed to generate unique room code');
      }
    } while (this.findRoomByCode(code));

    return code;
  }

  // Clean up old rooms (for maintenance)
  cleanupOldRooms(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, room] of this.rooms) {
      if (now - room.createdAt.getTime() > maxAgeMs) {
        this.rooms.delete(id);
        room.players.forEach(p => this.playerRooms.delete(p.id));
        cleaned++;
      }
    }

    return cleaned;
  }

  // Get all rooms (for debugging)
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

// Export singleton instance
export const roomManager = new RoomManager();
