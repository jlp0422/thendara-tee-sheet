import { client } from './client';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
import type { TeeTimeSlot, TeeTimesResponse } from './types';
import { formatSearchDate } from '@/utils/dateHelpers';

const BASE_PATH = '/onlineres/onlineapi/api/v1/onlinereservation';

export async function registerTransactionId(transactionId: string): Promise<void> {
  await client.post(`${BASE_PATH}/RegisterTransactionId`, { transactionId });
}

export async function fetchTeeTimes(params: {
  date: Date;
  holes: 0 | 9 | 18;
  numberOfPlayer: 0 | 1 | 2 | 3 | 4;
  timeMin: number;
  timeMax: number;
  classCode: string;
}): Promise<TeeTimeSlot[]> {
  const transactionId = randomUUID();
  await registerTransactionId(transactionId);

  const res = await client.get<TeeTimesResponse>(`${BASE_PATH}/TeeTimes`, {
    params: {
      searchDate: formatSearchDate(params.date),
      holes: params.holes,
      numberOfPlayer: params.numberOfPlayer,
      courseIds: 1,
      searchTimeType: 0,
      transactionId,
      teeOffTimeMin: params.timeMin,
      teeOffTimeMax: params.timeMax,
      isChangeTeeOffTime: true,
      teeSheetSearchView: 5,
      classCode: params.classCode,
      defaultOnlineRate: 'N',
      isUseCapacityPricing: false,
      memberStoreId: 1,
      searchType: 1,
    },
  });

  return res.data.content ?? [];
}

export async function lockTeeTime(params: {
  teeSheetId: number;
  sessionId: string;
  golferId: number;
  classCode: string;
}): Promise<void> {
  await client.post(`${BASE_PATH}/LockTeeTimes`, {
    teeSheetIds: [params.teeSheetId],
    sessionId: params.sessionId,
    golferId: params.golferId,
    classCode: params.classCode,
    numberOfPlayer: 0,
    navigateUrl: '',
    isSmartCard: false,
    isGroupBooking: false,
    action: 'Online Reservation V5',
  });
}

export async function unlockTeeTime(params: {
  teeSheetId: number;
  sessionId: string;
  golferId: number;
}): Promise<void> {
  await client.post(`${BASE_PATH}/UnLockTeeTimes`, {
    teeSheetIds: [params.teeSheetId],
    sessionId: params.sessionId,
    golferId: params.golferId,
  });
}
