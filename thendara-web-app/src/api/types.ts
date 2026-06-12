export type TeeTimeSlot = {
  teeSheetId: number;
  startTime: string;
  courseTimeId: number;
  startingTee: number;
  holes: number;
  courseId: number;
  courseDate: string;
  courseName: string;
  participants: number;
  minPlayer: number;
  maxPlayer: number;
  availableParticipantNo: number[];
  holesDisplay: string;
  playersDisplay: string;
  isContain9HoleItems: boolean;
  isContain18HoleItems: boolean;
};

export type TeeTimesResponse = {
  transactionId: string;
  isSuccess: boolean;
  content: TeeTimeSlot[];
};

export type Reservation = {
  reservationId: number;
  reservationConfirmKey: string;
  teeSheetId: number;
  startTime: string;
  holes: number;
  courseName: string;
  numberOfPlayer: number;
  maxNumberOfPlayer: number;
  canCancel: boolean;
  canEdit: boolean;
  reservationDetail: ReservationPlayer[];
};

export type ReservationPlayer = {
  bookingId: number;
  golferId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  participantNo: number;
};

export type UpcomingReservationsResponse = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: Reservation[];
};

export type Member = {
  golferId: number;
  firstName: string;
  lastName: string;
  email: string;
  acct: string;
  classCode?: string;
  fullName?: string;
};

export type Buddy = Member & {
  buddyId: number;
};

export type BookingResult = {
  reservationId: number;
  bookingIds: number[];
  confirmationKey: string;
  reservationResult: number;
  bookingGolferId: number;
};
