import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionSuccessScreen from '../screens/TransactionSuccessScreen';
import HomeScreen from '../screens/HomeScreen';
import TraditionalLoginScreen from '../screens/TraditionalLoginScreen';
import TraditionalOTPScreen from '../screens/TraditionalOTPScreen';
import TraditionalTransactionScreen from '../screens/TraditionalTransactionScreen';
import AANFAuthScreen from '../screens/AANFAuthScreen';
import AANFTransactionScreen from '../screens/AANFTransactionScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TraditionalLoginScreen" component={TraditionalLoginScreen} />
      <Stack.Screen name="TraditionalOTPScreen" component={TraditionalOTPScreen} />
      <Stack.Screen name="TraditionalTransactionScreen" component={TraditionalTransactionScreen} />
      <Stack.Screen name="AANFAuthScreen" component={AANFAuthScreen} />
      <Stack.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen}options={{ title: 'Transaction History' }}/>

      <Stack.Screen name="AANFTransactionScreen" component={AANFTransactionScreen} />
      <Stack.Screen name="TransactionSuccessScreen" component={TransactionSuccessScreen} />
    </Stack.Navigator>
  );
}
