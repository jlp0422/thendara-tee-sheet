import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SectionList,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useReservations } from '@/hooks/useReservations';
import { ReservationCard } from '@/components/ReservationCard';
import { formatReservationDate, isSameDay } from '@/utils/dateHelpers';
import type { Reservation } from '@/api/types';

type Section = { title: string; data: Reservation[] };

function groupByDate(reservations: Reservation[]): Section[] {
  const map = new Map<string, Reservation[]>();
  for (const r of reservations) {
    const d = new Date(r.startTime);
    const key = formatReservationDate(r.startTime);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

export default function MyTimesScreen() {
  const { reservations, loading, error, refresh } = useReservations();
  const sections = groupByDate(reservations);

  function handlePress(reservation: Reservation) {
    router.push({
      pathname: '/reservation/[id]',
      params: {
        id: reservation.reservationId,
        reservationData: JSON.stringify(reservation),
      },
    });
  }

  if (loading && !reservations.length) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#1B3A2D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-forest-900 pt-14 pb-5 px-5">
        <Text className="text-white text-xl font-bold">My Tee Times</Text>
      </View>

      {sections.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">📅</Text>
          <Text className="text-stone-500 text-center px-8">
            {error ?? 'No upcoming tee times.'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.reservationId)}
          contentContainerClassName="px-4 pt-4 pb-8"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#1B3A2D" />
          }
          renderSectionHeader={({ section }) => (
            <Text className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2 mt-4 first:mt-0">
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <ReservationCard reservation={item} onPress={() => handlePress(item)} />
          )}
        />
      )}
    </View>
  );
}
