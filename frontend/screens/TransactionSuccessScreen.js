import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveTransactionHistory } from '../utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function TransactionSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const animation = useRef(null);

  const { amount, flow } = route.params || {};
  const timestamp = new Date().toLocaleString();

  useEffect(() => {
    // Save transaction history entry
    const save = async () => {
      await saveTransactionHistory({ amount, flow, timestamp });
    };
    save();

    // Play animation
    animation.current?.play();
  }, []);

  // Different gradient colors based on flow type
  const gradientColors = flow === 'AANF' ? 
    ['#00897b', '#00796b', '#00695c'] : 
    ['#3f51b5', '#3949ab', '#303f9f'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={gradientColors}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons 
            name={flow === 'AANF' ? "sim" : "lock"} 
            size={20} 
            color={flow === 'AANF' ? "#00897b" : "#3f51b5"} 
          />
        </View>
        
        <View style={styles.animationContainer}>
          <LottieView
            ref={animation}
            source={require('../assets/success-animation.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>

        <Title style={styles.title}>Transaction Successful</Title>
        
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <Text style={styles.amount}>{amount}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="credit-card-outline" 
              size={14} 
              color="#64748b" 
            />
            <Text style={styles.detailText}>
              Via {flow} Authentication
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={14} 
              color="#64748b" 
            />
            <Text style={styles.detailText}>{timestamp}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons 
              name="check-circle-outline" 
              size={14} 
              color="#10b981" 
            />
            <Text style={[styles.detailText, styles.successText]}>
              Payment Processed
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('HomeScreen')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor={flow === 'AANF' ? "#00897b" : "#3f51b5"}
        >
          Back to Home
        </Button>
        
        <Button
          mode="text"
          onPress={() => navigation.navigate('TransactionHistoryScreen')}
          style={styles.secondaryButton}
          labelStyle={styles.secondaryButtonLabel}
          textColor={flow === 'AANF' ? "#00897b" : "#3f51b5"}
        >
          View All Transactions
        </Button>
      </View>
      
      <View style={styles.securityBadge}>
        <MaterialCommunityIcons name="shield-check" size={12} color="#64748b" />
        <Text style={styles.securityText}>End-to-end encrypted transaction</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -18,
    zIndex: 10,
  },
  animationContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  lottie: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginRight: 2,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 8,
  },
  successText: {
    color: '#10b981',
    fontWeight: '500',
  },
  button: {
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderRadius: 8,
  },
  secondaryButtonLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },
  securityText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
});