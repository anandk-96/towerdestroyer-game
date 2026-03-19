import { Player, Room } from './game';

export type RootStackParamList = {
  StartScreen: undefined;
  CreateRoom: undefined;
  JoinRoom: undefined;
  Lobby: { roomId: string; playerId: string };
  GameScreen: { roomId: string; playerId: string };
  GameOver: { winner: Player };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
