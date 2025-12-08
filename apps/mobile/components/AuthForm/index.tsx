import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, CreateUserSchema } from '@iot-smart-parking-system/shared-schemas';
import { z } from 'zod';
import * as authService from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { showSuccess, showError } from '@/utils/toast';

type AuthMode = 'login' | 'register';

type LoginFormData = z.infer<typeof LoginSchema>;
type RegisterFormData = z.infer<typeof CreateUserSchema>;

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore(state => state.setUser);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'user@parking.com',
      password: 'user123',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);

      // store user data in zustand
      await setUser(response.user, response.token);

      showSuccess('Success', `Welcome back, ${response.user.username}!`);
      onSuccess?.();
    } catch (error: any) {
      showError('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      showSuccess('Success', 'Account created! Please login.');
      setTimeout(() => {
        setMode('login');
        loginForm.setValue('email', data.email);
      }, 1500);
    } catch (error: any) {
      showError('Registration Failed', error.response?.data?.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    if (mode === 'login') {
      loginForm.handleSubmit(handleLogin)();
    } else {
      registerForm.handleSubmit(handleRegister)();
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setShowPassword(false);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>Smart Parking</Text>
            <Text style={styles.subtitle}>Find your perfect spot</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, mode === 'login' && styles.toggleButtonActive]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, mode === 'register' && styles.toggleButtonActive]}
                onPress={() => setMode('register')}
              >
                <Text style={[styles.toggleText, mode === 'register' && styles.toggleTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register - Username Field */}
            {mode === 'register' && (
              <View style={styles.inputGroup}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#667eea" />
                </View>
                <Controller
                  control={registerForm.control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  )}
                />
                {registerForm.formState.errors.username && (
                  <Text style={styles.errorText}>
                    {registerForm.formState.errors.username.message}
                  </Text>
                )}
              </View>
            )}

            {/* Email Field */}
            {mode === 'login' ? (
              <View style={styles.inputGroup} key="login-email">
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                </View>
                <Controller
                  control={loginForm.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {loginForm.formState.errors.email && (
                  <Text style={styles.errorText}>{loginForm.formState.errors.email.message}</Text>
                )}
              </View>
            ) : (
              <View style={styles.inputGroup} key="register-email">
                <View style={styles.inputIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" />
                </View>
                <Controller
                  control={registerForm.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {registerForm.formState.errors.email && (
                  <Text style={styles.errorText}>
                    {registerForm.formState.errors.email.message}
                  </Text>
                )}
              </View>
            )}

            {/* Password Field */}
            {mode === 'login' ? (
              <View style={styles.inputGroup} key="login-password">
                <View style={styles.inputIconContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                </View>
                <Controller
                  control={loginForm.control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
                {loginForm.formState.errors.password && (
                  <Text style={styles.errorText}>
                    {loginForm.formState.errors.password.message}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.inputGroup} key="register-password">
                <View style={styles.inputIconContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                </View>
                <Controller
                  control={registerForm.control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
                {registerForm.formState.errors.password && (
                  <Text style={styles.errorText}>
                    {registerForm.formState.errors.password.message}
                  </Text>
                )}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={onSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>
                    {mode === 'login' ? 'Login' : 'Create Account'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Mode Link */}
            <TouchableOpacity style={styles.switchModeContainer} onPress={toggleMode}>
              <Text style={styles.switchModeText}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text style={styles.switchModeLink}>{mode === 'login' ? 'Sign Up' : 'Login'}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#667eea',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputIconContainer: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    paddingVertical: 15,
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchModeContainer: {
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 14,
    color: '#666',
  },
  switchModeLink: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 100,
    left: -30,
  },
});
