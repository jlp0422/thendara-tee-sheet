'use client';
import { useCallback, useEffect, useState } from 'react';
import { fetchTeeTimes } from '@/api/teeTimes';
import type { TeeTimeSlot } from '@/api/types';
import { useAuthStore } from '@/store/authStore';
import { useTeeSheetStore } from '@/store/teeSheetStore';

export function useTeeTimes() {
  const { classCode } = useAuthStore();
  const { filters } = useTeeSheetStore();
  const [slots, setSlots] = useState<TeeTimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!classCode) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTeeTimes({
        date: filters.date,
        holes: filters.holes,
        numberOfPlayer: filters.players,
        timeMin: filters.timeMin,
        timeMax: filters.timeMax,
        classCode,
      });
      setSlots(result);
    } catch (e) {
      console.error('[useTeeTimes] fetch failed:', e);
      setError('Could not load tee times.');
    } finally {
      setLoading(false);
    }
  }, [classCode, filters]);

  useEffect(() => { load(); }, [load]);

  return { slots, loading, error, refresh: load };
}
