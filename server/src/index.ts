import express from 'express';
import cors from 'cors';
import { roomManager } from './roomManager';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// REST API Endpoints

// Create a new room
app.post('/api/rooms', (req, res) => {
  try {
    const { roomName, playerName } = req.body;

    if (!roomName || !playerName) {
      return res.status(400).json({
        success: false,
        error: 'Room name and player name are required',
      });
    }

    const result = roomManager.createRoom(roomName, playerName);
    
    res.json({
      success: true,
      data: {
        room: result.room,
        playerId: result.playerId,
      },
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create room',
    });
  }
});

// Join a room
app.post('/api/rooms/join', (req, res) => {
  try {
    const { roomCode, playerName } = req.body;

    if (!roomCode || !playerName) {
      return res.status(400).json({
        success: false,
        error: 'Room code and player name are required',
      });
    }

    const result = roomManager.joinRoom(roomCode, playerName);

    if ('error' in result) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: {
        room: result.room,
        playerId: result.playerId,
      },
    });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join room',
    });
  }
});

// Get room by ID
app.get('/api/rooms/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    const room = roomManager.getRoom(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.json({
      success: true,
      data: { room },
    });
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get room',
    });
  }
});

// Leave room
app.post('/api/rooms/:roomId/leave', (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Player ID is required',
      });
    }

    const result = roomManager.leaveRoom(roomId, playerId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: result.room ? { room: result.room } : undefined,
    });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave room',
    });
  }
});

// Start game
app.post('/api/rooms/:roomId/start', (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Player ID is required',
      });
    }

    const result = roomManager.startGame(roomId, playerId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: { room: result.room },
    });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start game',
    });
  }
});

// Fire weapon
app.post('/api/rooms/:roomId/fire', (req, res) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({
        success: false,
        error: 'Player ID is required',
      });
    }

    const result = roomManager.fireWeapon(roomId, playerId);

    if (!result.success || !result.gameState) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      data: { gameState: result.gameState },
    });
  } catch (error) {
    console.error('Error firing weapon:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fire weapon',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Tower Destroyer Server running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
});

export { app };
