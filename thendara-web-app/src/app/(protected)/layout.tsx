'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/BottomNav';
import { useAuthStore } from '@/store/authStore';
import {
  isSessionValid, getAccessToken, getGolferId, getClassCode,
  getEmail, getFullName, rollSessionExpiry,
} from '@/utils/session';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const valid = await isSessionValid();
      if (!valid) { router.replace('/login'); return; }

      const [token, golferId, classCode, email, fullName] = await Promise.all([
        getAccessToken(), getGolferId(), getClassCode(), getEmail(), getFullName(),
      ]);

      if (token && golferId) {
        setAuth(token, golferId, classCode!, email ?? '', fullName ?? '');
        await rollSessionExpiry();
      } else {
        router.replace('/login');
        return;
      }
      setReady(true);
    }
    init();
  }, [router, setAuth]);

  if (!ready) {
    return (
      <div className="h-dvh flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
