// BankTransferScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BankTransferScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank Transfer</Text>
      <Text>Send money securely to other accounts.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default BankTransferScreen;
