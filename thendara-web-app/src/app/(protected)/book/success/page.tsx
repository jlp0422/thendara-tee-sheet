'use client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/utils/dateHelpers';

export default function BookSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmationKey = searchParams.get('confirmationKey');
  const time = searchParams.get('time');

  return (
    <div
      className="min-h-full bg-forest-900 flex flex-col items-center justify-center px-8"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <span className="text-7xl mb-6">✅</span>
      <h1 className="text-white text-3xl font-bold mb-2">Booked!</h1>
      {time && <p className="text-green-200 text-lg mb-1">{formatTime(decodeURIComponent(time))}</p>}
      <p className="text-green-300 text-sm mb-10">Confirmation #{confirmationKey}</p>

      <button
        onClick={() => router.replace('/tee-sheet')}
        className="bg-cream text-forest-900 font-bold text-base rounded-2xl px-8 py-4 active:opacity-70"
      >
        Back to Tee Sheet
      </button>
      <button
        onClick={() => router.replace('/my-times')}
        className="mt-3 text-green-300 text-sm active:opacity-60"
      >
        View My Tee Times
      </button>
    </div>
  );
}
