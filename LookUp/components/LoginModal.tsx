import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLoginModal } from '@/context/LoginModalContext';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

export default function LoginModal() {
  const { isLoginModalVisible, hideLoginModal } = useLoginModal();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

// Shared value for fade-in/out effect
  const fadeAnim = useSharedValue(0);

// Function to close modal with animation
  const handleClose = () => {
    fadeAnim.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(hideLoginModal)();
    });
  };

  useEffect(() => {
    if (isLoginModalVisible) {
      fadeAnim.value = withTiming(1, { duration: 300 });
    }
  }, [isLoginModalVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const handleLogin = () => {
    // Reset error state
    setError('');

    // Validate email and password
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    // Perform login logic (e.g., API call)
    console.log('Logging in with:', { email, password });
    handleClose(); // Close modal after successful login
  };

  return (
    <Modal transparent visible={isLoginModalVisible} onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Show confirm password field only if registering */}
          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry
            />
          )}

          {/* Display error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
            <Text style={styles.switchText}>
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});
