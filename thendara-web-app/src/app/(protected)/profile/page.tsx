'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const { golferId, classCode, email, fullName } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await logout();
    router.replace('/login');
  }

  return (
    <div className="flex flex-col min-h-full">
      <div
        className="bg-forest-900 px-5 pb-5 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <h1 className="text-white text-xl font-bold">Profile</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
          {fullName && <InfoRow label="Name" value={fullName} />}
          {email && <InfoRow label="Email" value={email} />}
          <InfoRow label="Member ID" value={String(golferId ?? '—')} />
          <InfoRow label="Class" value={classCode ?? '—'} />
        </div>

        <p className="text-xs text-stone-400 text-center px-4">
          To edit your profile, visit thendaragolfclub.com
        </p>

        <button
          onClick={() => setShowConfirm(true)}
          className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-700 font-semibold active:opacity-70"
        >
          Sign Out
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            <p className="text-forest-900 font-semibold text-lg text-center">Sign Out?</p>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing out…' : 'Sign Out'}
            </button>
            <button onClick={() => setShowConfirm(false)} className="text-stone-500 font-medium py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-stone-500 text-sm">{label}</span>
      <span className="text-forest-900 font-medium text-sm text-right flex-shrink">{value}</span>
    </div>
  );
}
