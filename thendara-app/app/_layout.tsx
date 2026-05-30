import '../global.css';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { getAccessToken, getClassCode, getEmail, getFullName, getGolferId, isSessionValid, rollSessionExpiry } from '@/utils/session';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const { setAuth } = useAuthStore();

  useEffect(() => {
    (async () => {
      const valid = await isSessionValid();
      if (valid) {
        const [token, golferId, classCode, email, fullName] = await Promise.all([
          getAccessToken(),
          getGolferId(),
          getClassCode(),
          getEmail(),
          getFullName(),
        ]);
        if (token && golferId && classCode) {
          setAuth(token, golferId, classCode, email ?? '', fullName ?? '');
          await rollSessionExpiry();
        }
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/[slotId]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="reservation/[id]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
