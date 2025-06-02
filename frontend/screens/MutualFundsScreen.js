// MutualFundsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MutualFundsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mutual Funds</Text>
      <Text>Invest and track your mutual funds portfolio.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default MutualFundsScreen;
