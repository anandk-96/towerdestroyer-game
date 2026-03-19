# 🏰 Tower Destroyer

A real-time multiplayer tower destruction game built with Expo and React Native. Battle against opponents by launching weapons to destroy their towers!

## 🎮 Features

- **Start Screen** - Create or join game rooms
- **Lobby System** - Wait for players and prepare for battle
- **Room Codes** - Share unique 6-character codes to invite friends
- **Host Controls** - Only the host can start the game
- **Multiple Weapons**:
  - ⚡ **Laser** - Fast, low damage, quick cooldown
  - 💣 **Bomb** - Slow, high damage, area effect
  - 🔫 **Gun** - Rapid fire, medium damage
  - 🚀 **Rocket** - High damage, medium cooldown
- **Destructible Towers** - Watch towers crumble with realistic physics
- **Weapon Cooldowns** - Strategic timing for weapon usage

## 🏗️ Project Structure

```
tower-destroyer/
├── App.tsx                 # Main app entry point
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── server/                 # Backend server
│   ├── package.json        # Server dependencies
│   ├── tsconfig.json       # Server TypeScript config
│   └── src/
│       ├── index.ts        # Server entry point
│       ├── types.ts        # Server types
│       └── roomManager.ts  # Room management logic
└── src/
    ├── assets/             # Images, fonts, and other assets
    ├── components/         # Reusable UI components
    ├── context/            # React Context for state management
    │   └── GameContext.tsx # Global game state
    ├── game/               # Game logic and physics
    │   ├── constants.ts    # Game configuration and weapons
    │   └── physics.ts      # Matter.js physics engine
    ├── hooks/              # Custom React hooks
    │   └── useGameLoop.ts  # Game loop management
    ├── navigation/         # React Navigation setup
    │   └── AppNavigator.tsx
    ├── screens/            # App screens
    │   ├── StartScreen.tsx     # Main menu
    │   ├── CreateRoomScreen.tsx
    │   ├── JoinRoomScreen.tsx
    │   ├── LobbyScreen.tsx
    │   ├── GameScreen.tsx      # Main gameplay
    │   └── GameOverScreen.tsx
    ├── services/           # API services
    │   └── api.ts          # REST API client
    └── types/              # TypeScript type definitions
        ├── game.ts         # Game-related types
        └── navigation.ts   # Navigation types
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Navigate to the project directory
cd tower-destroyer

# Install client dependencies
npm install

# Navigate to server directory
cd server

# Install server dependencies
npm install

# Return to root
cd ..
```

### Running the App

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start the Expo Client:**
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web browser
- Scan QR code with Expo Go app

## 🎯 Game Flow

1. **Start Screen** → Choose to Create Room or Join Room
2. **Create Room** → Enter room name and your name → Become the host
3. **Join Room** → Enter room code and your name → Join existing room
4. **Lobby** → Wait for opponent to join (host sees room code to share)
5. **Game** → Battle by firing weapons at opponent's tower
6. **Game Over** → Victory screen with stats

## 🎮 How to Play

### Creating a Room
1. Click "Create Room" on the start screen
2. Enter a room name and your player name
3. You'll be taken to the lobby as the host
4. Share the 6-character room code with your friend
5. Wait for another player to join
6. Click "Start Game" when ready

### Joining a Room
1. Click "Join Room" on the start screen
2. Enter your name and the room code shared by the host
3. You'll be taken to the lobby
4. Wait for the host to start the game

### Gameplay
- Tap weapon buttons to select your weapon
- Tap FIRE button to launch the selected weapon
- Wait for cooldown before firing again
- Monitor tower health bars to track progress

## 📡 API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms` | Create a new room |
| POST | `/api/rooms/join` | Join an existing room |
| GET | `/api/rooms/:roomId` | Get room details |
| POST | `/api/rooms/:roomId/leave` | Leave a room |
| POST | `/api/rooms/:roomId/start` | Start the game (host only) |

## 🛠️ Technologies Used

### Client
- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **TypeScript** - Type safety

### Server
- **Express** - Web framework
- **TypeScript** - Type safety

## 📝 Future Enhancements

- [ ] Physics-based tower destruction
- [ ] Power-ups and special abilities
- [ ] Multiple tower types
- [ ] Leaderboards and rankings
- [ ] Sound effects and music
- [ ] Particle effects for explosions
- [ ] AI opponents for single-player mode

## 📄 License

MIT License - feel free to use this project for learning and development!
