import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { login } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      Alert.alert('Sign In', 'Please enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch {
      Alert.alert('Sign In Failed', 'Check your username and password and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-forest-900"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-8 py-16"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-12">
          <View className="w-24 h-24 rounded-full bg-cream items-center justify-center mb-6">
            <Text className="text-4xl">⛳</Text>
          </View>
          <Text className="text-white text-3xl font-bold tracking-tight">Thendara</Text>
          <Text className="text-green-200 text-base mt-1">Golf Club</Text>
        </View>

        <View className="gap-4">
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="Email or username"
            className="bg-white"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            placeholder="Password"
          />
          <View className="mt-2">
            <Button label="Sign In" onPress={handleLogin} loading={loading} />
          </View>
        </View>

        <Text className="text-green-300 text-xs text-center mt-8">
          Forgot your password? Visit thendaragolfclub.com
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
