'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeeTimes } from '@/hooks/useTeeTimes';
import { TeeTimeCard } from '@/components/TeeTimeCard';
import { FilterBar } from '@/components/FilterBar';
import { useTeeSheetStore } from '@/store/teeSheetStore';
import { addDays, formatDisplayDate, isToday, toDateInputValue, fromDateInputValue } from '@/utils/dateHelpers';
import type { TeeTimeSlot } from '@/api/types';

export default function TeeSheetPage() {
  const router = useRouter();
  const { filters, setDate } = useTeeSheetStore();
  const { slots, loading, error, refresh } = useTeeTimes();
  const [showPicker, setShowPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState(filters.date);

  const today = new Date();
  const maxDate = addDays(today, 30);

  function openPicker() { setPendingDate(filters.date); setShowPicker(true); }
  function closePicker() { setShowPicker(false); }
  function applyDate() { setDate(pendingDate); setShowPicker(false); }

  function handleSlotPress(slot: TeeTimeSlot) {
    router.push(`/book/${slot.teeSheetId}?d=${encodeURIComponent(JSON.stringify(slot))}`);
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div
        className="bg-forest-900 px-5 pb-4 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <h1 className="text-white text-xl font-bold mb-3">Tee Sheet</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(addDays(filters.date, -1))}
            className="p-2 text-white text-2xl leading-none active:opacity-60"
          >
            ‹
          </button>

          <button onClick={openPicker} className="flex-1 flex flex-col items-center py-1">
            <span className="text-white text-base font-semibold">{formatDisplayDate(filters.date)}</span>
            <span className="text-green-300 text-xs mt-0.5">Tap to change</span>
          </button>

          <button
            onClick={() => setDate(addDays(filters.date, 1))}
            className="p-2 text-white text-2xl leading-none active:opacity-60"
          >
            ›
          </button>

          {!isToday(filters.date) && (
            <button
              onClick={() => setDate(new Date())}
              className="bg-green-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold active:opacity-70"
            >
              Today
            </button>
          )}
        </div>
      </div>

      <FilterBar />

      {/* Date picker sheet */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closePicker} />
          <div className="relative bg-white rounded-t-3xl pb-safe">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <button onClick={closePicker} className="text-stone-500 text-base py-2 pr-4">Cancel</button>
              <span className="text-forest-900 font-semibold text-base">Select Date</span>
              <button onClick={applyDate} className="text-forest-900 font-bold text-base py-2 pl-4">Apply</button>
            </div>
            <div className="px-5 pb-8">
              <input
                type="date"
                className="w-full text-forest-900 text-center text-xl py-4 outline-none"
                value={toDateInputValue(pendingDate)}
                min={toDateInputValue(today)}
                max={toDateInputValue(maxDate)}
                onChange={(e) => { if (e.target.value) setPendingDate(fromDateInputValue(e.target.value)); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-4 pt-4 pb-4">
        {loading && !slots.length ? (
          <div className="flex items-center justify-center mt-20">
            <div className="w-8 h-8 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
            <p className="text-stone-500">{error}</p>
            <button onClick={refresh} className="mt-4 text-forest-700 font-medium text-sm">Retry</button>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
            <span className="text-6xl mb-4">⛳</span>
            <p className="text-stone-500">No tee times available for this date.</p>
          </div>
        ) : (
          <>
            {slots.map((slot) => (
              <TeeTimeCard key={slot.teeSheetId} slot={slot} onPress={() => handleSlotPress(slot)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
