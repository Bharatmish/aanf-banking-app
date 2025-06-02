import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { saveTransaction } from '../utils/storage'; // your storage util

export default function TraditionalTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const amountValue = parseFloat(amount);
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Mobile Number',
        text2: 'Please enter a valid 10-digit mobile number',
      });
      return;
    }

    if (isNaN(amountValue) || amountValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter a valid amount greater than zero',
      });
      return;
    }

    try {
      await saveTransaction(amountValue, 'Traditional', mobile);

      Toast.show({
        type: 'success',
        text1: 'Transaction Saved',
        text2: 'Proceed to enter your PIN',
      });

      navigation.navigate('EnterPinScreen', {
        amount: amountValue,
        mobile,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Transaction Save Failed',
        text2: 'Please try again',
      });
      console.error('Failed to save transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Transfer via Mobile</Text>
          <Text style={styles.subtitle}>Send money securely using mobile number</Text>

          {/* Static label above input */}
          <Text style={styles.staticLabel}>Mobile Number</Text>
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
            maxLength={10}
            theme={{
              colors: {
                primary: '#fff',
                outline: 'rgba(255,255,255,0.5)',
                onSurfaceVariant: 'rgba(255,255,255,0.8)',
              },
            }}
            outlineColor="rgba(255,255,255,0.3)"
            activeOutlineColor="#fff"
            textColor="#fff"
            left={<TextInput.Icon icon="phone" iconColor="rgba(255,255,255,0.8)" />}
          />

          <Text style={styles.staticLabel}>Amount (₹)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: '#fff',
                outline: 'rgba(255,255,255,0.5)',
                onSurfaceVariant: 'rgba(255,255,255,0.8)',
              },
            }}
            outlineColor="rgba(255,255,255,0.3)"
            activeOutlineColor="#fff"
            textColor="#fff"
            left={<TextInput.Icon icon="cash" iconColor="rgba(255,255,255,0.8)" />}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            buttonColor="#fff"
            textColor="#1B2B99"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={{ paddingVertical: 10 }}
          >
            Proceed to PIN
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>

      <Toast />
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
    paddingTop: 40,
    paddingBottom: 24,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 50 : 70,
    marginLeft: 20,
    position: 'absolute',
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 80,
  },
  subtitle: {
    fontSize: 16,
    color: '#D4E1FF',
    textAlign: 'center',
    marginBottom: 32,
  },
  staticLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    marginBottom: 20,
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
