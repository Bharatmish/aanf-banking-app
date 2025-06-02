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

const notifications = [
  { id: '1', title: 'Transaction Alert', detail: 'You sent ₹500 to John Doe.' },
  { id: '2', title: 'Payment Reminder', detail: 'Electricity bill due on 30 Jun.' },
  { id: '3', title: 'Security Alert', detail: 'New device login detected.' },
  { id: '4', title: 'Offer', detail: 'Get 5% cashback on recharges this week.' },
];

const NotificationsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Icon name="notifications-outline" size={24} color="#1B2B99" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>{item.detail}</Text>
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

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
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
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2B99',
  },
  detail: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});

export default NotificationsScreen;
