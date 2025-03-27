import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, ActivityIndicator,
  RefreshControl, TouchableOpacity, Modal, ScrollView, TextInput,
  Alert
} from 'react-native';
import { clearToken, getToken } from '../utils/storage';
import { API } from '../services/api';
import Controls from '@/components/controls';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [profile, setProfile] = useState<{email: string, id: number, name: string}>({ email: '', id: 0, name: '' });
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const router = useRouter();
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
    if (searchParams.action === 'refresh') {
      fetchEntries();
    }
  }, [searchParams.action]);

  const getProfile = async () => {
    const token = await getToken();
    if (!token) {
      router.replace('/LoginScreen');
      return;
    }

    try {
      const res = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      await clearToken();
      router.replace('/LoginScreen');
    }
  };

  const fetchEntries = async () => {
    const token = await getToken();
    if (!token) {
      router.replace('/LoginScreen');
      return;
    }

    try {
      const res = await API.get('/entries', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEntries(res.data);
      setFilteredEntries(res.data);

      const categories = res.data.map((entry: any) => entry.category.name);
      const uniqueCategories = [...new Set(categories)];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching entries:', err);
      await clearToken();
      router.replace('/LoginScreen');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace('/LoginScreen');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEntries();
  };

  const filterEntries = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.category.name === category));
    }
  };

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
      {['All', ...categories].map((category) => (
        <TouchableOpacity key={category} onPress={() => filterEntries(category)}>
          <Text style={selectedCategory === category ? styles.activeTab : styles.tab}>
            {category} (
            {category === 'All'
              ? entries.length
              : entries.filter(entry => entry.category.name === category).length}
            )
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/entries/read?entryId=${item.id}`)}>
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteText}>{item.content}</Text>
        <Text style={{ color: '#aaa', fontSize: 12 }}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.noteImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const handleCreate = (type: string) => {
    if (type === 'note') {
      router.push('/entries/new');
    } else if (type === 'category') {
      setCategoryModalVisible(true);
    }
  };

  const handleCreateCategory = async () => {
    const token = await getToken();
    if (!token) {
      router.replace('/LoginScreen');
      return;
    }

    try {
      const res = await API.post('/categories', { name: newCategoryName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewCategoryName('');
      setCategoryModalVisible(false);
      if (res.status === 201) {
        Alert.alert('Category created successfully');
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
        </TouchableOpacity>
        <Text style={styles.greeting}>Hi, {profile.name}</Text>
        <View style={styles.menuIcon} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Journal</Text>
        <TouchableOpacity onPress={() => router.push('/summary') } style={styles.summaryButton}>
          <Text style={styles.summaryButtonText}>Summary</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderTabs}
      />

      <Modal
        animationType="slide"
        transparent
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Category</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Category Name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateCategory}>
              <Text style={styles.modalButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonClose} onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Controls onPress={handleCreate} />

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/profile')}>
              <Text style={styles.modalButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
    paddingStart: 5,
    paddingEnd: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    color: '#fff',
    fontSize: 24,
  },
  menuIcon: {},
  title: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 20,
  },
  tab: {
    color: '#888',
    marginRight: 20,
  },
  noteCard: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  noteTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  noteText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  noteImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonClose: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryButton: {
    backgroundColor: '#444',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  summaryButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
