import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { encryptTransaction as encryptWithAANF, verifyTransaction as verifyWithAANF } from './sim';
import { getToken } from './storage';

// Save a secure transaction (Traditional or AANF)
export const saveSecureTransaction = async (amount, method) => {
  console.log(`\n💾 [SECURE TX] Saving ${method} transaction for ₹${amount}`);

  try {
    const transaction = {
      amount,
      method,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
    };

    console.log(`📝 [SECURE TX] Creating transaction with ID: ${transaction.id}`);

    let encryptedData;
    if (method === 'AANF') {
      try {
        encryptedData = await encryptWithAANF(transaction);
      } catch (error) {
        console.warn(`⚠️ [SECURE TX] AANF encryption failed, using fallback: ${error.message}`);
        encryptedData = await simpleEncryptTransaction(transaction);
      }
    } else {
      encryptedData = await simpleEncryptTransaction(transaction);
    }

    // Retrieve existing transactions from AsyncStorage
    const existingData = await AsyncStorage.getItem('secure-transactions');
    const transactions = existingData ? JSON.parse(existingData) : [];

    transactions.push(encryptedData);
    await AsyncStorage.setItem('secure-transactions', JSON.stringify(transactions));

    console.log(`✅ [SECURE TX] Transaction saved to AsyncStorage`);

    // Save a minimal ID index (only if size is small)
    const idIndexRaw = await SecureStore.getItemAsync('transaction-ids');
    const ids = idIndexRaw ? JSON.parse(idIndexRaw) : {};
    ids[transaction.id] = transactions.length - 1;

    const idIndexStr = JSON.stringify(ids);
    if (idIndexStr.length < 2000) {
      await SecureStore.setItemAsync('transaction-ids', idIndexStr);
      console.log(`✅ [SECURE TX] ID index saved to SecureStore`);
    } else {
      console.warn(`⚠️ [SECURE TX] Skipped storing transaction IDs in SecureStore (size exceeds 2KB)`);
    }

    return transaction;
  } catch (err) {
    console.error(`❌ [SECURE TX] Failed to save transaction: ${err.message}`);
    throw err;
  }
};

// Simple HMAC-based encryption for Traditional flow
const simpleEncryptTransaction = async (data) => {
  console.log(`🔐 [SECURE TX] Encrypting using simple HMAC method`);

  try {
    const jwtToken = await getToken('traditional-token') || 'default-banking-app-secret';
    const tokenPart = jwtToken.split('.')[1] || jwtToken.substring(0, 20);

    const dataString = JSON.stringify(data);
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
    return {
      data: JSON.stringify(data),
      hmac: 'none',
      timestamp: Date.now(),
      method: data.method
    };
  }
};

// Retrieve and verify all stored transactions
export const getSecureTransactions = async () => {
  try {
    const encryptedData = await AsyncStorage.getItem('secure-transactions');
    if (!encryptedData) return [];

    const encryptedTransactions = JSON.parse(encryptedData);

    const transactions = await Promise.all(
      encryptedTransactions.map(async (encrypted) => {
        try {
          if (encrypted.method === 'AANF') {
            try {
              return await verifyWithAANF(encrypted);
            } catch (error) {
              console.warn('⚠️ AANF verification failed, falling back:', error.message);
              return await simpleVerifyTransaction(encrypted);
            }
          } else {
            return await simpleVerifyTransaction(encrypted);
          }
        } catch (e) {
          console.warn('⚠️ Skipping corrupted transaction', e);
          try {
            const parsedData = JSON.parse(encrypted.data);
            parsedData.verified = false;
            parsedData.warning = 'Integrity check failed';
            return parsedData;
          } catch {
            return null;
          }
        }
      })
    );

    return transactions.filter(Boolean);
  } catch (err) {
    console.error('❌ [SECURE TX] Failed to retrieve transactions:', err.message);
    return [];
  }
};

// Verify Traditional HMAC-based transaction
const simpleVerifyTransaction = async (encryptedData) => {
  try {
    const { data, hmac, method } = encryptedData;

    if (hmac === 'none') {
      const parsed = JSON.parse(data);
      parsed.verified = false;
      parsed.warning = 'No HMAC - cannot verify';
      return parsed;
    }

    const jwtToken = await getToken('traditional-token') || 'default-banking-app-secret';
    const tokenPart = jwtToken.split('.')[1] || jwtToken.substring(0, 20);

    const expectedHmac = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${tokenPart}:${data}`
    );

    const parsed = JSON.parse(data);
    parsed.verified = expectedHmac === hmac;
    if (!parsed.verified) parsed.warning = 'Signature mismatch';
    return parsed;
  } catch (error) {
    console.error('❌ [SECURE TX] Verification error:', error.message);
    throw error;
  }
};

// Clear all stored transactions and index
export const clearSecureTransactions = async () => {
  try {
    await AsyncStorage.removeItem('secure-transactions');
    await SecureStore.deleteItemAsync('transaction-ids');
    console.log('🧹 [SECURE TX] Cleared all stored transactions');
    return true;
  } catch (err) {
    console.error('❌ [SECURE TX] Clear failed:', err.message);
    return false;
  }
};
