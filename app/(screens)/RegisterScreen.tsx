import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ImageBackground, StyleSheet } from 'react-native';
import { API } from '../services/api';
import { saveToken } from '../utils/storage';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await API.post('/auth/register', { email, password, name });
      await saveToken(res.data.token);
      //router.push('/HomeScreen');
    } catch (err: any) {
      Alert.alert('Registration failed', err.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#888"
        />
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
          <Button title="Register" onPress={handleRegister} color="#444" />
        </View>
        <View style={styles.button}>
          <Button
            title="Back to login"
            onPress={() => router.push('/LoginScreen')}
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
