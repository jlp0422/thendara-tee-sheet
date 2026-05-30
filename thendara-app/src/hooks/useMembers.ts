import { useCallback, useEffect, useState } from 'react';
import { fetchBuddies, fetchRecentPartners } from '@/api/members';
import type { Buddy, Member } from '@/api/types';
import { useAuthStore } from '@/store/authStore';

export function useMembers() {
  const { golferId } = useAuthStore();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [recent, setRecent] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!golferId) return;
    setLoading(true);
    try {
      const [b, r] = await Promise.all([
        fetchBuddies(),
        fetchRecentPartners(golferId),
      ]);
      setBuddies(b);
      // Deduplicate: exclude buddies from recent list
      const buddyIds = new Set(b.map((x) => x.golferId));
      setRecent(r.filter((m) => !buddyIds.has(m.golferId)));
    } finally {
      setLoading(false);
    }
  }, [golferId]);

  useEffect(() => { load(); }, [load]);

  return { buddies, recent, loading };
}
