import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Text, Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { verifyOTP } from '../services/api';
import { saveToken } from '../utils/storage';

export default function TraditionalOTPScreen() {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();

  const handleVerify = async () => {
    try {
      const response = await verifyOTP({ otp });
      await saveToken('traditional-token', response.data.token);
      navigation.navigate('TraditionalDashboardScreen');
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <LinearGradient
      colors={['#1B2B99', '#23C784']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Title style={styles.title}>OTP Verification</Title>
            <Text style={styles.subtitle}>
              Enter the OTP sent to your registered mobile number
            </Text>
             <Text style={styles.staticLabel}>One Time Password</Text>
            <TextInput
              
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              mode="outlined"
              maxLength={6}
              style={styles.input}
              textColor='#fff'
              theme={{
                colors: {
                  primary: '#fff',
                  text: '#fff',
                  placeholder: "",
                  background: 'transparent',
                },
              }}
              outlineColor="rgba(255,255,255,0.5)"
              activeOutlineColor="#fff"
            />

            <Button
              mode="contained"
              onPress={handleVerify}
              buttonColor="#fff"
              textColor="#1B2B99"
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={{ paddingVertical: 10 }}
            >
              Verify & Continue
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: 'rgba(212, 225, 255, 0.8)',
  },
  input: {
    borderRadius: 14,
    marginBottom: 20,
  },
  staticLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 6,
  },
  button: {
    borderRadius: 14,
    marginTop: 10,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});
