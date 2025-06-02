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

const policies = [
  { id: '1', type: 'Health Insurance', status: 'Active', expiry: 'Expires: 31 Dec 2025' },
  { id: '2', type: 'Vehicle Insurance', status: 'Active', expiry: 'Expires: 15 Aug 2025' },
  { id: '3', type: 'Home Insurance', status: 'Expired', expiry: 'Expired: 30 Nov 2023' },
];

const InsuranceScreen = ({ navigation }) => {
  const renderItem = ({ item }) => {
    const isExpired = item.status.toLowerCase() === 'expired';

    return (
      <View style={styles.policyItem}>
        <Icon name="shield-checkmark-outline" size={28} color="#1B2B99" />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={styles.policyType}>{item.type}</Text>
          <View style={styles.statusRow}>
            <Icon
              name={isExpired ? 'close-circle' : 'checkmark-circle'}
              size={18}
              color={isExpired ? 'red' : '#23C784'}
              style={{ marginRight: 5 }}
            />
            <Text style={[styles.policyStatus, isExpired && { color: 'red' }]}>
              {item.status}
            </Text>
          </View>
          <Text style={styles.policyExpiry}>{item.expiry}</Text>

          {isExpired && (
            <TouchableOpacity style={styles.renewButton}>
              <Text style={styles.renewButtonText}>Renew Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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

      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Insurance</Text>
        </View>
      </View>

      <FlatList
        data={policies}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1B2B99' },
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
  backButton: { marginRight: 15 },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  policyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    alignItems: 'flex-start',
  },
  policyType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2B99',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  policyStatus: {
    fontSize: 14,
    color: '#23C784',
  },
  policyExpiry: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  renewButton: {
    marginTop: 10,
    backgroundColor: '#1B2B99',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  renewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default InsuranceScreen;
