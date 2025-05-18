import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { login } from '../services/api';

export default function TraditionalLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login({ username, password });
      navigation.navigate('TraditionalOTPScreen');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Title style={{ textAlign: 'center', marginBottom: 24, color: '#1e3a8a' }}>
        Traditional Login
      </Title>

      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={{ marginBottom: 16 }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 24 }}
      />

      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('AANFAuthScreen')}
        style={{ marginTop: 16 }}
      >
        Switch to AANF Flow
      </Button>
    </View>
  );
}
