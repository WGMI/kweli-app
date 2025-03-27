import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useGlobalSearchParams } from 'expo-router'
import { API } from '../../services/api'
import { getToken } from '@/app/utils/storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '@/app/components/BackButton'

const Read = () => {
    const router = useRouter()
    const [entry, setEntry] = useState<any>(null)
    const entryParam = useGlobalSearchParams()

    useEffect(() => {
        const fetchEntry = async () => {
            console.log(entryParam.entryId)
            const token = await getToken();
            try {
                const res = await API.get(`/entries/${entryParam.entryId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEntry(res.data)
            } catch (err) {
                console.error('Error fetching entry:', err)
            }
        }

        if (entryParam.entryId) {
            fetchEntry()
        }
    }, [entryParam])

    const handleDelete = async () => {
        const token = await getToken();
        if (!token) {
            router.replace('/LoginScreen');
            return;
        }

        try {
            console.log('Delete entryId',entryParam.entryId)
            const res = await API.delete(`/entries/${entryParam.entryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 204) {
                Alert.alert('Entry deleted successfully');
                router.push(`/?action=refresh`)
            }
        } catch (err) {
            console.error('Error deleting entry:', err);
            Alert.alert('Failed to delete entry');
        }
    };

    if (!entry) {
        return (
            <View style={styles.container}>
                <Text>Loading entry data...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.header}>
                <Text style={styles.title}>{entry.title}</Text>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.content}>{entry.content}</Text>
            <Text style={styles.date}>{new Date(entry.date).toLocaleDateString()}</Text>
            {entry.image && (
                <Image
                    source={{ uri: entry.image }}
                    style={styles.image}
                />
            )}  
        </SafeAreaView>
    )
}

export default Read

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
        color: '#ccc',
    },
    date: {
        fontSize: 12,
        color: '#aaa',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
    },
})