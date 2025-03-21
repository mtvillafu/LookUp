import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLoginModal } from '@/context/LoginModalContext'; // pulling from the modal context for state / functions
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated'; // general animations

export default function LoginModal() {
    const { isLoginModalVisible, hideLoginModal } = useLoginModal();
    const [isRegistering, setIsRegistering] = useState(false);

    // Shared value for fade-in/out effect
    const fadeAnim = useSharedValue(0);

    // Function to close modal with animation
    const handleClose = () => {
    fadeAnim.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(hideLoginModal)(); // Only hide modal AFTER animation completes
    });
  };

    // Trigger fade-in when modal is shown
    useEffect(() => {
        if (isLoginModalVisible) {
            fadeAnim.value = withTiming(1, { duration: 300 }); // Fade in
        }
    }, [isLoginModalVisible]);

    // Animated style for opacity transition
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

  return (
    <Modal transparent visible={isLoginModalVisible} onRequestClose={handleClose}>
      
    {/* Animated overlay for fade effect */}
    <Animated.View style={[styles.overlay, animatedStyle]}>
    
    {/* The Actual Modal */}
    <View style={styles.modalContainer}>
        
        {/* Determine if user is registering or logging in */}
        <Text style={styles.title}>{isRegistering ? "Register" : "Login"}</Text>

        {/* Input fields for email, password, and confirm password (if registering) */}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry />

        {/* Show confirm password field only if registering */}
        {isRegistering && (
        <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry />
        )}

        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleClose}>
        <Text style={styles.buttonText}>{isRegistering ? "Register" : "Login"}</Text>
        </TouchableOpacity>

        {/* Switch between login and register */}
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
            {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </Text>
        </TouchableOpacity>

        {/* Close button */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
    </Animated.View>
</Modal>
  );
}

// CSS Style sheet
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchText: { color: '#007bff', marginTop: 10 },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});
