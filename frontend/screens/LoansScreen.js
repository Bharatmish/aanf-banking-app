import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const loans = [
  { id: '1', type: 'Personal Loan', status: 'Active', due: 'EMI due: 5 Jul' },
  { id: '2', type: 'Home Loan', status: 'Active', due: 'EMI due: 10 Jul' },
  { id: '3', type: 'Car Loan', status: 'Closed', due: 'No due' },
];

const LoansScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.loanItem}>
      <Icon name="cash-outline" size={24} color="#1B2B99" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={styles.loanType}>{item.type}</Text>
        <Text style={styles.loanStatus}>{item.status}</Text>
        <Text style={styles.loanDue}>{item.due}</Text>
      </View>
    </View>
  );

  const handleApplyLoan = () => {
    // You can navigate or show modal here
    alert('Redirecting to Apply for Loan');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#1B2B99"
      />

      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loans</Text>
        </View>
      </View>

      {/* Loan List */}
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleApplyLoan} activeOpacity={0.8}>
        <Icon name="add-circle" size={28} color="#fff" />
        <Text style={styles.fabText}>Apply Loan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B2B99',
  },
  headerContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 20,
  },
  loanItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2B99',
  },
  loanStatus: {
    fontSize: 14,
    color: '#23C784',
    marginTop: 2,
  },
  loanDue: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#1B2B99',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default LoansScreen;
