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

const bookings = [
  { id: '1', type: 'Flight', details: 'NYC to LA - 25 June' },
  { id: '2', type: 'Hotel', details: 'Marriott Hotel, LA - 25-30 June' },
  { id: '3', type: 'Car Rental', details: 'Economy Car - 25-30 June' },
];

const iconMap = {
  Flight: 'airplane-outline',
  Hotel: 'bed-outline',
  'Car Rental': 'car-outline',
};

const TravelStayScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Icon name={iconMap[item.type]} size={28} color="#1B2B99" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={styles.bookingType}>{item.type}</Text>
        <Text style={styles.bookingDetails}>{item.details}</Text>
      </View>
    </View>
  );

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

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Travel & Stay</Text>
        </View>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1B2B99' },
  headerWrapper: {
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
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    alignItems: 'center',
  },
  bookingType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2B99',
  },
  bookingDetails: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});

export default TravelStayScreen;
