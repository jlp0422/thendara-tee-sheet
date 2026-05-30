import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { cancelReservation } from '@/api/reservations';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Reservation } from '@/api/types';
import { formatReservationDate, formatTime } from '@/utils/dateHelpers';

export default function ReservationDetailScreen() {
  const params = useLocalSearchParams<{ id: string; reservationData: string }>();
  const reservation: Reservation = JSON.parse(params.reservationData);
  const { golferId } = useAuthStore();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    Alert.alert(
      'Cancel Tee Time',
      `Cancel your ${formatTime(reservation.startTime)} tee time on ${formatReservationDate(reservation.startTime)}?`,
      [
        { text: 'Keep It', style: 'cancel' },
        {
          text: 'Cancel Tee Time',
          style: 'destructive',
          onPress: async () => {
            if (!golferId) return;
            setLoading(true);
            try {
              await cancelReservation({ reservation, golferId });
              Alert.alert('Cancelled', 'Your tee time has been cancelled.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch {
              Alert.alert('Error', 'Could not cancel this tee time. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-forest-900 pt-14 pb-5 px-5">
        <Pressable onPress={() => router.back()} className="mb-3 active:opacity-60">
          <Text className="text-green-300 text-base">‹ My Tee Times</Text>
        </Pressable>
        <Text className="text-white text-2xl font-bold">
          {formatTime(reservation.startTime)}
        </Text>
        <Text className="text-green-300 text-sm mt-1">
          {formatReservationDate(reservation.startTime)}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 gap-4">
        <View className="bg-white border border-stone-200 rounded-2xl p-5 gap-4">
          <DetailRow label="Course" value={reservation.courseName} />
          <DetailRow label="Holes" value={`${reservation.holes} holes`} />
          <DetailRow label="Golfers" value={String(reservation.numberOfPlayer)} />
          <DetailRow label="Confirmation" value={`#${reservation.reservationConfirmKey}`} />
        </View>

        {reservation.reservationDetail.length > 0 && (
          <View className="bg-white border border-stone-200 rounded-2xl p-5">
            <Text className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
              Players
            </Text>
            {reservation.reservationDetail.map((player) => (
              <View
                key={player.bookingId}
                className="flex-row items-center justify-between py-2.5 border-b border-stone-100 last:border-0"
              >
                <Text className="text-forest-900 font-medium">{player.fullName}</Text>
                <Text className="text-stone-400 text-sm">#{player.participantNo}</Text>
              </View>
            ))}
          </View>
        )}

        {reservation.canCancel && (
          <View className="mt-2">
            <Button
              label="Cancel Tee Time"
              variant="danger"
              onPress={handleCancel}
              loading={loading}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-stone-500 text-sm">{label}</Text>
      <Text className="text-forest-900 font-medium text-sm">{value}</Text>
    </View>
  );
}
