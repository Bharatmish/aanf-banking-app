import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTransaction = async (amount, method) => {
  try {
    const data = await AsyncStorage.getItem('transactions');
    const transactions = data ? JSON.parse(data) : [];

    transactions.push({
      amount,
      method,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (err) {
    console.error('❌ Failed to save transaction', err);
  }
};
