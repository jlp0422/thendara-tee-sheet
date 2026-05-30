import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

import { lockTeeTime, unlockTeeTime } from '@/api/teeTimes';
import { reserveTeeTime } from '@/api/reservations';
import { useMembers } from '@/hooks/useMembers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Member, TeeTimeSlot } from '@/api/types';
import { formatDisplayDate, formatTime } from '@/utils/dateHelpers';

export default function BookScreen() {
  const params = useLocalSearchParams<{ slotId: string; slotData: string }>();
  const slot: TeeTimeSlot = JSON.parse(params.slotData);
  const { golferId, classCode, email } = useAuthStore();

  const holesOptions: number[] = [];
  if (slot.isContain9HoleItems) holesOptions.push(9);
  if (slot.isContain18HoleItems) holesOptions.push(18);

  const [selectedHoles, setSelectedHoles] = useState<number>(
    holesOptions[holesOptions.length - 1] ?? 18,
  );
  // availableParticipantNo contains position indices (e.g. [3,4]) — its length is how many spots are open
  const availableSpots = slot.availableParticipantNo.length;
  const [selectedPlayers, setSelectedPlayers] = useState<number>(1);
  const [selectedPartners, setSelectedPartners] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const { buddies, recent, loading: membersLoading } = useMembers();

  // Generate stable IDs for this booking session
  const sessionId = useRef(randomUUID()).current;
  const bookingTransactionId = useRef(randomUUID()).current;
  const transactionId = useRef(randomUUID()).current;

  const maxPartners = selectedPlayers - 1;

  function togglePartner(member: Member) {
    setSelectedPartners((prev) => {
      const exists = prev.some((p) => p.golferId === member.golferId);
      if (exists) return prev.filter((p) => p.golferId !== member.golferId);
      if (prev.length >= maxPartners) return prev;
      return [...prev, member];
    });
  }

  async function handleConfirm() {
    if (!golferId || !classCode) return;
    setLoading(true);
    try {
      await lockTeeTime({
        teeSheetId: slot.teeSheetId,
        sessionId,
        golferId,
        classCode,
      });

      const result = await reserveTeeTime({
        lockedSessionId: sessionId,
        bookingTransactionId,
        transactionId,
        golferId,
        email: email ?? '',
      });

      router.replace({
        pathname: '/book/success',
        params: { confirmationKey: result.confirmationKey, time: slot.startTime },
      });
    } catch (e) {
      console.error('[BookScreen] booking failed:', e);
      await unlockTeeTime({ teeSheetId: slot.teeSheetId, sessionId, golferId }).catch(() => {});
      Alert.alert('Booking Failed', 'This tee time may no longer be available. Please try another.');
    } finally {
      setLoading(false);
    }
  }

  async function handleBack() {
    if (golferId) {
      await unlockTeeTime({ teeSheetId: slot.teeSheetId, sessionId, golferId }).catch(() => {});
    }
    router.back();
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="bg-forest-900 pt-14 pb-5 px-5">
        <Pressable onPress={handleBack} className="mb-3 active:opacity-60">
          <Text className="text-green-300 text-base">‹ Back</Text>
        </Pressable>
        <Text className="text-white text-2xl font-bold">{formatTime(slot.startTime)}</Text>
        <Text className="text-green-300 text-sm mt-1">
          {formatDisplayDate(new Date(slot.startTime))}
        </Text>
      </View>

      <ScrollView contentContainerClassName="px-5 py-6 gap-6" keyboardShouldPersistTaps="handled">
        {/* Holes */}
        {holesOptions.length > 1 && (
          <View>
            <Text className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-3">
              Holes
            </Text>
            <View className="flex-row gap-3">
              {holesOptions.map((h) => (
                <Pressable
                  key={h}
                  onPress={() => setSelectedHoles(h)}
                  className={`flex-1 py-3 rounded-xl border items-center ${
                    selectedHoles === h ? 'bg-forest-900 border-forest-900' : 'bg-white border-stone-200'
                  }`}
                >
                  <Text
                    className={`font-semibold text-base ${
                      selectedHoles === h ? 'text-white' : 'text-forest-900'
                    }`}
                  >
                    {h} holes
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Players */}
        <View>
          <Text className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-3">
            Number of Players
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {Array.from({ length: availableSpots }, (_, i) => i + 1).map((n) => (
              <Pressable
                key={n}
                onPress={() => {
                  setSelectedPlayers(n);
                  setSelectedPartners((prev) => prev.slice(0, n - 1));
                }}
                className={`w-14 h-14 rounded-xl border items-center justify-center ${
                  selectedPlayers === n ? 'bg-forest-900 border-forest-900' : 'bg-white border-stone-200'
                }`}
              >
                <Text
                  className={`font-bold text-lg ${
                    selectedPlayers === n ? 'text-white' : 'text-forest-900'
                  }`}
                >
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Partners — optional */}
        {maxPartners > 0 && (
          <View>
            <Text className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-1">
              Playing Partners
            </Text>
            <Text className="text-xs text-stone-400 mb-3">
              Optional — unselected spots will be booked for you
            </Text>

            {membersLoading ? (
              <ActivityIndicator color="#1B3A2D" />
            ) : (
              <>
                {buddies.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-xs font-medium text-stone-400 mb-2">BUDDIES</Text>
                    {buddies.map((m) => (
                      <MemberRow
                        key={m.golferId}
                        member={m}
                        selected={selectedPartners.some((p) => p.golferId === m.golferId)}
                        disabled={
                          selectedPartners.length >= maxPartners &&
                          !selectedPartners.some((p) => p.golferId === m.golferId)
                        }
                        onPress={() => togglePartner(m)}
                      />
                    ))}
                  </View>
                )}
                {recent.length > 0 && (
                  <View>
                    <Text className="text-xs font-medium text-stone-400 mb-2">RECENT</Text>
                    {recent.map((m) => (
                      <MemberRow
                        key={m.golferId}
                        member={m}
                        selected={selectedPartners.some((p) => p.golferId === m.golferId)}
                        disabled={
                          selectedPartners.length >= maxPartners &&
                          !selectedPartners.some((p) => p.golferId === m.golferId)
                        }
                        onPress={() => togglePartner(m)}
                      />
                    ))}
                  </View>
                )}
                {buddies.length === 0 && recent.length === 0 && (
                  <Text className="text-stone-400 text-sm">No saved partners — spots booked for you.</Text>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-10 pt-4 border-t border-stone-200 bg-white">
        <Button
          label={`Book · ${selectedPlayers} Golfer${selectedPlayers !== 1 ? 's' : ''}`}
          onPress={handleConfirm}
          loading={loading}
        />
      </View>
    </View>
  );
}

function MemberRow({
  member,
  selected,
  disabled,
  onPress,
}: {
  member: Member;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const name = member.fullName ?? `${member.firstName} ${member.lastName}`;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-between py-3 border-b border-stone-100 ${
        disabled && !selected ? 'opacity-40' : ''
      }`}
    >
      <Text className="text-forest-900 font-medium">{name}</Text>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          selected ? 'bg-forest-900 border-forest-900' : 'border-stone-300'
        }`}
      >
        {selected && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>
    </Pressable>
  );
}
