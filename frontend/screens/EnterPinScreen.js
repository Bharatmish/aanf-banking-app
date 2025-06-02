
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnterPinScreen() {
  const [pin, setPin] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const inputRef = useRef(null);

  const { mobile, amount, method } = route.params || {};

  const handleVerifyPin = () => {
    Keyboard.dismiss();
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'Please enter a valid 4-digit PIN',
      });
      return;
    }

    navigation.replace('TransactionSuccessScreen', {
      mobile,
      amount,
      method,
    });
  };

  const handleChange = (value) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <LinearGradient
      colors={['#1B2B99', '#23C784']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Enter your 4-digit PIN</Text>

            <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
              <View style={styles.dashContainer}>
                {[0, 1, 2, 3].map((index) => (
                  <View key={index} style={styles.dashBox}>
                    <Text style={styles.dashText}>{pin[index] ? '•' : ''}</Text>
                  </View>
                ))}
              </View>
            </TouchableWithoutFeedback>

            <RNTextInput
              ref={inputRef}
              value={pin}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={4}
              style={styles.hiddenInput}
              autoFocus
              secureTextEntry
            />

            <Button
              mode="contained"
              onPress={handleVerifyPin}
              buttonColor="#fff"
              textColor="#1B2B99"
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={{ paddingVertical: 10 }}
            >
              Confirm Transaction
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Toast />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
  },
  dashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginHorizontal: 20,
  },
  dashBox: {
    width: 50,
    height: 55,
    borderBottomWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  dashText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  button: {
    borderRadius: 14,
    marginTop: 10,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});
