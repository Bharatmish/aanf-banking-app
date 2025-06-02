import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function UPIPaymentScreen() {
  const navigation = useNavigation();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  const validateUPI = (id) => id.includes('@') && !id.includes(' ');

  const getUPIUrl = () => {
    const base = 'upi://pay';
    const params = new URLSearchParams({
      pa: upiId,
      pn: 'Recipient',
      am: amount,
      cu: 'INR',
      tn: remark || 'UPI Payment',
    });
    return `${base}?${params.toString()}`;
  };

  const onPayPress = () => {
    Keyboard.dismiss();
    if (!upiId.trim()) return setError('Please enter UPI ID');
    if (!validateUPI(upiId)) return setError('Invalid UPI ID format');
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return setError('Enter a valid amount');

    setError('');
    navigation.navigate('TransactionSuccessScreen', {
      amount,
      flow: 'UPI',
      upiId,
      remark,
    });
  };

  const onScanPay = () => {
    const url = getUPIUrl();
    Linking.openURL(url).catch(() =>
      Toast.show({ type: 'error', text1: 'UPI App Error', text2: 'No UPI app found.' })
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1B2B99" />
      <LinearGradient
        colors={['#1B2B99', '#23C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Send Money via UPI</Text>
          <Text style={styles.subtitle}>Secure and Instant UPI Transfer</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput
              style={[styles.input, error.includes('UPI') && styles.inputError]}
              placeholder="e.g. name@bank"
              placeholderTextColor="#99AABB"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={[styles.input, error.includes('amount') && styles.inputError]}
              placeholder="Enter amount"
              placeholderTextColor="#99AABB"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Remarks (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Payment notes"
              placeholderTextColor="#99AABB"
              value={remark}
              onChangeText={setRemark}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity activeOpacity={0.85} onPress={onPayPress} style={styles.sendBtnWrapper}>
              <LinearGradient
                colors={['#3DC68D', '#1F9F72']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.sendButton}
              >
                <Text style={styles.sendButtonText}>Pay Now</Text>
                <MaterialIcons name="send" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton} onPress={onScanPay}>
              <Text style={styles.outlineButtonText}>Open in UPI App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#D4E1FF',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  inputGroup: {
    marginBottom: 40,
  },
  label: {
    color: '#C7E1FF',
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 14,
    textAlign: 'center',
  },
  sendBtnWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 10,
  },
  sendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  outlineButton: {
    marginTop: 12,
    borderColor: '#fff',
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
