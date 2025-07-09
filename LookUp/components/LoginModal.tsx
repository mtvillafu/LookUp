import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLoginModal } from '@/context/LoginModalContext';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

export default function LoginModal() {
  const { isLoginModalVisible, hideLoginModal } = useLoginModal();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(''); 
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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

  const handleForgotPassword = () => {
    setError('');
    setSuccess('');
    console.log('forgot password email: ', email);

    fetch('http://134.199.204.181:3000/api/forgot-password-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to send reset email.');
        }
        setSuccess('Reset email sent! Check your inbox.');
      })
      .catch((err) => {
        setError(err.message || 'Failed to send reset email.');
      });
  };

  const handleRegister = () => {
    setError('');
    setSuccess('');

    fetch('http://134.199.204.181:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Registration failed.');
        }
        setSuccess('Registration successful! You can now log in.');
        setIsRegistering(false); // Switch back to login view
      })
      .catch((err) => {
        setError(err.message || 'Registration failed.');
      });
  };

  const handleLogin = () => {
    setError('');
    setSuccess('');
    fetch('http://134.199.204.181:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      })
        .then (async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || 'Login failed.');
          }
          setSuccess('Login successful!');
      })
    console.log('Logging in with:', { email, password });
  }

  const handleLoginAndRegister = () => {

    // Validate email and password
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (!isRegistering) {
      handleLogin();
      console.log('Logging in with:', { email, password });
    }
    else if (isRegistering)
    {
      handleRegister();
      console.log('Registering with:', { email, password });
    }
    
    handleClose(); // Close modal after successful login
  };

  return (
    <Modal transparent visible={isLoginModalVisible} onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {isForgotPassword
              ? 'Reset Password'
              : isRegistering
              ? 'Register'
              : 'Login'}
          </Text>

          {/* Forgot Password View */}
          {isForgotPassword ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                <Text style={styles.buttonText}>Send Reset Email</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
                <Text style={styles.switchText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          ) 
          : 
          ( 
            <>
              {/* Login/Register View */}
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {isRegistering && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                />
              )}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity style={styles.button} onPress={handleLoginAndRegister}>
                <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={styles.switchText}>
                  {isRegistering
                    ? 'Already have an account? Login'
                    : "Don't have an account? Register"}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password Button */}
              {!isRegistering && (
                <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                  <Text style={[styles.switchText, { color: '#ff9800' }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

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
  successText: {
    color: 'blue',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});
