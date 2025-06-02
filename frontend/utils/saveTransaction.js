import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = 'transactions';

export const saveTransaction = async (amount, method, mobile) => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const transactions = data ? JSON.parse(data) : [];

    transactions.push({
      amount,
      method,      // "Traditional" or "AANF"
      mobile,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('❌ Failed to save transaction', err);
  }
};

export const getTransactions = async () => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('❌ Failed to get transactions', err);
    return [];
  }
};
