import { client } from './client';
import type { BookingResult, Reservation, UpcomingReservationsResponse } from './types';

const BASE_PATH = '/onlineres/onlineapi/api/v1/onlinereservation';

export async function fetchUpcomingReservations(
  golferId: number,
  page = 1,
  pageSize = 14,
): Promise<UpcomingReservationsResponse> {
  const res = await client.get<UpcomingReservationsResponse>(
    `${BASE_PATH}/UpcomingReservation`,
    { params: { golferId, pageSize, currentPage: page } },
  );
  return res.data;
}

export async function reserveTeeTime(params: {
  lockedSessionId: string;
  bookingTransactionId: string;
  transactionId: string;
  golferId: number;
  email: string;
}): Promise<BookingResult> {
  const res = await client.post<BookingResult>(`${BASE_PATH}/ReserveTeeTimes`, {
    cancelReservationLink:
      'https://thendaragc.cps.golf/onlineresweb/auth/verify-email?returnUrl=cancel-booking',
    homePageLink: 'https://thendaragc.cps.golf/onlineresweb/',
    affiliateId: null,
    finalizeSaleModel: {
      acct: String(params.golferId),
      playerId: 0,
      isGuest: false,
      creditCardInfo: {
        cardNumber: null,
        cardHolder: null,
        expireMM: null,
        expireYY: null,
        cvv: null,
        email: params.email,
        cardToken: null,
      },
      monerisCC: null,
      ibxCC: null,
    },
    sessionGuid: null,
    lockedTeeTimesSessionId: params.lockedSessionId,
    bookingTransactionId: params.bookingTransactionId,
    transactionId: params.transactionId,
  });
  return res.data;
}

export async function cancelReservation(params: {
  reservation: Reservation;
  golferId: number;
}): Promise<void> {
  const { reservation, golferId } = params;
  const bookingIds = reservation.reservationDetail.map((d) => d.bookingId);

  await client.post(`${BASE_PATH}/CancelReservation`, {
    bookingIds,
    courseId: 1,
    golferId,
    reasonId: 0,
    cancellationIds: [],
    cancelDetail: {
      teeTime: reservation.startTime,
      holes: reservation.holes,
      reservationId: reservation.reservationId,
      teeSheetId: reservation.teeSheetId,
      numberOfPlayer: reservation.numberOfPlayer,
      playerNameList: reservation.reservationDetail.map((d) => d.fullName),
    },
  });
}
