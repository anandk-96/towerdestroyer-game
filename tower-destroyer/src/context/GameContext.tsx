import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { WeaponType } from '../types/game';
import { WEAPONS } from '../game/constants';
import { roomApi } from '../services/api';
import { Room, Player, GameState } from '../services/api';

// Action Types
type GameAction =
  | { type: 'SET_ROOM'; payload: { room: Room; playerId: string } }
  | { type: 'UPDATE_ROOM'; payload: Room }
  | { type: 'CLEAR_ROOM' }
  | { type: 'SET_PLAYER'; payload: { playerId: string; playerName: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_WEAPON'; payload: WeaponType }
  | { type: 'SET_GAME_STARTED'; payload: boolean }
  | { type: 'SET_GAME_STATE'; payload: GameState | null }
  | { type: 'SET_GAME_OVER'; payload: { winnerId: string } | null };


// State Interface
interface GameContextState {
  playerId: string | null;
  playerName: string;
  currentRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  selectedWeapon: WeaponType;
  isGameStarted: boolean;
  gameState: GameState | null;
  winnerId: string | null;
}

// Initial State
const initialState: GameContextState = {
  playerId: null,
  playerName: '',
  currentRoom: null,
  isLoading: false,
  error: null,
  selectedWeapon: 'laser',
  isGameStarted: false,
  gameState: null,
  winnerId: null,
};

// Reducer
function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_ROOM':
      return { 
        ...state, 
        currentRoom: action.payload.room,
        playerId: action.payload.playerId,
        isLoading: false,
        error: null,
        gameState: action.payload.room.gameState ?? state.gameState,
      };
    
    case 'UPDATE_ROOM':
      return { 
        ...state, 
        currentRoom: action.payload,
        error: null,
        gameState: action.payload.gameState ?? state.gameState,
      };
    
    case 'CLEAR_ROOM':
      return { 
        ...state, 
        currentRoom: null,
        playerId: null,
        isGameStarted: false,
        gameState: null,
        winnerId: null,
      };
    
    case 'SET_PLAYER':
      return { 
        ...state, 
        playerId: action.payload.playerId,
        playerName: action.payload.playerName,
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SELECT_WEAPON':
      return { ...state, selectedWeapon: action.payload };
    
    case 'SET_GAME_STARTED':
      return { ...state, isGameStarted: action.payload };

    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };

    case 'SET_GAME_OVER':
      return { ...state, winnerId: action.payload?.winnerId ?? null };
    
    default:
      return state;
  }
}

// Context Value Interface
interface GameContextValue {
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
  createRoom: (roomName: string, playerName: string) => Promise<{ success: boolean; room?: Room; playerId?: string; error?: string }>;
  joinRoom: (roomCode: string, playerName: string) => Promise<{ success: boolean; room?: Room; playerId?: string; error?: string }>;
  leaveRoom: () => Promise<void>;
  startGame: () => Promise<{ success: boolean; error?: string }>;
  fireWeapon: () => Promise<{ success: boolean; error?: string }>;
  getTowerHealth: (playerId: string) => number;
  getEnemyHealth: () => number;
  getReloadRemaining: () => number;
  isHost: () => boolean;
  getCurrentPlayer: () => Player | undefined;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

// Provider
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startPollingRoom = useCallback((roomId: string) => {
    const pollRoom = async () => {
      try {
        const response = await roomApi.get(roomId);
        if (response.success && response.data?.room) {
          dispatch({ type: 'UPDATE_ROOM', payload: response.data.room });
          if (response.data.room.gameState) {
            dispatch({ type: 'SET_GAME_STATE', payload: response.data.room.gameState });
            if (response.data.room.gameState.isGameOver && response.data.room.gameState.winnerId) {
              dispatch({ type: 'SET_GAME_OVER', payload: { winnerId: response.data.room.gameState.winnerId } });
            }
          }
        }
      } catch (error) {
        console.error('Polling room failed:', error);
      }
    };

    pollRoom();
    const intervalId = setInterval(pollRoom, 1500);

    return () => clearInterval(intervalId);
  }, []);

  // Poll room state when current room changes
  useEffect(() => {
    if (!state.currentRoom) {
      return;
    }

    return startPollingRoom(state.currentRoom.id);
  }, [state.currentRoom?.id, startPollingRoom]);

  // Create room
  const createRoom = useCallback(async (roomName: string, playerName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await roomApi.create(roomName, playerName);
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'SET_ROOM', 
          payload: { 
            room: response.data.room, 
            playerId: response.data.playerId 
          } 
        });
        dispatch({ 
          type: 'SET_PLAYER', 
          payload: { 
            playerId: response.data.playerId, 
            playerName 
          } 
        });
        if (response.data.room.gameState) {
          dispatch({ type: 'SET_GAME_STATE', payload: response.data.room.gameState });
        }
        
