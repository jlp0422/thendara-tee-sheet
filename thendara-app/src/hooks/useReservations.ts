import { useCallback, useEffect, useState } from 'react';
import { fetchUpcomingReservations } from '@/api/reservations';
import type { Reservation } from '@/api/types';
import { useAuthStore } from '@/store/authStore';

export function useReservations() {
  const { golferId } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!golferId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUpcomingReservations(golferId);
      setReservations(res.items);
    } catch (e) {
      console.error('[useReservations] fetch failed:', e);
      setError('Could not load reservations.');
    } finally {
      setLoading(false);
    }
  }, [golferId]);

  useEffect(() => { load(); }, [load]);

  return { reservations, loading, error, refresh: load };
}
