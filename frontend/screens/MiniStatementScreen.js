import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const mockTransactions = [
  { id: '1', type: 'Credit', amount: 2000, date: '2025-05-28' },
  { id: '2', type: 'Debit', amount: 500, date: '2025-05-27' },
  { id: '3', type: 'Debit', amount: 1500, date: '2025-05-26' },
  { id: '4', type: 'Credit', amount: 1000, date: '2025-05-25' },
  { id: '5', type: 'Debit', amount: 750, date: '2025-05-24' },
];

const MiniStatementScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={[styles.type, { color: item.type === 'Credit' ? '#23C784' : '#FF5B5B' }]}>
        {item.type}
      </Text>
      <Text style={styles.amount}>₹ {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1B2B99" />
      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Mini Statement</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: '#3748B7',
    borderRadius: 30,
    padding: 10,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  item: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  date: {
    color: '#D4E1FF',
    fontSize: 13,
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  amount: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MiniStatementScreen;
