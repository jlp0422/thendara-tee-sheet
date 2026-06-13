'use client';
import { useRouter } from 'next/navigation';
import { useReservations } from '@/hooks/useReservations';
import { ReservationCard } from '@/components/ReservationCard';
import { formatReservationDate } from '@/utils/dateHelpers';
import type { Reservation } from '@/api/types';

function groupByDate(reservations: Reservation[]): { title: string; data: Reservation[] }[] {
  const map = new Map<string, Reservation[]>();
  for (const r of reservations) {
    const key = formatReservationDate(r.startTime);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

export default function MyTimesPage() {
  const router = useRouter();
  const { reservations, loading, error, refresh } = useReservations();
  const sections = groupByDate(reservations);

  function handlePress(r: Reservation) {
    router.push(`/my-times/${r.reservationId}?d=${encodeURIComponent(JSON.stringify(r))}`);
  }

  return (
    <div className="flex flex-col min-h-full">
      <div
        className="bg-forest-900 px-5 pb-5 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <h1 className="text-white text-xl font-bold">My Tee Times</h1>
      </div>

      {loading && !reservations.length ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-5xl mb-4">📅</span>
          <p className="text-stone-500 text-center px-8">{error ?? 'No upcoming tee times.'}</p>
          {error && (
            <button onClick={refresh} className="mt-4 text-forest-700 font-medium text-sm">Retry</button>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2 mt-4 first:mt-0">
                {section.title}
              </p>
              {section.data.map((r) => (
                <ReservationCard key={r.reservationId} reservation={r} onPress={() => handlePress(r)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
