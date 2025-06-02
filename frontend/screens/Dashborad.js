import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const quickActions = [
  { id: 'qa1', label: 'Check Balance', icon: 'wallet-outline' },
  { id: 'qa2', label: 'Transaction History', icon: 'receipt-outline' },
  { id: 'qa3', label: 'Send Money', icon: 'send-outline' },
  { id: 'qa4', label: 'UPI Payment', icon: 'qr-code-outline' },
];

const services = [
  { id: '1', label: 'Recharge & Bills', icon: 'phone-portrait-outline' },
  { id: '2', label: 'Commute', icon: 'bus-outline' },
  { id: '3', label: 'Bank Transfer', icon: 'swap-horizontal-outline' },
  { id: '4', label: 'Travel & Stay', icon: 'airplane-outline' },
  { id: '5', label: 'Loans', icon: 'cash-outline' },
  { id: '6', label: 'Insurance', icon: 'shield-checkmark-outline' },
  { id: '7', label: 'Savings', icon: 'piggy-bank-outline' },
  { id: '8', label: 'Mutual Funds', icon: 'trending-up-outline' },
];

const windowWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  // Navigation for quick actions
  const renderQuickAction = ({ item }) => {
    const handlePress = () => {
      switch (item.id) {
        case 'qa1':
          navigation.navigate('CheckBalanceScreen');
          break;
        case 'qa2':
          navigation.navigate('TransactionHistoryScreen');
          break;
        case 'qa3':
          navigation.navigate('AANFTransactionScreen');
          break;
        case 'qa4':
          navigation.navigate('UPIPaymentScreen');
          break;
        default:
          break;
      }
    };

    return (
      <TouchableOpacity
        style={styles.quickActionButton}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Icon name={item.icon} size={24} color="#1B2B99" />
        <Text style={styles.quickActionLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  // Navigation for services
  const renderService = ({ item }) => {
    const handleServicePress = () => {
      switch (item.id) {
        case '1':
          navigation.navigate('RechargeBillsScreen');
          break;
        case '2':
          navigation.navigate('CommuteScreen');
          break;
        case '3':
          navigation.navigate('BankTransferScreen');
          break;
        case '4':
          navigation.navigate('TravelStayScreen');
          break;
        case '5':
          navigation.navigate('LoansScreen');
          break;
        case '6':
          navigation.navigate('InsuranceScreen');
          break;
        case '7':
          navigation.navigate('SavingsScreen');
          break;
        case '8':
          navigation.navigate('MutualFundsScreen');
          break;
        default:
          break;
      }
    };

    return (
      <LinearGradient
        colors={['#3DC68D', '#1F9F72']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cardInner}
          onPress={handleServicePress}
        >
          <Icon name={item.icon} size={24} color="#fff" style={styles.cardIcon} />
          <Text style={styles.cardLabel}>{item.label}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'HomeScreen' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>AANF Banking</Text>
          <Text style={styles.welcome}>
            Advanced Authentication & Network Fingerprinting
          </Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </View>

        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footerNav}
      >
        <TouchableOpacity
          style={styles.footerNavItem}
          onPress={() => navigation.navigate('DashboardScreen')}
        >
          <Icon name="home-outline" size={26} color="#fff" />
          <Text style={styles.footerNavText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerNavItem}
          onPress={() => navigation.navigate('NotificationsScreen')}
        >
          <Icon name="notifications-outline" size={26} color="#fff" />
          <Text style={styles.footerNavText}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerNavItem}
          onPress={() => navigation.navigate('MessagesScreen')}
        >
          <Icon name="chatbubble-ellipses-outline" size={26} color="#fff" />
          <Text style={styles.footerNavText}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerNavItem} onPress={handleLogout}>
          <Icon name="log-out-outline" size={26} color="#fff" />
          <Text style={styles.footerNavText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B2B99',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
  },
  welcome: {
    marginTop: 6,
    fontSize: 12,
    color: '#D4E1FF',
    textAlign: 'center',
    maxWidth: 280,
  },
  quickActionsContainer: {
    marginBottom: 50,
  },
  quickActionsList: {
    paddingHorizontal: 10,
  },
  quickActionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    elevation: 5,
  },
  quickActionLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#1B2B99',
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 120,
    paddingHorizontal: 35,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 6,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
  footerNav: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerNavItem: {
    alignItems: 'center',
  },
  footerNavText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 3,
  },
});

export default DashboardScreen;
