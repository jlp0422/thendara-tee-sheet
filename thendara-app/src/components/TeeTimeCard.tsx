import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TeeTimeSlot } from '@/api/types';
import { formatTime } from '@/utils/dateHelpers';

type Props = {
  slot: TeeTimeSlot;
  onPress: () => void;
};

export function TeeTimeCard({ slot, onPress }: Props) {
  const open = slot.availableParticipantNo.length;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-stone-200 rounded-2xl px-5 py-4 mb-3 active:opacity-70"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-forest-900">
          {formatTime(slot.startTime)}
        </Text>
        <View className="bg-forest-900 rounded-full px-3 py-1">
          <Text className="text-white text-xs font-semibold">
            {open} {open === 1 ? 'spot' : 'spots'}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3 mt-2">
        <Text className="text-sm text-stone-500">{slot.holesDisplay}</Text>
        <Text className="text-stone-300">·</Text>
        <Text className="text-sm text-stone-500">{slot.playersDisplay}</Text>
      </View>
    </Pressable>
  );
}
