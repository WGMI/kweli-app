import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { API } from '../../services/api';
import { getToken } from '../../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../components/BackButton';

export default function NewEntry() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            const token = await getToken();
            const res = await API.get('/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
            if (res.data.length > 0) {
                setCategoryId(res.data[0].id);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async () => {
        if (!title || !content || !categoryId) {
            Alert.alert('Please fill in all fields.');
            return;
        }

        const token = await getToken();

        try {
            await API.post(
                '/entries',
                {
                    title,
                    content,
                    date: new Date().toISOString(),
                    categoryId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Alert.alert('Entry created!');
            router.replace('/');
        } catch (err: any) {
            console.error(err.response?.data || err.message);
            Alert.alert('Error', err.response?.data?.message || 'Could not create entry.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />

            <Text style={styles.label}>Title</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>Content</Text>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Write your thoughts..."
                placeholderTextColor="#777"
                multiline
                numberOfLines={6}
                style={[styles.input, styles.textarea]}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
                <TouchableOpacity
                    onPress={() => setShowCategoryList(true)}
                    style={styles.dropdownButton}
                >
                    <Text style={styles.dropdownText}>
                        {categories.find(c => c.id === categoryId)?.name || 'Select category'}
                    </Text>
                </TouchableOpacity>

                {showCategoryList && (
                    <View style={styles.dropdown}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => {
                                    setCategoryId(cat.id);
                                    setShowCategoryList(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text style={styles.dropdownItemText}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </View>

            <Button title="Save Entry" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flexGrow: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    label: {
        color: '#fff',
        marginBottom: 5,
        marginTop: 20,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    textarea: {
        height: 120,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 20,
        marginTop: 5,
    },
    picker: {
        color: '#fff',
    },
    dropdownButton: {
        backgroundColor: '#222',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 5,
      },
      dropdownText: {
        color: '#fff',
      },
      dropdown: {
        backgroundColor: '#111',
        borderRadius: 8,
        marginBottom: 20,
      },
      dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
      },
      dropdownItemText: {
        color: '#fff',
      }      
});
