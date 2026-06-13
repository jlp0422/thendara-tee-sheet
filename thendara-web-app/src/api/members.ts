import { client } from './client';
import type { Buddy, Member } from './types';

const BASE_PATH = '/api/onlineres/onlineapi/api/v1/onlinereservation';

export async function fetchBuddies(): Promise<Buddy[]> {
  const res = await client.get<Buddy[]>(`${BASE_PATH}/BuddiesFetch`);
  return res.data ?? [];
}

export async function fetchRecentPartners(
  golferId: number,
  page = 1,
  pageSize = 12,
): Promise<Member[]> {
  const res = await client.get<{ items: Member[] }>(`${BASE_PATH}/GetLastPlayingPartners`, {
    params: { golferId, pageSize, currentPage: page },
  });
  return res.data.items ?? [];
}
