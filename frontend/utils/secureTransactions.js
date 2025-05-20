import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { encryptTransaction, verifyTransaction } from './sim';
import { log } from './config';

// Save transaction with encryption
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
    
    // Encrypt transaction data
    console.log(`🔒 [SECURE TX] Encrypting transaction data...`);
    const encryptedData = await encryptTransaction(transaction);
    
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
          return await verifyTransaction(encrypted);
        } catch (e) {
          console.warn('Skipping corrupted transaction data', e);
          return null;
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