import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Text, Card, Button, FAB, Searchbar } from 'react-native-paper';
import { getSecureTransactions, clearSecureTransactions } from '../utils/secureTransactions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerAnim = useRef(new Animated.Value(-50)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSecureTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(item => 
        item.amount.toString().includes(query) ||
        item.method.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSecureTransactions();
      setTransactions([]);
      setFilteredTransactions([]);
    } catch (err) {
      setError('Failed to clear transaction history');
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{
        translateY: slideAnim.interpolate({
          inputRange: [0, 20],
          outputRange: [0, 20],
        })
      }]
    }}>
      <Card style={[styles.card, { marginTop: index === 0 ? 0 : 12 }]}>
        <LinearGradient
          colors={item.method === 'AANF' 
            ? ['#00897b', '#00796b', '#00695c'] 
            : ['#3f51b5', '#3949ab', '#303f9f']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.methodBadge}>
                <MaterialCommunityIcons 
                  name={item.method === 'AANF' ? 'sim-outline' : 'lock-outline'} 
                  size={12} 
                  color="#fff" 
                />
                <Text style={styles.methodText}>{item.method}</Text>
              </View>
              <Text style={styles.transactionId}>#{item.id}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.detailText}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="check-circle-outline" size={12} color="#4ade80" />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient
          colors={['#303f9f', '#3949ab', '#5c6bc0']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#303f9f', '#3949ab', '#5c6bc0']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.header, {
        transform: [{ translateY: headerAnim }]
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Text style={styles.headerSubtitle}>
          {filteredTransactions.length} secure transactions
        </Text>
        
        {transactions.length > 0 && (
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search transactions..."
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchBar}
              inputStyle={styles.searchInput}
              iconColor="rgba(255,255,255,0.7)"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>
        )}
      </Animated.View>
      
      {error && (
        <Animated.View style={[styles.errorContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#f44336" />
          <Text style={styles.error}>{error}</Text>
        </Animated.View>
      )}
      
      {filteredTransactions.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, {
          opacity: fadeAnim,
          transform: [{ scale: fadeAnim }]
        }]}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="history" size={32} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No matching transactions' : 'No Transactions Yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Your transaction history will appear here once you start making transfers'
            }
          </Text>
          <Button 
            mode="contained" 
            buttonColor="#ffffff"
            textColor="#303f9f"
            style={styles.backButton}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            Back to Home
          </Button>
        </Animated.View>
      ) : (
        <>
          <FlatList
            data={filteredTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          
          <FAB
            icon="delete-outline"
            style={styles.fab}
            color="#fff"
            size="small"
            onPress={handleClearHistory}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  searchContainer: {
    width: '100%',
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    elevation: 0,
    height: 42,
  },
  searchInput: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  methodText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 11,
  },
  transactionId: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 2,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#4ade80',
    fontWeight: '600',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  error: {
    color: '#f44336',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  backToHomeButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  listContent: {
    paddingBottom: 80,
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#f44336',
    borderRadius: 12,
    elevation: 2,
  },
});
