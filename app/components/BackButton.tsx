import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BackButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
});

export default BackButton; 