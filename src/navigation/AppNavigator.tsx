import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { StartScreen } from '../screens/StartScreen';
import { CreateRoomScreen } from '../screens/CreateRoomScreen';
import { JoinRoomScreen } from '../screens/JoinRoomScreen';
import { LobbyScreen } from '../screens/LobbyScreen';
import { GameScreen } from '../screens/GameScreen';
import { GameOverScreen } from '../screens/GameOverScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#1a1a2e' },
        }}
      >
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
        <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
        <Stack.Screen name="Lobby" component={LobbyScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
