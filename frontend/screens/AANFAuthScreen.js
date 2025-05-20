import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { authenticateAANF, createAANFSession, BASE_URL } from '../services/api'; // Import BASE_URL here
import { saveToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { deriveKAF } from '../utils/sim';

export default function AANFAuthScreen() {
  const [loading, setLoading] = useState(true);
  const [carrier, setCarrier] = useState('');
  const [model, setModel] = useState('');
  const [akmaKey, setAkmaKey] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const verifyDeviceAndAuthenticate = async () => {
      console.log("\n=========== 🔐 AANF AUTHENTICATION STARTED ===========");
      console.log("📱 Initializing device verification...");
      
      const net = await Network.getNetworkStateAsync();
      const carrierName = net?.carrier || 'Unknown';
      const modelName = Device.modelName || 'Generic';
      
      console.log(`📱 Device details - Model: ${modelName} | Carrier: ${carrierName}`);
      console.log(`🌐 Network type: ${net?.type || 'Unknown'} | Connected: ${net?.isConnected ? 'Yes' : 'No'}`);
      
      setCarrier(carrierName);
      setModel(modelName);

      // Simulate loading/verification delay
      setTimeout(async () => {
        try {
          // Step 1: Authenticate with AANF
          console.log(`🔑 Sending authentication request to server: ${BASE_URL}/aanf/authenticate`);
          console.log(`📤 Authentication payload: `, { carrier: carrierName, model: modelName });
          
          const authResponse = await authenticateAANF({ carrier: carrierName, model: modelName });
          const akmaKeyReceived = authResponse.data.akma_key;
          setAkmaKey(akmaKeyReceived);
          await saveToken('akma-key', akmaKeyReceived);
          
          console.log(`✅ Authentication successful, received AKMA key: ${akmaKeyReceived.substring(0, 8)}...`);
          
          // Step 2: Create a session for transactions
          try {
            console.log(`Attempting to create session at: ${BASE_URL}/aanf/create-session`);
            console.log(`🔄 Creating AANF session for function: transactions`);
            const sessionResponse = await createAANFSession('transactions', akmaKeyReceived);
            console.log('Session created successfully:', sessionResponse.data);
            
            // Store the KAF from the backend response for transaction signing
            // We need to ensure we use the same KAF as backend for signatures
            if (sessionResponse.data && sessionResponse.data.kaf) {
              await saveToken('kaf-transactions', sessionResponse.data.kaf);
              console.log(`✅ Session created, received KAF: ${sessionResponse.data.kaf.substring(0, 8)}...`);
            } else {
              // Fallback to locally derived KAF
              const kaf = await deriveKAF('transactions');
              console.log('KAF derived locally');
            }

            navigation.navigate('AANFTransactionScreen');
          } catch (sessionErr) {
            console.error('Session creation failed:', sessionErr);
            
            // More detailed error handling with specific UI feedback
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
          }
        } catch (authErr) {
          console.error('Authentication failed:', authErr);
          
          // Handle specific authentication errors
          let errorMessage = 'SIM-based authentication failed';
          if (!net.isConnected) {
            errorMessage = 'No network connection. Please check your internet and try again.';
          } else if (authErr.response && authErr.response.status === 403) {
            errorMessage = 'Your carrier is not supported for secure authentication.';
          }
          
          setLoading(false);
          alert(errorMessage);
        } finally {
          setLoading(false);
        }
      }, 2000);
    };

    verifyDeviceAndAuthenticate();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Verifying SIM and device identity...</Text>

        {/* ✅ Display detected device and carrier info */}
        <Text style={styles.deviceInfo}>
          Detected Carrier: {carrier || 'Unknown'}{"\n"}
          Device Model: {model || 'Unknown'}
        </Text>
      </View>
    );
  }

  return null; // Auto-navigates on success
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#374151', textAlign: 'center' },
  deviceInfo: { marginTop: 20, fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 }
});
