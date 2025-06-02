import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const bills = [
  { id: '1', name: 'Mobile Recharge', due: 'Due: 25 Jun' },
  { id: '2', name: 'Electricity Bill', due: 'Due: 30 Jun' },
  { id: '3', name: 'Water Bill', due: 'Due: 28 Jun' },
  { id: '4', name: 'Internet Bill', due: 'Due: 1 Jul' },
  { id: '5', name: 'Gas Bill', due: 'Due: 5 Jul' },
  { id: '6', name: 'Credit Card', due: 'Due: 10 Jul' },
  { id: '7', name: 'Property Tax', due: 'Due: 15 Jul' },
];

const RechargeBillsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.billItem} activeOpacity={0.7}>
      <Icon name="card-outline" size={24} color="#1B2B99" />
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.billName}>{item.name}</Text>
        <Text style={styles.billDue}>{item.due}</Text>
      </View>
      <TouchableOpacity style={styles.payButton} activeOpacity={0.8}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#1B2B99"
      />

      {/* Gradient background fills entire screen */}
      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recharge & Bills</Text>
        </View>

        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B2B99',
  },
  gradientBackground: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    
     
     marginTop: 60,
    marginBottom: 10,
    
    paddingHorizontal: 20, // <-- Added this to move header down
  },

  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  billItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B2B99',
  },
  billDue: {
    fontSize: 12,
    color: '#555',
  },
  payButton: {
    marginLeft: 'auto',
    backgroundColor: '#23C784',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  payText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default RechargeBillsScreen;
