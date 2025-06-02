// SavingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SavingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings</Text>
      <Text>View and manage your savings accounts.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default SavingsScreen;
