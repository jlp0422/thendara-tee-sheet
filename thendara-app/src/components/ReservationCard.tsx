import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Reservation } from '@/api/types';
import { formatTime } from '@/utils/dateHelpers';

type Props = {
  reservation: Reservation;
  onPress: () => void;
};

export function ReservationCard({ reservation, onPress }: Props) {
  const partners = reservation.reservationDetail.map((d) => d.firstName).join(', ');

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-stone-200 rounded-2xl px-5 py-4 mb-3 active:opacity-70"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-forest-900">
          {formatTime(reservation.startTime)}
        </Text>
        <Text className="text-sm text-stone-500">
          {reservation.holes === 18 ? '18 holes' : '9 holes'}
        </Text>
      </View>
      <Text className="text-sm text-stone-500 mt-1">
        {reservation.numberOfPlayer} golfer{reservation.numberOfPlayer !== 1 ? 's' : ''}
        {partners ? ` · ${partners}` : ''}
      </Text>
      <Text className="text-xs font-medium text-forest-600 mt-2">
        #{reservation.reservationConfirmKey}
      </Text>
    </Pressable>
  );
}
