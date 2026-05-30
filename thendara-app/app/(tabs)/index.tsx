import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTeeTimes } from '@/hooks/useTeeTimes';
import { TeeTimeCard } from '@/components/TeeTimeCard';
import { FilterBar } from '@/components/FilterBar';
import { useTeeSheetStore } from '@/store/teeSheetStore';
import { addDays, formatDisplayDate, isToday } from '@/utils/dateHelpers';
import type { TeeTimeSlot } from '@/api/types';

export default function TeeSheetScreen() {
  const { filters, setDate } = useTeeSheetStore();
  const { slots, loading, error, refresh } = useTeeTimes();
  const [showPicker, setShowPicker] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date>(filters.date);

  function openPicker() {
    setPendingDate(filters.date);
    setShowPicker(true);
  }

  function closePicker() {
    setShowPicker(false);
  }

  function applyDate() {
    setDate(pendingDate);
    setShowPicker(false);
  }

  function goToToday() {
    closePicker();
    setDate(new Date());
  }

  function goToPrev() {
    closePicker();
    setDate(addDays(filters.date, -1));
  }

  function goToNext() {
    closePicker();
    setDate(addDays(filters.date, 1));
  }

  function handleSlotPress(slot: TeeTimeSlot) {
    router.push({
      pathname: '/book/[slotId]',
      params: { slotId: slot.teeSheetId, slotData: JSON.stringify(slot) },
    });
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="bg-forest-900 pt-14 pb-4 px-5">
        <Text className="text-white text-xl font-bold mb-3">Tee Sheet</Text>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={goToPrev} className="p-2 active:opacity-60">
            <Text className="text-white text-xl">‹</Text>
          </Pressable>

          <Pressable onPress={openPicker} className="flex-1 items-center py-1">
            <Text className="text-white text-base font-semibold">
              {formatDisplayDate(filters.date)}
            </Text>
            <Text className="text-green-300 text-xs mt-0.5">Tap to change</Text>
          </Pressable>

          <Pressable onPress={goToNext} className="p-2 active:opacity-60">
            <Text className="text-white text-xl">›</Text>
          </Pressable>

          {!isToday(filters.date) && (
            <Pressable
              onPress={goToToday}
              className="bg-green-700 rounded-lg px-2.5 py-1 active:opacity-70"
            >
              <Text className="text-white text-xs font-semibold">Today</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FilterBar />

      {/* Date picker modal */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={closePicker}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          {/* Dismiss tap area */}
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closePicker}
          />
          {/* Sheet */}
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
              <Pressable onPress={closePicker} hitSlop={12}>
                <Text style={{ color: '#6B7A6E', fontSize: 16 }}>Cancel</Text>
              </Pressable>
              <Text style={{ color: '#1B3A2D', fontWeight: '600', fontSize: 16 }}>Select Date</Text>
              <Pressable onPress={applyDate} hitSlop={12}>
                <Text style={{ color: '#1B3A2D', fontWeight: '700', fontSize: 16 }}>Apply</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={pendingDate}
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              maximumDate={addDays(new Date(), 30)}
              onChange={(_event, date) => { if (date) setPendingDate(date); }}
            />
            <View style={{ height: 34 }} />
          </View>
        </View>
      </Modal>

      {loading && !slots.length ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1B3A2D" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-stone-500 text-center">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => String(item.teeSheetId)}
          contentContainerClassName="px-4 pt-4 pb-8"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#1B3A2D" />
          }
          renderItem={({ item }) => (
            <TeeTimeCard slot={item} onPress={() => handleSlotPress(item)} />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 px-8">
              <Ionicons name="golf-outline" size={56} color="#9AA59D" />
              <Text className="text-stone-500 text-center mt-4">
                No tee times available for this date.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
