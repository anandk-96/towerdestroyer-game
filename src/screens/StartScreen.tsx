import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../game/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StartScreen'>;

const { width, height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export function StartScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundOverlay} />
      
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TOWER</Text>
        <Text style={styles.titleAccent}>DESTROYER</Text>
        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>⚔️ Battle for supremacy! ⚔️</Text>
      </View>

      {/* Decorative towers */}
      <View style={styles.decorativeContainer}>
        <View style={styles.towerIcon}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.towerBlock} />
          ))}
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        <View style={styles.towerIcon}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.towerBlock, styles.towerBlockEnemy]} />
          ))}
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CreateRoom')}
          activeOpacity={0.8}
        >
          <View style={[styles.buttonGradient, styles.createButtonGradient]} />
          <Text style={styles.buttonIcon}>🏠</Text>
          <Text style={styles.buttonText}>CREATE ROOM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('JoinRoom')}
          activeOpacity={0.8}
        >
          <View style={[styles.buttonGradient, styles.joinButtonGradient]} />
          <Text style={styles.buttonIcon}>🚪</Text>
          <Text style={styles.buttonText}>JOIN ROOM</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Choose your weapons wisely!</Text>
        <View style={styles.weaponsPreview}>
          <View style={styles.weaponBadge}>
            <Text style={styles.weaponIcon}>⚡</Text>
            <Text style={styles.weaponLabel}>Laser</Text>
          </View>
          <View style={styles.weaponBadge}>
            <Text style={styles.weaponIcon}>💣</Text>
            <Text style={styles.weaponLabel}>Bomb</Text>
          </View>
          <View style={styles.weaponBadge}>
            <Text style={styles.weaponIcon}>🔫</Text>
            <Text style={styles.weaponLabel}>Gun</Text>
          </View>
          <View style={styles.weaponBadge}>
            <Text style={styles.weaponIcon}>🚀</Text>
            <Text style={styles.weaponLabel}>Rocket</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.6,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: height * 0.03,
    zIndex: 1,
  },
  title: {
    fontSize: isSmallDevice ? 40 : 52,
    fontWeight: '900',
    color: COLORS.text,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    letterSpacing: 6,
  },
  titleAccent: {
    fontSize: isSmallDevice ? 40 : 52,
    fontWeight: '900',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    letterSpacing: 6,
  },
  titleUnderline: {
    width: width * 0.6,
    height: 3,
    backgroundColor: COLORS.primary,
    marginTop: 10,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 16,
    color: COLORS.textSecondary,
    marginTop: 12,
    letterSpacing: 3,
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.04,
    zIndex: 1,
  },
  towerIcon: {
    alignItems: 'center',
  },
  towerBlock: {
    width: isSmallDevice ? 35 : 45,
    height: isSmallDevice ? 20 : 26,
    backgroundColor: COLORS.towerBlock,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.tower,
  },
  towerBlockEnemy: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accent,
  },
  vsContainer: {
    marginHorizontal: width * 0.08,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  vsText: {
    fontSize: isSmallDevice ? 22 : 28,
    fontWeight: '900',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 14 : 18,
    paddingHorizontal: isSmallDevice ? 25 : 35,
    borderRadius: 14,
    minWidth: isSmallDevice ? 150 : 180,
    overflow: 'hidden',
  },
  buttonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  createButtonGradient: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  joinButtonGradient: {
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.accentLight,
  },
  buttonIcon: {
    fontSize: isSmallDevice ? 22 : 26,
    marginRight: 10,
  },
  buttonText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.04,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  footerText: {
    fontSize: isSmallDevice ? 12 : 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  weaponsPreview: {
    flexDirection: 'row',
    gap: 12,
  },
  weaponBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  weaponIcon: {
    fontSize: isSmallDevice ? 20 : 24,
  },
  weaponLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
