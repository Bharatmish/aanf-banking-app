// screens/TransactionHistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { getSecureTransactions, clearSecureTransactions } from '../utils/secureTransactions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Refresh transactions when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSecureTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSecureTransactions();
      setTransactions([]);
    } catch (err) {
      setError('Failed to clear transaction history');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={item.method === 'AANF' ? styles.aanfTitle : styles.traditionalTitle}>
          {item.method} Transaction
        </Title>
        <Divider style={styles.divider} />
        <Paragraph style={styles.amount}>Amount: ₹{item.amount}</Paragraph>
        <Paragraph style={styles.date}>Date: {new Date(item.timestamp).toLocaleString()}</Paragraph>
        <Paragraph style={styles.id}>ID: {item.id}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Loading secure transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>Secure Transaction History</Text>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No transactions yet.</Text>
          <Button 
            mode="contained" 
            style={styles.backButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            Back to Home
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          
          <Button 
            mode="outlined" 
            icon="delete" 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            Clear History
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1f2937',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  aanfTitle: {
    color: '#047857',
    fontWeight: 'bold',
  },
  traditionalTitle: {
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
  },
  date: {
    color: '#6b7280',
  },
  id: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 16,
  },
  clearButton: {
    marginVertical: 16,
    borderColor: '#dc2626',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});
