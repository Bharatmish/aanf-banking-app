import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'transaction-history';

export const getTransactionHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load transaction history', error);
    return [];
  }
};

export const addTransactionToHistory = async (transaction) => {
  try {
    const history = await getTransactionHistory();
    history.unshift(transaction);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save transaction', error);
  }
};
