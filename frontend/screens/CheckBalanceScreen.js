import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CheckBalanceScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = () => {
    setLoading(true);
    setTimeout(() => {
      setBalance(500000);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <MaterialCommunityIcons name="account-circle" size={50} color="#fff" />
          <View style={{ marginLeft: 12 }}>
            
            <Text style={styles.accountNumber}>Acc No: 1234 5678 9012</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Check Balance</Text>
          <Text style={styles.subtitle}>Your account balance is shown below</Text>
        </View>

        <View style={styles.balanceContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹ {balance.toFixed(2)}</Text>
              <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
                <Icon name="refresh" size={22} color="#fff" />
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Mini Statement Button */}
        <TouchableOpacity
          style={styles.statementButton}
          onPress={() => navigation.navigate('MiniStatementScreen')}
        >
          <Icon name="list" size={20} color="#1B2B99" />
          <Text style={styles.statementText}>View Mini Statement</Text>
        </TouchableOpacity>
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
    paddingTop: 20,
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#3748B7',
    borderRadius: 30,
    padding: 10,
    elevation: 6,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 10,
  },
 
  accountNumber: {
    fontSize: 14,
    color: '#D4E1FF',
    fontFamily: 'Poppins-Regular',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#D4E1FF',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#D4E1FF',
    fontFamily: 'Poppins-Medium',
  },
  balanceAmount: {
    marginTop: 10,
    fontSize: 46,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  refreshButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 30,
    marginHorizontal: 40,
  },
  statementButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },
  statementText: {
    color: '#1B2B99',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
});

export default CheckBalanceScreen;
