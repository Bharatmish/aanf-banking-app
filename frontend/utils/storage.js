import * as SecureStore from 'expo-secure-store';

// -----------------------------
// ✅ Token Handling (JWT / AKMA)
// -----------------------------
export const saveToken = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error('❌ Failed to save token:', e);
  }
};

export const getToken = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.error('❌ Failed to get token:', e);
    return null;
  }
};

export const removeToken = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error('❌ Failed to remove token:', e);
  }
};

// --------------------------------------
// ✅ Transaction History Handling
// --------------------------------------
export const saveTransactionHistory = async (entry) => {
  try {
    const existing = await SecureStore.getItemAsync('transaction-history');
    const history = existing ? JSON.parse(existing) : [];
    history.push(entry);
    await SecureStore.setItemAsync('transaction-history', JSON.stringify(history));
  } catch (e) {
    console.error('❌ Failed to save transaction history:', e);
  }
};

export const getTransactionHistory = async () => {
  try {
    const data = await SecureStore.getItemAsync('transaction-history');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('❌ Failed to get transaction history:', e);
    return [];
  }
};

export const clearTransactionHistory = async () => {
  try {
    await SecureStore.deleteItemAsync('transaction-history');
  } catch (e) {
    console.error('❌ Failed to clear transaction history:', e);
  }
};
