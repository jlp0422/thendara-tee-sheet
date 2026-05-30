import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { logout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { golferId, classCode, email, fullName } = useAuthStore();

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); } },
    ]);
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-forest-900 pt-14 pb-5 px-5">
        <Text className="text-white text-xl font-bold">Profile</Text>
      </View>

      <View className="px-5 pt-6 gap-4">
        <View className="bg-white border border-stone-200 rounded-2xl p-5 gap-4">
          {fullName ? <InfoRow label="Name" value={fullName} /> : null}
          {email ? <InfoRow label="Email" value={email} /> : null}
          <InfoRow label="Member ID" value={String(golferId ?? '—')} />
          <InfoRow label="Class" value={classCode ?? '—'} />
        </View>

        <Text className="text-xs text-stone-400 text-center px-4">
          To edit your profile, visit thendaragolfclub.com
        </Text>

        <Pressable
          onPress={handleSignOut}
          className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 items-center active:opacity-70"
        >
          <Text className="text-red-700 font-semibold">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center gap-4">
      <Text className="text-stone-500 text-sm">{label}</Text>
      <Text className="text-forest-900 font-medium text-sm flex-shrink text-right">{value}</Text>
    </View>
  );
}
