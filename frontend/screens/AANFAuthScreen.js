import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity 
} from 'react-native';
import { Text } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { authenticateAANF, createAANFSession, BASE_URL } from '../services/api';
import { saveToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { deriveKAF, simulatePrimaryAuthentication, getDeviceIdentifier } from '../utils/sim';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function AANFAuthScreen() {
  const [loading, setLoading] = useState(true);
  const [carrier, setCarrier] = useState('');
  const [model, setModel] = useState('');
  const [step, setStep] = useState('Initializing...');
  const navigation = useNavigation();
  
  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;

  // Start pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Progress animation
  const animateProgress = (toValue) => {
    Animated.timing(progressAnim, {
      toValue,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  // Step text animation
  const animateStepChange = (newStep) => {
    Animated.sequence([
      Animated.timing(stepOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(stepOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => setStep(newStep), 200);
  };

  const verifyDeviceAndAuthenticate = async () => {
    setLoading(true);
    try {
      console.log("\n=========== 🔐 AANF AUTHENTICATION STARTED ===========");

      animateStepChange('Detecting device information...');
      animateProgress(0.25);

      const net = await Network.getNetworkStateAsync();
      const carrierName = net?.carrier || 'Unknown';
      const modelName = Device.modelName || 'Generic';

      console.log(`📱 Device details - Model: ${modelName} | Carrier: ${carrierName}`);
      setCarrier(carrierName);
      setModel(modelName);

      animateStepChange('Authenticating with SIM credentials...');
      animateProgress(0.5);
      
      // Get device identifier
      const deviceId = await getDeviceIdentifier();
      
      // Simulate primary authentication
      const { challenge, response } = await simulatePrimaryAuthentication();
      console.log(`📤 Authentication payload:`, { 
        carrier: carrierName, 
        model: modelName,
        device_id: deviceId,
        challenge,
        response
      });

      // Send device info and challenge-response to backend
      console.log(`📤 Sending authentication request to backend...`);
      const authResponse = await authenticateAANF({
        carrier: carrierName,
        model: modelName,
        device_id: deviceId,
        challenge,
        response
      });

      const akmaKeyReceived = authResponse.data.akma_key;
      await saveToken('akma-key', akmaKeyReceived);
      console.log(`✅ Authentication successful, received AKMA key: ${akmaKeyReceived.substring(0, 8)}...`);
      
      animateStepChange('Creating secure session...');
      animateProgress(0.75);

      try {
        console.log(`🔄 Creating AANF session for function: transactions`);
        const sessionResponse = await createAANFSession('transactions', akmaKeyReceived);
        console.log('Session created successfully:', sessionResponse.data);
        
        // Derive KAF locally for transactions
        const localKaf = await deriveKAF('transactions');
        await saveToken('kaf-transactions', localKaf);
        
        // Store expiry time from response
        if (sessionResponse.data && sessionResponse.data.expiry_time) {
          await saveToken('kaf-expiry', sessionResponse.data.expiry_time.toString());
          console.log(`⏱️ Session expiry set: ${new Date(sessionResponse.data.expiry_time * 1000).toLocaleString()}`);
        }

        console.log(`✅ AANF authentication complete! Ready for secure transactions.`);
        console.log("=========== 🔐 AANF AUTHENTICATION COMPLETED ===========\n");
        
        animateStepChange('Authentication complete!');
        animateProgress(1);
        
        // Delay navigation slightly to show the completion state
        setTimeout(() => {
          navigation.navigate('DashboardScreen');
        }, 800);
      } catch (sessionErr) {
        console.error('Session creation failed:', sessionErr);
        
        // Provide detailed error information
        console.log("===== SESSION ERROR DETAILS =====");
        if (sessionErr.response) {
          console.log(`Status: ${sessionErr.response.status}`);
          console.log(`Data:`, sessionErr.response.data);
          console.log(`Headers:`, sessionErr.response.headers);
        } else if (sessionErr.request) {
          console.log('No response received:', sessionErr.request);
        } else {
          console.log(`Error message: ${sessionErr.message}`);
        }
        
        let errorMessage = 'Failed to initialize secure session';
        if (!net.isConnected) {
          errorMessage = 'No network connection. Please check your internet and try again.';
        } else if (sessionErr.response && sessionErr.response.status === 403) {
          errorMessage = 'Session authorization failed. Please try again.';
        } else if (sessionErr.code === 'ECONNABORTED') {
          errorMessage = 'Connection timeout. Server might be unavailable.';
        }
        
        setLoading(false);
        alert(errorMessage);
        console.log("=========== ❌ AANF AUTHENTICATION FAILED ===========\n");
      }
    } catch (authErr) {
      console.error('Authentication failed:', authErr);
      
      // Provide detailed error information
      console.log("===== AUTHENTICATION ERROR DETAILS =====");
      if (authErr.response) {
        console.log(`Status: ${authErr.response.status}`);
        console.log(`Data:`, authErr.response.data);
        console.log(`Headers:`, authErr.response.headers);
      } else if (authErr.request) {
        console.log('No response received:', authErr.request);
      } else {
        console.log(`Error message: ${authErr.message}`);
      }
      
      let errorMessage = 'SIM-based authentication failed';
      if (!net?.isConnected) {
        errorMessage = 'No network connection. Please check your internet and try again.';
      } else if (authErr.response && authErr.response.status === 403) {
        errorMessage = 'Your carrier is not supported for secure authentication.';
      }
      
      setLoading(false);
      alert(errorMessage);
      console.log("=========== ❌ AANF AUTHENTICATION FAILED ===========\n");
    }
  };

  // Call the authentication function when component mounts
  useEffect(() => {
    verifyDeviceAndAuthenticate();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#00695c', '#00796b', '#00897b']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, {
            transform: [{ scale: pulseAnim }]
          }]}>
            <MaterialCommunityIcons name="sim-outline" size={28} color="#fff" />
          </Animated.View>
          
          <Text style={styles.title}>AANF Authentication</Text>
          <Text style={styles.subtitle}>
            Advanced Authentication & Network Fingerprinting
          </Text>
          
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            <Animated.Text style={[styles.stepText, { opacity: stepOpacity }]}>
              {step}
            </Animated.Text>
          </View>

          <View style={styles.deviceInfo}>
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="cellphone" size={16} color="rgba(255,255,255,0.8)" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Device Model</Text>
                <Text style={styles.infoValue}>{model || 'Detecting...'}</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="signal" size={16} color="rgba(255,255,255,0.8)" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Carrier</Text>
                <Text style={styles.infoValue}>{carrier || 'Detecting...'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.securityBadge}>
            <MaterialCommunityIcons name="shield-check-outline" size={14} color="#26a69a" />
            <Text style={styles.securityText}>
              Secured with cryptographic signatures
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  progressContainer: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  spinner: {
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  deviceInfo: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 11,
    color: '#424242',
    marginLeft: 6,
    fontWeight: '500',
  },
});
