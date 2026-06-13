'use client';
import type { TeeTimeSlot } from '@/api/types';
import { formatTime } from '@/utils/dateHelpers';

type Props = { slot: TeeTimeSlot; onPress: () => void };

export function TeeTimeCard({ slot, onPress }: Props) {
  const open = slot.availableParticipantNo.length;
  return (
    <button
      onClick={onPress}
      className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-4 mb-3 text-left active:opacity-70 transition-opacity"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-forest-900">{formatTime(slot.startTime)}</span>
        <span className="bg-forest-900 text-white text-xs font-semibold rounded-full px-3 py-1">
          {open} {open === 1 ? 'spot' : 'spots'}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-sm text-stone-500">{slot.holesDisplay}</span>
        <span className="text-stone-300">·</span>
        <span className="text-sm text-stone-500">{slot.playersDisplay}</span>
      </div>
    </button>
  );
}
