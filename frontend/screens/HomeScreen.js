import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getToken, removeToken } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const t1 = await getToken('akma-key');
        const t2 = await getToken('traditional-token');
        setLoggedIn(!!(t1 || t2));
      };
      checkAuth();

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.stagger(150,
        cardAnimations.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 70,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ).start();
    }, [])
  );

  useEffect(() => {
    const isDeviceRooted = false;
    if (isDeviceRooted) {
      Alert.alert(
        'Security Alert',
        'This device appears to be rooted. App access denied.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }
  }, []);

  const handleLogout = async () => {
    await removeToken('akma-key');
    await removeToken('traditional-token');
    setLoggedIn(false);
    Alert.alert('Logout', 'You have been logged out.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.decorativeElements}>
        <Animated.View style={[styles.floatingCircle, styles.circle1]} />
        <Animated.View style={[styles.floatingCircle, styles.circle2]} />
        <Animated.View style={[styles.floatingCircle, styles.circle3]} />
      </View>

      <SafeAreaView style={styles.safe}>
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Animated.View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#448aff', '#2979ff']}
                style={styles.logoGradient}
              >
                <FontAwesome5 name="university" size={24} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>AANF Banking</Text>
            <Text style={styles.subtitle}>
              Advanced Authentication & Network Fingerprinting
            </Text>

            {loggedIn && (
              <Animated.View style={styles.welcomeContainer}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#4ade80" />
                <Text style={styles.welcome}>Welcome back, Secure User</Text>
              </Animated.View>
            )}
          </Animated.View>

          <View style={styles.cardsContainer}>
            <Animated.View style={[styles.card, {
              transform: [{
                scale: cardAnimations[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }],
              opacity: cardAnimations[0]
            }]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('TraditionalLoginScreen')}
                style={styles.cardTouchable}
              >
                <LinearGradient
                  colors={['#5c6bc0', '#3f51b5', '#3949ab']}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.cardIconContainer}>
                      <MaterialCommunityIcons name="lock-outline" size={20} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>Traditional Auth</Text>
                    <Text style={styles.cardDescription}>
                      Username, password and OTP verification
                    </Text>
                    <View style={styles.cardFeatures}>
                      <View style={styles.feature}>
                        <MaterialCommunityIcons name="shield-account-outline" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.featureText}>Username & Password</Text>
                      </View>
                      <View style={styles.feature}>
                        <MaterialCommunityIcons name="message-badge-outline" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.featureText}>OTP Verification</Text>
                      </View>
                    </View>
                    <View style={styles.cardButton}>
                      <Text style={styles.cardButtonLabel}>Get Started</Text>
                      <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.card, {
              transform: [{
                scale: cardAnimations[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }],
              opacity: cardAnimations[1]
            }]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('AANFAuthScreen')}
                style={styles.cardTouchable}
              >
                <LinearGradient
                  colors={['#00897b', '#00796b', '#00695c']}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardContent}>
                    <View style={[styles.cardIconContainer, styles.aanfIconContainer]}>
                      <MaterialCommunityIcons name="sim-outline" size={20} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>AANF Auth</Text>
                    <Text style={styles.cardDescription}>
                      SIM-based authentication with cryptographic signatures
                    </Text>
                    <View style={styles.cardFeatures}>
                      <View style={[styles.feature, styles.aanfFeature]}>
                        <MaterialCommunityIcons name="sim" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.featureText}>SIM-based Auth</Text>
                      </View>
                      <View style={[styles.feature, styles.aanfFeature]}>
                        <MaterialCommunityIcons name="key-outline" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.featureText}>Crypto Signatures</Text>
                      </View>
                    </View>
                    <View style={[styles.cardButton, styles.aanfButton]}>
                      <Text style={styles.cardButtonLabel}>Get Started</Text>
                      <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {loggedIn && (
            <Animated.View style={[styles.actionButtons, {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }]}>
              <Button
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="history" size={18} color={color} />
                )}
                mode="contained"
                buttonColor="#ffffff"
                textColor="#303f9f"
                style={styles.historyButton}
                labelStyle={styles.actionButtonLabel}
                contentStyle={styles.actionButtonContent}
                onPress={() => navigation.navigate('TransactionHistoryScreen')}
              >
                Transaction History
              </Button>

              <Button
                icon={({ size, color }) => (
                  <MaterialCommunityIcons name="logout" size={18} color={color} />
                )}
                mode="outlined"
                textColor="#f44336"
                style={styles.logoutButton}
                labelStyle={styles.logoutButtonLabel}
                contentStyle={styles.actionButtonContent}
                onPress={handleLogout}
              >
                Logout
              </Button>
            </Animated.View>
          )}

          <Animated.View style={styles.securityBadge}>
            <View style={styles.securityBadgeContent}>
              <MaterialCommunityIcons name="shield-check-outline" size={14} color="#fff" />
              <Text style={styles.securityText}>
                End-to-end encrypted
              </Text>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 100,
  },
  circle1: {
    width: 150,
    height: 150,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 150,
    left: -50,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: 50,
    right: 10,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 18,
  },
  logoGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  welcomeContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {
    color: '#4ade80',
    fontSize: 13,
    marginLeft: 6,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardTouchable: {
    borderRadius: 20,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    gap: 10,
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  cardFeatures: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  cardButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardButtonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  aanfIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  aanfFeature: {
    paddingLeft: 2,
  },
  aanfButton: {
    marginTop: 10,
  },
  actionButtons: {
    marginTop: 30,
    gap: 10,
  },
  historyButton: {
    borderRadius: 10,
  },
  actionButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonContent: {
    paddingVertical: 6,
  },
  logoutButton: {
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 10,
  },
  logoutButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  securityBadge: {
    marginTop: 40,
    alignItems: 'center',
  },
  securityBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    color: '#fff',
    fontSize: 12,
  },
});
