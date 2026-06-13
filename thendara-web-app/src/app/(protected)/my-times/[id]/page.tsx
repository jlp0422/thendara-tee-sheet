'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cancelReservation } from '@/api/reservations';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Reservation } from '@/api/types';
import { formatReservationDate, formatTime } from '@/utils/dateHelpers';

export default function ReservationDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservation: Reservation = JSON.parse(decodeURIComponent(searchParams.get('d') ?? '{}'));
  const { golferId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  async function handleCancel() {
    if (!golferId) return;
    setLoading(true);
    setError('');
    try {
      await cancelReservation({ reservation, golferId });
      router.back();
    } catch {
      setError('Could not cancel this tee time. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <div
        className="bg-forest-900 px-5 pb-5 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button onClick={() => router.back()} className="mb-3 text-green-300 text-base active:opacity-60">
          ‹ My Tee Times
        </button>
        <p className="text-white text-2xl font-bold">{formatTime(reservation.startTime)}</p>
        <p className="text-green-300 text-sm mt-1">{formatReservationDate(reservation.startTime)}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
          <DetailRow label="Course" value={reservation.courseName} />
          <DetailRow label="Holes" value={`${reservation.holes} holes`} />
          <DetailRow label="Golfers" value={String(reservation.numberOfPlayer)} />
          <DetailRow label="Confirmation" value={`#${reservation.reservationConfirmKey}`} />
        </div>

        {reservation.reservationDetail.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Players</p>
            {reservation.reservationDetail.map((player, i) => (
              <div
                key={player.bookingId}
                className={`flex items-center justify-between py-2.5 ${i < reservation.reservationDetail.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <span className="text-forest-900 font-medium">{player.fullName}</span>
                <span className="text-stone-400 text-sm">#{player.participantNo}</span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {reservation.canCancel && (
          <div className="mt-2">
            <Button label="Cancel Tee Time" variant="danger" onPress={() => setShowConfirm(true)} loading={loading} />
          </div>
        )}
      </div>

      {/* Cancel confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            <p className="text-forest-900 font-semibold text-lg text-center">Cancel Tee Time?</p>
            <p className="text-stone-500 text-sm text-center">
              Cancel your {formatTime(reservation.startTime)} tee time on {formatReservationDate(reservation.startTime)}?
            </p>
            <Button label="Cancel Tee Time" variant="danger" onPress={handleCancel} loading={loading} />
            <button onClick={() => setShowConfirm(false)} className="text-stone-500 font-medium py-2">Keep It</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-500 text-sm">{label}</span>
      <span className="text-forest-900 font-medium text-sm">{value}</span>
    </div>
  );
}
