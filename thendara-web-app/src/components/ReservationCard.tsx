'use client';
import type { Reservation } from '@/api/types';
import { formatTime } from '@/utils/dateHelpers';

type Props = { reservation: Reservation; onPress: () => void };

export function ReservationCard({ reservation, onPress }: Props) {
  const partners = reservation.reservationDetail.map((d) => d.firstName).join(', ');
  return (
    <button
      onClick={onPress}
      className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-4 mb-3 text-left active:opacity-70 transition-opacity"
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-forest-900">{formatTime(reservation.startTime)}</span>
        <span className="text-sm text-stone-500">{reservation.holes === 18 ? '18 holes' : '9 holes'}</span>
      </div>
      <p className="text-sm text-stone-500 mt-1">
        {reservation.numberOfPlayer} golfer{reservation.numberOfPlayer !== 1 ? 's' : ''}
        {partners ? ` · ${partners}` : ''}
      </p>
      <p className="text-xs font-medium text-forest-600 mt-2">#{reservation.reservationConfirmKey}</p>
    </button>
  );
}
