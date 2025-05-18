import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getToken, removeToken } from '../utils/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ Check login status every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const t1 = await getToken('akma-key');
        const t2 = await getToken('traditional-token');
        setLoggedIn(!!(t1 || t2));
      };
      checkAuth();
    }, [])
  );

  // Optional rooted device check
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

  // ✅ Logout handler
  const handleLogout = async () => {
    await removeToken('akma-key');
    await removeToken('traditional-token');
    setLoggedIn(false);
    Alert.alert('Logout', 'You have been logged out.');
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe}>
        <BlurView intensity={60} tint="light" style={styles.card}>
          <FontAwesome5 name="university" size={28} color={colors.primary} />
          <Text style={[styles.title, { color: colors.primary }]}>
            AANF Banking
          </Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Secure. Modern. Trusted.
          </Text>

          {/* ✅ Welcome message if logged in */}
          {loggedIn && (
            <Text style={styles.welcome}>👋 Welcome back!</Text>
          )}

          <View style={styles.section}>
            <MaterialCommunityIcons name="lock" size={22} color="#6d28d9" />
            <Text style={[styles.flowTitle, { color: colors.onSurface }]}>
              Traditional Flow
            </Text>
            <Text style={[styles.flowDesc, { color: colors.onSurfaceVariant }]}>
              Login with password authentication
            </Text>
            <Button
              mode="contained"
              buttonColor="#6d28d9"
              style={styles.button}
              onPress={() => navigation.navigate('TraditionalLoginScreen')}
            >
              Enter
            </Button>
          </View>

          <View style={styles.section}>
            <MaterialCommunityIcons name="sim" size={22} color="#059669" />
            <Text style={[styles.flowTitle, { color: colors.onSurface }]}>
              AANF Flow (SIM Auth)
            </Text>
            <Text style={[styles.flowDesc, { color: colors.onSurfaceVariant }]}>
              Login via SIM + device-based auth
            </Text>
            <Button
              mode="contained"
              buttonColor="#059669"
              style={styles.button}
              onPress={() => navigation.navigate('AANFAuthScreen')}
            >
              Enter
            </Button>
          </View>

          {/* ✅ History & Logout buttons only if logged in */}
          {loggedIn && (
            <>
              <Button
                icon="history"
                mode="outlined"
                style={styles.historyButton}
                onPress={() => navigation.navigate('TransactionHistoryScreen')}
              >
                View Transaction History
              </Button>

              <Button
                mode="text"
                onPress={handleLogout}
                style={styles.logoutButton}
                labelStyle={{ color: '#dc2626' }}
              >
                Logout
              </Button>
            </>
          )}
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 16,
    marginBottom: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  section: {
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  flowDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 4,
  },
  button: {
    marginTop: 8,
    borderRadius: 30,
    paddingHorizontal: 20,
    width: 160,
  },
  historyButton: {
    marginTop: 20,
    borderRadius: 20,
    borderColor: '#1f2937',
  },
  logoutButton: {
    marginTop: 12,
  },
});
