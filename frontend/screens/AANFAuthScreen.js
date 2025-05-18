import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import { authenticateAANF } from '../services/api';
import { saveToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

export default function AANFAuthScreen() {
  const [loading, setLoading] = useState(true);
  const [carrier, setCarrier] = useState('');
  const [model, setModel] = useState('');
  const [akmaKey, setAkmaKey] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const verifyDeviceAndAuthenticate = async () => {
      const net = await Network.getNetworkStateAsync();

      // ✅ Force trusted carrier (for demo)
      const carrierName = 'Jio'; // or net?.carrier || 'Unknown';
      const modelName = Device.modelName || 'Generic';

      setCarrier(carrierName);
      setModel(modelName);

      // Simulate loading/verification delay
      setTimeout(async () => {
        try {
          const response = await authenticateAANF({ carrier: carrierName, model: modelName });
          setAkmaKey(response.data.akma_key);
          await saveToken('akma-key', response.data.akma_key);
          navigation.navigate('AANFTransactionScreen');
        } catch {
          alert('SIM-based authentication failed');
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
