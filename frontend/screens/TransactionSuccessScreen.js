import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveTransactionHistory } from '../utils/storage';

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

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require('../assets/success-animation.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      <Title style={styles.title}>Transaction Successful!</Title>
      <Text style={styles.text}>₹{amount} transferred via {flow}</Text>
      <Text style={styles.timestamp}>Time: {timestamp}</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.button}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  lottie: { width: 150, height: 150 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#16a34a', marginVertical: 12 },
  text: { fontSize: 16, color: '#374151', textAlign: 'center' },
  timestamp: { marginTop: 8, fontSize: 14, color: '#6b7280' },
  button: { marginTop: 24, backgroundColor: '#1e40af' },
});
