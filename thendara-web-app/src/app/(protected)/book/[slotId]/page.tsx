'use client';
import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { lockTeeTime, unlockTeeTime } from '@/api/teeTimes';
import { reserveTeeTime } from '@/api/reservations';
import { useMembers } from '@/hooks/useMembers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Member, TeeTimeSlot } from '@/api/types';
import { formatDisplayDate, formatTime } from '@/utils/dateHelpers';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot: TeeTimeSlot = JSON.parse(decodeURIComponent(searchParams.get('d') ?? '{}'));
  const { golferId, classCode, email } = useAuthStore();

  const holesOptions: number[] = [];
  if (slot.isContain9HoleItems) holesOptions.push(9);
  if (slot.isContain18HoleItems) holesOptions.push(18);

  const [selectedHoles, setSelectedHoles] = useState<number>(holesOptions[holesOptions.length - 1] ?? 18);
  const availableSpots = slot.availableParticipantNo.length;
  const [selectedPlayers, setSelectedPlayers] = useState(1);
  const [selectedPartners, setSelectedPartners] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const { buddies, recent, loading: membersLoading } = useMembers();

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
    setBookingError('');
    try {
      await lockTeeTime({ teeSheetId: slot.teeSheetId, sessionId, golferId, classCode });
      const result = await reserveTeeTime({
        lockedSessionId: sessionId, bookingTransactionId, transactionId,
        golferId, email: email ?? '',
      });
      router.replace(`/book/success?confirmationKey=${result.confirmationKey}&time=${encodeURIComponent(slot.startTime)}`);
    } catch {
      await unlockTeeTime({ teeSheetId: slot.teeSheetId, sessionId, golferId: golferId! }).catch(() => {});
      setBookingError('This tee time may no longer be available. Please try another.');
    } finally {
      setLoading(false);
    }
  }

  async function handleBack() {
    if (golferId) await unlockTeeTime({ teeSheetId: slot.teeSheetId, sessionId, golferId }).catch(() => {});
    router.back();
  }

  return (
    <div className="flex flex-col min-h-full">
      <div
        className="bg-forest-900 px-5 pb-5 shrink-0"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button onClick={handleBack} className="mb-3 text-green-300 text-base active:opacity-60">
          ‹ Back
        </button>
        <p className="text-white text-2xl font-bold">{formatTime(slot.startTime)}</p>
        <p className="text-green-300 text-sm mt-1">{formatDisplayDate(new Date(slot.startTime))}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6">
        {/* Holes */}
        {holesOptions.length > 1 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Holes</p>
            <div className="flex gap-3">
              {holesOptions.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHoles(h)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-colors ${
                    selectedHoles === h ? 'bg-forest-900 border-forest-900 text-white' : 'bg-white border-stone-200 text-forest-900'
                  }`}
                >
                  {h} holes
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Number of Players</p>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: availableSpots }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => { setSelectedPlayers(n); setSelectedPartners((prev) => prev.slice(0, n - 1)); }}
                className={`w-14 h-14 rounded-xl border font-bold text-lg transition-colors ${
                  selectedPlayers === n ? 'bg-forest-900 border-forest-900 text-white' : 'bg-white border-stone-200 text-forest-900'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Partners */}
        {maxPartners > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1">Playing Partners</p>
            <p className="text-xs text-stone-400 mb-3">Optional — unselected spots will be booked for you</p>

            {membersLoading ? (
              <div className="w-6 h-6 border-2 border-forest-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {buddies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-stone-400 mb-2">BUDDIES</p>
                    {buddies.map((m) => (
                      <MemberRow
                        key={m.golferId} member={m}
                        selected={selectedPartners.some((p) => p.golferId === m.golferId)}
                        disabled={selectedPartners.length >= maxPartners && !selectedPartners.some((p) => p.golferId === m.golferId)}
                        onPress={() => togglePartner(m)}
                      />
                    ))}
                  </div>
                )}
                {recent.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-stone-400 mb-2">RECENT</p>
                    {recent.map((m) => (
                      <MemberRow
                        key={m.golferId} member={m}
                        selected={selectedPartners.some((p) => p.golferId === m.golferId)}
                        disabled={selectedPartners.length >= maxPartners && !selectedPartners.some((p) => p.golferId === m.golferId)}
                        onPress={() => togglePartner(m)}
                      />
                    ))}
                  </div>
                )}
                {buddies.length === 0 && recent.length === 0 && (
                  <p className="text-stone-400 text-sm">No saved partners — spots booked for you.</p>
                )}
              </>
            )}
          </div>
        )}

        {bookingError && <p className="text-red-600 text-sm">{bookingError}</p>}
      </div>

      <div className="px-5 pt-4 pb-8 border-t border-stone-200 bg-white shrink-0">
        <Button
          label={`Book · ${selectedPlayers} Golfer${selectedPlayers !== 1 ? 's' : ''}`}
          onPress={handleConfirm}
          loading={loading}
        />
      </div>
    </div>
  );
}

function MemberRow({ member, selected, disabled, onPress }: {
  member: Member; selected: boolean; disabled: boolean; onPress: () => void;
}) {
  const name = member.fullName ?? `${member.firstName} ${member.lastName}`;
  return (
    <button
      onClick={onPress}
      disabled={disabled && !selected}
      className={`w-full flex items-center justify-between py-3 border-b border-stone-100 ${disabled && !selected ? 'opacity-40' : ''}`}
    >
      <span className="text-forest-900 font-medium">{name}</span>
      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'bg-forest-900 border-forest-900' : 'border-stone-300'}`}>
        {selected && <span className="text-white text-xs font-bold">✓</span>}
      </span>
    </button>
  );
}
