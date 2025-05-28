import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Title, Text, TextInput, Button } from 'react-native-paper';
import { aanfTransaction, BASE_URL } from '../services/api'; // Added BASE_URL import here
import { getToken, removeToken } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { saveSecureTransaction } from '../utils/secureTransactions';
import CryptoJS from 'crypto-js';

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

const createHmacSignature = (data, key) => {
  try {
    // Create canonical form with sorted keys, ensuring amount is a float with .0
    const amountAsFloat = parseFloat(parseFloat(data.amount).toFixed(1)); // Ensure float with one decimal
    const canonicalData = JSON.stringify({ amount: amountAsFloat }, null, 0);
    
    console.log('Canonical data:', canonicalData);
    console.log('Using KAF:', key.substring(0, 8) + '...');
    
    // Generate HMAC-SHA256 signature
    const hmacSignature = CryptoJS.HmacSHA256(canonicalData, key).toString(CryptoJS.enc.Hex);
    
    console.log('JSON string for signing:', canonicalData);
    console.log('Signature generated:', hmacSignature);
    
    return hmacSignature;
  } catch (error) {
    console.error("Signature generation error:", error);
    throw error;
  }
};

  const handleTransaction = async () => {
    console.log("\n=========== 💰 AANF TRANSACTION STARTED ===========");
    
    Keyboard.dismiss();
    const akmaKey = await getToken('akma-key');
    const amountValue = parseFloat(amount);
    const kaf = await getToken('kaf-transactions');
    const kafExpiry = await getToken('kaf-expiry');
    
    console.log(`🔑 Using AKMA key: ${akmaKey ? (akmaKey.substring(0, 8) + '...') : 'Not found'}`);
    console.log(`⏱️ KAF expiry: ${kafExpiry ? new Date(parseInt(kafExpiry) * 1000).toLocaleString() : 'Not set'}`);

    // Check if KAF session is expired
    if (kafExpiry && Date.now() / 1000 > parseInt(kafExpiry)) {
        console.log("⏰ KAF has expired. Redirecting to authentication...");
        Toast.show({ type: 'error', text1: 'Session expired', text2: 'Please re-authenticate' });
        navigation.navigate('AANFAuthScreen');
        return;
    }

    if (isNaN(amountValue)) {
        console.log("❌ Invalid amount entered");
        alert('Please enter a valid amount');
        return;
    }

    try {
        // Create transaction data
        const transactionData = { amount: parseFloat(amountValue) };
        console.log("📋 Transaction data:", transactionData);
        
        // Get KAF from secure storage
        console.log(`🔐 KAF retrieved: ${kaf ? 'Yes' : 'No'} ${kaf ? '(' + kaf.substring(0, 8) + '...)' : ''}`);
        
        // Create signature
        let signature = null;
        if (kaf) {
            try {
                console.log("🔏 Generating transaction signature...");
                signature = createHmacSignature(transactionData, kaf);
                console.log(`✅ Signature generated: ${signature.substring(0, 16)}...`);
            } catch (sigErr) {
                console.error('❌ Error generating signature:', sigErr);
            }
        }

        // Log the exact headers and data being sent
        const headers = { 'x-akma-key': akmaKey };
        if (signature) {
            headers['x-transaction-sig'] = signature;
        }
        console.log("📤 Sending transaction with headers:", headers);
        console.log("📤 Transaction data:", transactionData);
        
        // Send transaction
        console.log(`📤 Sending transaction request to: ${BASE_URL}/aanf/transaction`);
        const response = await aanfTransaction(transactionData, akmaKey, signature);
        console.log("✅ Transaction successful, response:", response.data);
        
        // Save to secure storage
        await saveSecureTransaction(amountValue, 'AANF');
        console.log("💾 Transaction saved to secure storage");
        
        console.log("=========== 💰 AANF TRANSACTION COMPLETE ===========\n");
        
        Toast.show({ type: 'success', text1: 'Transaction successful via AANF' });
        
        navigation.navigate('TransactionSuccessScreen', {
            amount: amountValue,
            flow: 'AANF',
        });
    } catch (error) {
        console.log("\n=========== ❌ AANF TRANSACTION FAILED ===========");
        console.error('Transaction error:', error);
        
        // Detailed error logging
        if (error.response) {
            console.log(`❌ Server responded with status: ${error.response.status}`);
            console.log('❌ Response data:', error.response.data);
            console.log('❌ Response headers:', error.response.headers);
        } else if (error.request) {
            console.log('❌ No response received:', error.request);
        } else {
            console.log(`❌ Error setting up request: ${error.message}`);
        }
        console.log("=========== ❌ AANF TRANSACTION FAILED ===========\n");
        
        // More specific error messages based on error type
        const errorMsg = error.response?.data?.detail || 
                        error.message || 
                        'Transaction failed';
        Toast.show({ 
            type: 'error', 
            text1: 'Transaction Failed', 
            text2: errorMsg 
        });
    }
  };

  const handleLogout = async () => {
    await removeToken('akma-key');
    await removeToken('kaf-transactions');
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
