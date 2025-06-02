import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  TouchableOpacity,
  Alert,
  Text as RNText,
} from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { login } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

const { width, height } = Dimensions.get('window');

export default function TraditionalLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const inputAnim1 = useRef(new Animated.Value(30)).current;
  const inputAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    checkBiometricSupport();

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
    ]).start();

    Animated.stagger(100, [
      Animated.timing(inputAnim1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnim2, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(compatible);
      setBiometricAvailable(enrolled);
    } catch (error) {
      console.log('Biometric check error:', error);
      setBiometricSupported(false);
      setBiometricAvailable(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Fingerprint',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.navigate('TraditionalDashboardScreen');
      } else {
        Alert.alert('Authentication failed', 'Fingerprint authentication was not successful.');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication is not available.');
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ username, password });
      navigation.navigate('TraditionalOTPScreen');
    } catch {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="rgba(255,255,255,0.9)"
              />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                style={styles.iconGradient}
              >
                <MaterialCommunityIcons name="lock-outline" size={22} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Enter your credentials to access your account
            </Text>
          </View>

          
          <View style={styles.form}>
            <Animated.View
              style={{
                transform: [{ translateY: inputAnim1 }],
                opacity: fadeAnim,
              }}
            >
              <RNText style={styles.staticLabel}>Username</RNText>
              <TextInput
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                textColor='#fff'
                theme={{
                  colors: {
                    primary: '#fff',
                    outline: 'rgba(255,255,255,0.5)',
                    onSurfaceVariant: 'rgba(255,255,255,0.8)',
                    text: '#fff',
                  },
                }}
                outlineColor="rgba(255,255,255,0.3)"
                activeOutlineColor="#fff"
                placeholder=""
                left={<TextInput.Icon icon="account" iconColor="rgba(255,255,255,0.8)" />}
              />
            </Animated.View>

            <Animated.View
              style={{
                transform: [{ translateY: inputAnim2 }],
                opacity: fadeAnim,
              }}
            >
              <RNText style={styles.staticLabel}>Password</RNText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                textColor='#fff'
                theme={{
                  colors: {
                    primary: '#fff',
                    outline: 'rgba(244, 243, 243, 0.5)',
                    onSurfaceVariant: 'rgba(255,255,255,0.8)',
                    text: '#fff',
                  },
                }}
                outlineColor="rgba(255,255,255,0.3)"
                activeOutlineColor="#fff"
                placeholder=""
                left={<TextInput.Icon icon="lock" iconColor="rgba(255,255,255,0.8)" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    iconColor="rgba(255,255,255,0.8)"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </Animated.View>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              buttonColor="#ffffff"
              textColor="#1e88e5"
              style={styles.loginButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            
            {biometricSupported && biometricAvailable && (
              <Button
                mode="outlined"
                onPress={handleBiometricAuth}
                textColor="#fff"
                style={[styles.switchButton, { marginTop: 12 }]}
                labelStyle={styles.switchButtonLabel}
                contentStyle={styles.buttonContent}
                icon="fingerprint"
              >
                Sign In with Fingerprint
              </Button>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AANFAuthScreen')}
              textColor="#fff"
              style={styles.switchButton}
              labelStyle={styles.switchButtonLabel}
              contentStyle={styles.buttonContent}
            >
              Try AANF Authentication
            </Button>
          </View>

          
          <View style={styles.footer}>
            <View style={styles.securityInfo}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={14}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.securityText}>
                Your data is protected with bank-grade security
              </Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  iconGradient: {
    padding: 12,
    borderRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  staticLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 3,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContent: {
    height: 48,
  },
  switchButton: {
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
  },
  switchButtonLabel: {
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dividerText: {
    marginHorizontal: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 6,
  },
});