        return { 
          success: true, 
          room: response.data.room, 
          playerId: response.data.playerId 
        };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to create room' });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to create room. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Join room
  const joinRoom = useCallback(async (roomCode: string, playerName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await roomApi.join(roomCode, playerName);
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'SET_ROOM', 
          payload: { 
            room: response.data.room, 
            playerId: response.data.playerId 
          } 
        });
        dispatch({ 
          type: 'SET_PLAYER', 
          payload: { 
            playerId: response.data.playerId, 
            playerName 
          } 
        });
        if (response.data.room.gameState) {
          dispatch({ type: 'SET_GAME_STATE', payload: response.data.room.gameState });
        }
        
        return { 
          success: true, 
          room: response.data.room, 
          playerId: response.data.playerId 
        };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to join room' });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to join room. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!state.currentRoom || !state.playerId) return;
    
    try {
      await roomApi.leave(state.currentRoom.id, state.playerId);
      dispatch({ type: 'CLEAR_ROOM' });
    } catch (error) {
      console.error('Error leaving room:', error);
      dispatch({ type: 'CLEAR_ROOM' });
    }
  }, [state.currentRoom, state.playerId]);

  // Start game (host only)
  const startGame = useCallback(async () => {
    if (!state.currentRoom || !state.playerId) {
      return { success: false, error: 'No room or player found' };
    }

    if (!isHost()) {
      return { success: false, error: 'Only the host can start the game' };
    }

    try {
      const response = await roomApi.startGame(state.currentRoom.id, state.playerId);
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_ROOM', payload: response.data.room });
        dispatch({ type: 'SET_GAME_STARTED', payload: true });
        if (response.data.room.gameState) {
          dispatch({ type: 'SET_GAME_STATE', payload: response.data.room.gameState });
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to start game' };
    }
  }, [state.currentRoom, state.playerId]);

  const fireWeapon = useCallback(async () => {
    if (!state.currentRoom || !state.playerId) {
      return { success: false, error: 'No room or player found' };
    }

    try {
      const response = await roomApi.fireWeapon(state.currentRoom.id, state.playerId);
      if (response.success && response.data?.gameState) {
        dispatch({ type: 'SET_GAME_STATE', payload: response.data.gameState });
        if (response.data.gameState.isGameOver && response.data.gameState.winnerId) {
          dispatch({ type: 'SET_GAME_OVER', payload: { winnerId: response.data.gameState.winnerId } });
        }
        return { success: true };
      }
      return { success: false, error: response.error || 'Failed to fire weapon' };
    } catch (error) {
      return { success: false, error: 'Failed to fire weapon' };
    }
  }, [state.currentRoom, state.playerId]);

  const getTowerHealth = useCallback((playerId: string) => {
    return state.gameState?.towers[playerId] ?? 100;
  }, [state.gameState]);

  const getEnemyHealth = useCallback(() => {
    if (!state.currentRoom || !state.playerId) {
      return 100;
    }
    const enemy = state.currentRoom.players.find(player => player.id !== state.playerId);
    if (!enemy) {
      return 100;
    }
    return getTowerHealth(enemy.id);
  }, [state.currentRoom, state.playerId, getTowerHealth]);

  const getReloadRemaining = useCallback(() => {
    if (!state.playerId) {
      return 0;
    }
    const lastFireAt = state.gameState?.lastFireAt[state.playerId] ?? 0;
    const reloadMs = WEAPONS.gun.cooldown;
    const elapsed = Date.now() - lastFireAt;
    return Math.max(0, reloadMs - elapsed);
  }, [state.gameState, state.playerId]);

  // Check if current player is host
  const isHost = useCallback(() => {
    if (!state.currentRoom || !state.playerId) return false;
    return state.currentRoom.hostId === state.playerId;
  }, [state.currentRoom, state.playerId]);

  // Get current player
  const getCurrentPlayer = useCallback(() => {
    if (!state.currentRoom || !state.playerId) return undefined;
    return state.currentRoom.players.find(p => p.id === state.playerId);
  }, [state.currentRoom, state.playerId]);

  return (
    <GameContext.Provider value={{ 
      state, 
      dispatch, 
      createRoom, 
      joinRoom, 
      leaveRoom, 
      startGame,
      fireWeapon,
      getTowerHealth,
      getEnemyHealth,
      getReloadRemaining,
      isHost,
      getCurrentPlayer,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
