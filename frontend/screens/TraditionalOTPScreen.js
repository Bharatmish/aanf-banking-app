import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, Title, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { verifyOTP } from '../services/api';
import { saveToken } from '../utils/storage';

export default function TraditionalOTPScreen() {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleVerify = async () => {
    try {
      const response = await verifyOTP({ otp });
      await saveToken('traditional-token', response.data.token);
      navigation.navigate('TraditionalTransactionScreen');
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Title style={styles.title}>OTP Verification</Title>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your registered mobile number
      </Text>

      <TextInput
        label="One-Time Password"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleVerify} style={styles.button}>
        Verify & Continue
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  input: { marginBottom: 20 },
  button: { paddingVertical: 8 },
});
