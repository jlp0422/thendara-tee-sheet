import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatTime } from '@/utils/dateHelpers';

export default function BookingSuccessScreen() {
  const { confirmationKey, time } = useLocalSearchParams<{
    confirmationKey: string;
    time: string;
  }>();

  return (
    <View className="flex-1 bg-forest-900 items-center justify-center px-8">
      <Text className="text-7xl mb-6">✅</Text>
      <Text className="text-white text-3xl font-bold mb-2">Booked!</Text>
      {time && (
        <Text className="text-green-200 text-lg mb-1">{formatTime(time)}</Text>
      )}
      <Text className="text-green-300 text-sm mb-10">
        Confirmation #{confirmationKey}
      </Text>

      <Pressable
        onPress={() => router.replace('/(tabs)')}
        className="bg-cream rounded-2xl px-8 py-4 active:opacity-70"
      >
        <Text className="text-forest-900 font-bold text-base">Back to Tee Sheet</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace('/(tabs)/my-times')}
        className="mt-3 active:opacity-60"
      >
        <Text className="text-green-300 text-sm">View My Tee Times</Text>
      </Pressable>
    </View>
  );
}
