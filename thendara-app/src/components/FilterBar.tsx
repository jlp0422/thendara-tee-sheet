import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTeeSheetStore } from '@/store/teeSheetStore';

type Chip<T> = { label: string; value: T };

const playerOptions: Chip<0 | 1 | 2 | 3 | 4>[] = [
  { label: 'Any', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

const holeOptions: Chip<0 | 9 | 18>[] = [
  { label: 'Any', value: 0 },
  { label: '9', value: 9 },
  { label: '18', value: 18 },
];

type TimePreset = { label: string; min: number; max: number };
const timePresets: TimePreset[] = [
  { label: 'All Day', min: 5, max: 21 },
  { label: 'Morning', min: 5, max: 12 },
  { label: 'Afternoon', min: 12, max: 17 },
  { label: 'Evening', min: 17, max: 21 },
];

function ChipGroup<T extends number>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: Chip<T>[];
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs font-medium text-stone-500 w-20">{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {options.map((opt) => (
            <Pressable
              key={String(opt.value)}
              onPress={() => onSelect(opt.value)}
              className={`px-3 py-1.5 rounded-full border ${
                value === opt.value
                  ? 'bg-forest-900 border-forest-900'
                  : 'bg-white border-stone-300'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  value === opt.value ? 'text-white' : 'text-forest-900'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function FilterBar() {
  const { filters, setPlayers, setHoles, setTimeRange } = useTeeSheetStore();

  const activePreset = timePresets.find(
    (p) => p.min === filters.timeMin && p.max === filters.timeMax,
  );

  return (
    <View className="bg-cream border-b border-stone-200 px-4 py-3 gap-3">
      <ChipGroup
        label="Players"
        options={playerOptions}
        value={filters.players}
        onSelect={setPlayers}
      />
      <ChipGroup
        label="Holes"
        options={holeOptions}
        value={filters.holes}
        onSelect={setHoles}
      />
      <View className="flex-row items-center gap-2">
        <Text className="text-xs font-medium text-stone-500 w-20">Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {timePresets.map((p) => {
              const active = activePreset?.label === p.label;
              return (
                <Pressable
                  key={p.label}
                  onPress={() => setTimeRange(p.min, p.max)}
                  className={`px-3 py-1.5 rounded-full border ${
                    active ? 'bg-forest-900 border-forest-900' : 'bg-white border-stone-300'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${active ? 'text-white' : 'text-forest-900'}`}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
