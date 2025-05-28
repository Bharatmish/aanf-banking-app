import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Button, TextInput, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { login } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function TraditionalLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const inputAnim1 = useRef(new Animated.Value(30)).current;
  const inputAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start entrance animations
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

    // Staggered inputs animation
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
      })
    ]).start();
  }, []);

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
        colors={['#303f9f', '#3949ab', '#5c6bc0']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color="rgba(255,255,255,0.9)" />
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

          {/* Form */}
          <View style={styles.form}>
            <Animated.View style={{
              transform: [{ translateY: inputAnim1 }],
              opacity: fadeAnim
            }}>
              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#fff',
                    outline: 'rgba(255,255,255,0.5)',
                    onSurfaceVariant: 'rgba(255,255,255,0.8)',
                  }
                }}
                outlineColor="rgba(255,255,255,0.3)"
                activeOutlineColor="#fff"
                textColor="#fff"
                left={<TextInput.Icon icon="account" iconColor="rgba(255,255,255,0.8)" />}
              />
            </Animated.View>

            <Animated.View style={{
              transform: [{ translateY: inputAnim2 }],
              opacity: fadeAnim
            }}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                theme={{
                  colors: {
                    primary: '#fff',
                    outline: 'rgba(255,255,255,0.5)',
                    onSurfaceVariant: 'rgba(255,255,255,0.8)',
                  }
                }}
                outlineColor="rgba(255,255,255,0.3)"
                activeOutlineColor="#fff"
                textColor="#fff"
                left={<TextInput.Icon icon="lock" iconColor="rgba(255,255,255,0.8)" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
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
              textColor="#303f9f"
              style={styles.loginButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

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

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.securityInfo}>
              <MaterialCommunityIcons name="shield-check-outline" size={14} color="rgba(255,255,255,0.9)" />
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
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    fontSize: 14,
    height: 54,
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  switchButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  switchButton: {
    borderRadius: 12,
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  securityText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
    fontWeight: '500',
  },
});
