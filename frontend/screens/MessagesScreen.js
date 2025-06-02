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

const messages = [
  { id: '1', sender: 'Bank Support', message: 'Your statement is ready to view.' },
  { id: '2', sender: 'Loan Dept.', message: 'Your loan EMI is due in 5 days.' },
  { id: '3', sender: 'Offers', message: 'Get 10% cashback on UPI payments!' },
  { id: '4', sender: 'Bank Alerts', message: 'Large withdrawal alert.' },
];

const MessagesScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} activeOpacity={0.7}>
      <Icon name="chatbubble-ellipses-outline" size={24} color="#1B2B99" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
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
  messageItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  sender: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2B99',
  },
  message: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});

export default MessagesScreen;
