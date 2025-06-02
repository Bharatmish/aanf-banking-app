import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CryptoJS from 'crypto-js';

import { aanfTransaction } from '../services/api';
import { getToken, removeToken } from '../utils/storage';
import { saveSecureTransaction } from '../utils/secureTransactions';

const AANFTransactionScreen = () => {
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [amountError, setAmountError] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const key = await getToken('akma-key');
      console.log('🔐 AKMA KEY:', key?.substring(0, 8) + '...');
    })();
  }, []);

  const validate = () => {
    let valid = true;

    if (!mobile.trim()) {
      setMobileError('Mobile number is required.');
      valid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Enter a valid 10-digit mobile number.');
      valid = false;
    } else {
      setMobileError('');
    }

    if (!amount.trim()) {
      setAmountError('Amount is required.');
      valid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setAmountError('Enter a valid amount (up to 2 decimals).');
      valid = false;
    } else if (parseFloat(amount) <= 0) {
      setAmountError('Amount must be greater than 0.');
      valid = false;
    } else {
      setAmountError('');
    }

    return valid;
  };

  const createHmacSignature = (data, key) => {
    const canonicalData = JSON.stringify({ amount: parseFloat(parseFloat(data.amount).toFixed(1)) });
    return CryptoJS.HmacSHA256(canonicalData, key).toString(CryptoJS.enc.Hex);
  };

  const handleTransaction = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const akmaKey = await getToken('akma-key');
    const kaf = await getToken('kaf-transactions');
    const kafExpiry = await getToken('kaf-expiry');
    const amountValue = parseFloat(amount);

    if (kafExpiry && Date.now() / 1000 > parseInt(kafExpiry)) {
      Toast.show({ type: 'error', text1: 'Session expired', text2: 'Please re-authenticate' });
      navigation.navigate('AANFAuthScreen');
      return;
    }

    try {
      const transactionData = { amount: amountValue };
      let signature = kaf ? createHmacSignature(transactionData, kaf) : null;

      const response = await aanfTransaction(transactionData, akmaKey, signature);
      await saveSecureTransaction(amountValue, 'AANF');

      Toast.show({ type: 'success', text1: 'Transaction successful via AANF' });

      navigation.navigate('TransactionSuccessScreen', {
        amount: amountValue,
        mobile,
        remarks,
        flow: 'AANF',
      });
    } catch (error) {
      console.error('❌ AANF Transaction Error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Transaction failed';
      Toast.show({ type: 'error', text1: 'Transaction Failed', text2: errorMsg });
    }
  };

  const handleLogout = async () => {
    await removeToken('akma-key');
    await removeToken('kaf-transactions');
    Toast.show({ type: 'info', text1: 'Logged out' });
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  return (
    <LinearGradient
      colors={['#1B2B99', '#23C784']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Tranfer Money</Text>
        <Text style={styles.subtitle}>Authenticated via AKMA/KAF</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, mobileError && styles.inputError]}
            placeholder="Recipient Mobile Number"
            placeholderTextColor="#99AABB"
            keyboardType="numeric"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />
          {mobileError && <Text style={styles.errorText}>{mobileError}</Text>}

          <TextInput
            style={[styles.input, amountError && styles.inputError]}
            placeholder="Amount (₹)"
            placeholderTextColor="#99AABB"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {amountError && <Text style={styles.errorText}>{amountError}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Remarks (optional)"
            placeholderTextColor="#99AABB"
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>

        <TouchableOpacity onPress={handleTransaction} activeOpacity={0.9} style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#3DC68D', '#1F9F72']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.sendButton}
          >
            <Text style={styles.sendText}>Send Money</Text>
            <MaterialIcons name="send" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}></Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 30,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#D4E1FF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
  buttonWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sendText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#C8E2D5',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default AANFTransactionScreen;
