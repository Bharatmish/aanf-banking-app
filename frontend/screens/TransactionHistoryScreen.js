import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { getTransactionHistory, clearTransactionHistory } from '../utils/storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TransactionHistoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { flow } = route.params || { flow: 'Traditional' };

  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTransactions = async () => {
    setRefreshing(true);
    const data = await getTransactionHistory(flow);
    setTransactions(data.reverse());
    setRefreshing(false);
  };

  useEffect(() => {
    loadTransactions();
  }, [flow]);

  const onClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all transactions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await clearTransactionHistory(flow);
            loadTransactions();
          },
        },
      ]
    );
  };

  const filteredTransactions = transactions.filter(item =>
    item.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.amount?.toString().includes(searchQuery)
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#059669', '#10b981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.aanfLabel}>
            <MaterialCommunityIcons name="shield-lock" size={16} color="#fff" />
            <Text style={styles.aanfText}>{flow}</Text>
          </View>
          {item.transactionId && (
            <Text style={styles.txnId} numberOfLines={1}>
              #{item.transactionId}
            </Text>
          )}
        </View>

        <Text style={styles.amount}>₹{item.amount}</Text>

        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <MaterialIcons name="access-time" size={14} color="#e0f2f1" />
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-done" size={14} color="#d1fae5" />
            <Text style={styles.status}>Completed</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1e3a8a', '#10b981']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction History</Text>
      </View>

      <Searchbar
        placeholder="Search by Transaction ID or Amount"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{ color: '#000' }}
        placeholderTextColor="#6b7280"
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No transactions found.</Text>
          </View>
        }
        renderItem={renderItem}
      />

      <TouchableOpacity onPress={onClearHistory} style={styles.fab}>
        <Ionicons name="trash-bin" size={24} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aanfLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aanfText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  txnId: {
    fontSize: 13,
    color: '#ecfdf5',
    maxWidth: 130,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timestamp: {
    fontSize: 13,
    color: '#e0f2f1',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  status: {
    fontSize: 13,
    color: '#d1fae5',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 15,
    color: '#f1f5f9',
    textAlign: 'center',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ef4444',
    borderRadius: 30,
    padding: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
