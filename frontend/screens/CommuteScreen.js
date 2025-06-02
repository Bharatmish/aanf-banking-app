// CommuteScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CommuteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commute Services</Text>
      <Text>Manage your commute options here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default CommuteScreen;
