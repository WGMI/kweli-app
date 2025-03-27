import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { getToken, clearToken } from '../utils/storage';
import { API } from '../services/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();
      try {
        const res = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace('/LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>👤 Your Profile</Text>

      {user ? (
        <View>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      ) : (
        <Text style={styles.value}>Loading user info...</Text>
      )}

      <View style={{ marginTop: 30 }}>
        <Button title="Log Out" onPress={handleLogout} color="#ff4444" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 18,
  },
});
