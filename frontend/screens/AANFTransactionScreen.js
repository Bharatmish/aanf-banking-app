import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Title, Text, TextInput, Button } from 'react-native-paper';
import { aanfTransaction } from '../services/api';
import { getToken, removeToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { saveTransaction } from '../utils/saveTransaction'; // ✅ Import here

export default function AANFTransactionScreen() {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const debugToken = async () => {
      const key = await getToken('akma-key');
      console.log('🔐 AKMA KEY from SecureStore:', key);
    };
    debugToken();
  }, []);

  const handleTransaction = async () => {
    Keyboard.dismiss();
    const akmaKey = await getToken('akma-key');
    const amountValue = parseFloat(amount);

    if (isNaN(amountValue)) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await aanfTransaction({ amount: amountValue }, akmaKey);

      // ✅ Save transaction
      await saveTransaction(amountValue, 'AANF');

      Toast.show({ type: 'success', text1: 'Transaction successful via AANF' });
      navigation.navigate('TransactionSuccessScreen', {
        amount: amountValue,
        flow: 'AANF',
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Transaction failed' });
    }
  };

  const handleLogout = async () => {
    await removeToken('akma-key');
    Toast.show({ type: 'info', text1: 'Logged out' });
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>AANF Secure Transaction</Title>
      <Text style={styles.subtitle}>
        Enter the amount to be transferred securely via SIM-based authentication
      </Text>

      <TextInput
        label="Amount (₹)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleTransaction} style={styles.button}>
        Submit Secure Transaction
      </Button>

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#047857', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  input: { marginBottom: 20 },
  button: { marginBottom: 20 },
  logoutButton: { borderColor: '#047857' },
});
