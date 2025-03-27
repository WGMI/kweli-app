import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ImageBackground, StyleSheet } from 'react-native';
import { API } from '../services/api';
import { saveToken, getToken } from '../utils/storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getToken();
        if (token) {
          // User is already logged in, redirect to home
          router.replace('/');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLoginStatus();
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      await saveToken(res.data.token);
      router.replace('/'); // Navigate to index/home screen
    } catch (err: any) {
      Alert.alert('Login failed', err.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
        />
        <View style={styles.button}>
          <Button title="Login" onPress={handleLogin} color="#444" />
        </View>
        <View style={styles.button}>
          <Button
            title="Register"
            onPress={() => router.push('/RegisterScreen')}
            color="#444"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    marginVertical: 5,
  },
});
