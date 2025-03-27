import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ControlsProps {
  onPress: (type: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ onPress }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));
  
    const toggleMenu = () => {
      const toValue = isOpen ? 0 : 1;
  
      Animated.spring(animation, {
        toValue,
        friction: 5,
        useNativeDriver: true,
      }).start();
  
      setIsOpen(!isOpen);
    };

    const create = (type:string) => {
        setIsOpen(false);
        onPress(type)
    }
  
    const actionStyle = (offset: number) => ({
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -offset],
          }),
        },
      ],
    });
  
    return (
      <View style={styles.container}>
        {isOpen && (
          <>
            <Animated.View style={[styles.secondaryButton, actionStyle(120)]}>
              <TouchableOpacity onPress={() => create('note')} style={styles.buttonGreen}>
                <FontAwesome name="sticky-note" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.secondaryButton, actionStyle(60)]}>
              <TouchableOpacity onPress={() => create('category')} style={styles.buttonRed}>
                <FontAwesome name="object-group" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        <TouchableOpacity onPress={toggleMenu} style={styles.fab}>
          <FontAwesome name={isOpen ? 'close' : 'plus'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      alignItems: 'center',
    },
    fab: {
      width: 56,
      height: 56,
      opacity: 0.65,
      borderRadius: 28,
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    secondaryButton: {
      position: 'absolute',
    },
    buttonRed: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#BD1f29',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    buttonGreen: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#009F00',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
  });
  
  export default Controls;
