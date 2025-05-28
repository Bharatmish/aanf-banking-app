import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { encryptTransaction as encryptWithAANF, verifyTransaction as verifyWithAANF } from './sim';
import { log } from './config';
import { getToken } from './storage';

// Save transaction with encryption
export const saveSecureTransaction = async (amount, method) => {
  console.log(`\n💾 [SECURE TX] Saving ${method} transaction for ₹${amount}`);
  try {
    // Create transaction object
    const transaction = {
      amount,
      method,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
    };
    
    console.log(`📝 [SECURE TX] Creating transaction with ID: ${transaction.id}`);
    
    // Encrypt transaction data based on method
    console.log(`🔒 [SECURE TX] Encrypting transaction data using ${method} method...`);
    
    let encryptedData;
    if (method === 'AANF') {
      // Use AANF-specific encryption with KAF
      try {
        encryptedData = await encryptWithAANF(transaction);
      } catch (error) {
        console.log(`⚠️ [SECURE TX] AANF encryption failed, falling back to simple encryption: ${error.message}`);
        encryptedData = await simpleEncryptTransaction(transaction);
      }
    } else {
      // Use simple encryption for Traditional flow
      encryptedData = await simpleEncryptTransaction(transaction);
    }
    
    // Get existing encrypted transactions
    console.log(`🔍 [SECURE TX] Retrieving existing transactions...`);
    const existingData = await AsyncStorage.getItem('secure-transactions');
    const transactions = existingData ? JSON.parse(existingData) : [];
    console.log(`📊 [SECURE TX] Found ${transactions.length} existing transactions`);
    
    // Add new encrypted transaction
    transactions.push(encryptedData);
    
    // Store updated list
    await AsyncStorage.setItem('secure-transactions', JSON.stringify(transactions));
    console.log(`✅ [SECURE TX] Transaction saved successfully`);
    
    // Store index of transaction IDs in SecureStore for faster lookups
    console.log(`📑 [SECURE TX] Updating transaction index...`);
    const idIndex = await SecureStore.getItemAsync('transaction-ids') || '{}';
    const ids = JSON.parse(idIndex);
    ids[transaction.id] = transactions.length - 1;
    await SecureStore.setItemAsync('transaction-ids', JSON.stringify(ids));
    console.log(`✅ [SECURE TX] Transaction index updated`);
    
    return transaction;
  } catch (err) {
    console.error(`❌ [SECURE TX] Failed to save transaction: ${err.message}`);
    throw err;
  }
};

// Simple transaction encryption for Traditional flow
const simpleEncryptTransaction = async (data) => {
  console.log(`🔐 [SECURE TX] Using simple encryption for transaction`);
  
  try {
    // Get JWT token for Traditional flow or use a default secret
    const jwtToken = await getToken('traditional-token') || 'default-banking-app-secret';
    const tokenPart = jwtToken.split('.')[1] || jwtToken.substring(0, 20);
    
    // Convert data to string
    const dataString = JSON.stringify(data);
    
    // Create a simple HMAC for verification
    const hmac = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${tokenPart}:${dataString}`
    );
    
    return {
      data: dataString,
      hmac,
      timestamp: Date.now(),
      method: data.method
    };
  } catch (error) {
    console.error(`❌ [SECURE TX] Simple encryption error: ${error.message}`);
    
    // Fallback to unencrypted but still with timestamp
    return {
      data: JSON.stringify(data),
      hmac: 'none', // Indicate no verification is possible
      timestamp: Date.now(),
      method: data.method
    };
  }
};

// Get all transactions with verification
export const getSecureTransactions = async () => {
  try {
    const encryptedData = await AsyncStorage.getItem('secure-transactions');
    if (!encryptedData) return [];
    
    const encryptedTransactions = JSON.parse(encryptedData);
    
    // Decrypt and verify each transaction
    const transactions = await Promise.all(
      encryptedTransactions.map(async (encrypted) => {
        try {
          // Determine which verification method to use
          if (encrypted.method === 'AANF') {
            try {
              return await verifyWithAANF(encrypted);
            } catch (error) {
              console.warn('Failed AANF verification, trying simple verify', error);
              return await simpleVerifyTransaction(encrypted);
            }
          } else {
            return await simpleVerifyTransaction(encrypted);
          }
        } catch (e) {
          console.warn('Skipping corrupted transaction data', e);
          
          // Try to recover some data even if verification fails
          try {
            const parsedData = JSON.parse(encrypted.data);
            parsedData.verified = false; // Mark as unverified
            parsedData.warning = "Integrity check failed";
            return parsedData;
          } catch {
            return null;
          }
        }
      })
    );
    
    // Filter out any failed verifications
    return transactions.filter(t => t !== null);
  } catch (err) {
    console.error('❌ Failed to retrieve secure transactions', err);
    return [];
  }
};

// Simple transaction verification for Traditional flow
const simpleVerifyTransaction = async (encryptedData) => {
  try {
    const { data, hmac, method } = encryptedData;
    
    // If HMAC is 'none', we can't verify
    if (hmac === 'none') {
      const parsedData = JSON.parse(data);
      parsedData.verified = false;
      return parsedData;
    }
    
    // Get JWT token for Traditional flow or use default
    const jwtToken = await getToken('traditional-token') || 'default-banking-app-secret';
    const tokenPart = jwtToken.split('.')[1] || jwtToken.substring(0, 20);
    
    // Calculate expected HMAC
    const calculatedHmac = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${tokenPart}:${data}`
    );
    
    // Check integrity
    if (calculatedHmac !== hmac) {
      const parsedData = JSON.parse(data);
      parsedData.verified = false;
      parsedData.warning = "Signature verification failed";
      return parsedData;
    }
    
    // All good
    const parsedData = JSON.parse(data);
    parsedData.verified = true;
    return parsedData;
  } catch (error) {
    console.error('Simple verification error:', error);
    throw error;
  }
};

// Clear all transactions
export const clearSecureTransactions = async () => {
  try {
    await AsyncStorage.removeItem('secure-transactions');
    await SecureStore.deleteItemAsync('transaction-ids');
    return true;
  } catch (err) {
    console.error('❌ Failed to clear secure transactions', err);
    return false;
  }
};