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
import DashboardScreen from '../screens/Dashborad';
import UPIPaymentScreen from '../screens/UpiPaymentScreen';
import CheckBalanceScreen from '../screens/CheckBalanceScreen';
import TraditionalDashboardScreen from '../screens/TraditionalDashboardScreen';
import RechargeBillsScreen from '../screens/RechargeBillsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import LoansScreen from '../screens/LoansScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import InsuranceScreen from '../screens/InsuranceScreen';
import TravelStayScreen from '../screens/TravelStayScreen';
import EnterPinScreen from '../screens/EnterPinScreen';
import MiniStatementScreen from '../screens/MiniStatementScreen';

import SavingsScreen from '../screens/SavingsScreen';
import MutualFundsScreen from '../screens/MutualFundsScreen';
import BankTransferScreen from '../screens/BankTransferScreen';
import CommuteScreen from '../screens/CommuteScreen';
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown:false}} />
      <Stack.Screen name="TraditionalLoginScreen" component={TraditionalLoginScreen} options={{headerShown:false}} />
      <Stack.Screen name="TraditionalOTPScreen" component={TraditionalOTPScreen} options={{headerShown:false}}/>
      <Stack.Screen name="TraditionalTransactionScreen" component={TraditionalTransactionScreen}options={{headerShown:false}} />
      <Stack.Screen name="AANFAuthScreen" component={AANFAuthScreen}options={{headerShown:false}} />
      <Stack.Screen name="TransactionHistoryScreen" component={TransactionHistoryScreen}options={{ title: 'Transaction History' , headerShown:false}}/>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen}options={{headerShown:false}} />
      <Stack.Screen name="AANFTransactionScreen" component={AANFTransactionScreen} options={{headerShown:false}}/>
      <Stack.Screen name="TransactionSuccessScreen" component={TransactionSuccessScreen} options={{headerShown:false}}/>
      <Stack.Screen name="UPIPaymentScreen" component={UPIPaymentScreen} options={{headerShown:false}}/>
      <Stack.Screen name="CheckBalanceScreen" component={CheckBalanceScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="TraditionalDashboardScreen"component={TraditionalDashboardScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="RechargeBillsScreen"component={RechargeBillsScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="MessagesScreen"component={MessagesScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="LoansScreen"component={LoansScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="NotificationsScreen"component={NotificationsScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="InsuranceScreen"component={InsuranceScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="TravelStayScreen"component={TravelStayScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="EnterPinScreen"component={EnterPinScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="SavingsScreen"component={SavingsScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="MutualFundsScreen"component={MutualFundsScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="BankTransferScreen"component={BankTransferScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="CommuteScreen"component={CommuteScreen} options={{headerShown:false}}/>
      <Stack.Screen name ="MiniStatementScreen"component={MiniStatementScreen} options={{headerShown:false}}/>
     </Stack.Navigator>
  );
}
