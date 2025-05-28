import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Text, Title, TextInput, Button } from 'react-native-paper';
import { traditionalTransaction } from '../services/api';
import { getToken, removeToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { saveSecureTransaction } from '../utils/secureTransactions'; // Fixed import

export default function TraditionalTransactionScreen() {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const debugToken = async () => {
      const token = await getToken('traditional-token');
      console.log('🔐 Traditional JWT token from SecureStore:', token);
    };
    debugToken();
  }, []);

  const handleTransaction = async () => {
    console.log("\n=========== 💰 TRADITIONAL TRANSACTION STARTED ===========");
    
    Keyboard.dismiss();
    const token = await getToken('traditional-token');
    const amountValue = parseFloat(amount);

    if (!token) {
      console.log("❌ No authentication token found");
      Toast.show({ 
        type: 'error', 
        text1: 'Authentication Required', 
        text2: 'Please login again' 
      });
      navigation.navigate('TraditionalLoginScreen');
      return;
    }

    if (isNaN(amountValue)) {
      console.log("❌ Invalid amount entered");
      alert('Please enter a valid amount');
      return;
    }

    try {
      console.log(`📤 Sending transaction for amount: ₹${amountValue}`);
      await traditionalTransaction({ amount: amountValue }, token);
      console.log("✅ Transaction completed successfully on server");

      try {
        // ✅ Save secure transaction - with specific method parameter
        console.log("💾 Saving transaction to secure storage");
        const savedTx = await saveSecureTransaction(amountValue, 'Traditional');
        console.log(`✅ Transaction saved locally with ID: ${savedTx.id}`);
      } catch (storageError) {
        // Still proceed even if local storage fails
        console.error(`❌ Failed to save transaction locally: ${storageError.message}`);
      }

      console.log("=========== 💰 TRADITIONAL TRANSACTION COMPLETE ===========\n");
      
      Toast.show({ type: 'success', text1: 'Transaction successful' });
      navigation.navigate('TransactionSuccessScreen', {
        amount: amountValue,
        flow: 'Traditional',
      });
    } catch (error) {
      console.log("\n=========== ❌ TRADITIONAL TRANSACTION FAILED ===========");
      console.error('Transaction error:', error);
      
      // Detailed error logging
      if (error.response) {
        console.log(`❌ Server responded with status: ${error.response.status}`);
        console.log('❌ Response data:', error.response.data);
      } else if (error.request) {
        console.log('❌ No response received:', error.request);
      } else {
        console.log(`❌ Error setting up request: ${error.message}`);
      }
      
      console.log("=========== ❌ TRADITIONAL TRANSACTION FAILED ===========\n");
      
      Toast.show({ type: 'error', text1: 'Transaction failed' });
    }
  };

  const handleLogout = async () => {
    await removeToken('traditional-token');
    Toast.show({ type: 'info', text1: 'Logged out' });
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Transfer Amount</Title>
      <Text style={styles.subtitle}>
        Enter the amount to be transferred securely
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
        Submit Transaction
      </Button>

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6b7280', marginBottom: 24 },
  input: { marginBottom: 20 },
  button: { marginBottom: 20 },
  logoutButton: { borderColor: '#dc2626' },
});
