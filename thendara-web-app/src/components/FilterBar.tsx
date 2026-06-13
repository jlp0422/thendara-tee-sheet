'use client';
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

const timePresets = [
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
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-stone-500 w-20 shrink-0">{label}</span>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onSelect(opt.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
              value === opt.value
                ? 'bg-forest-900 border-forest-900 text-white'
                : 'bg-white border-stone-300 text-forest-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterBar() {
  const { filters, setPlayers, setHoles, setTimeRange } = useTeeSheetStore();
  const activePreset = timePresets.find((p) => p.min === filters.timeMin && p.max === filters.timeMax);

  return (
    <div className="bg-cream border-b border-stone-200 px-4 py-3 flex flex-col gap-3">
      <ChipGroup label="Players" options={playerOptions} value={filters.players} onSelect={setPlayers} />
      <ChipGroup label="Holes" options={holeOptions} value={filters.holes} onSelect={setHoles} />
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-stone-500 w-20 shrink-0">Time</span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {timePresets.map((p) => {
            const active = activePreset?.label === p.label;
            return (
              <button
                key={p.label}
                onClick={() => setTimeRange(p.min, p.max)}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                  active ? 'bg-forest-900 border-forest-900 text-white' : 'bg-white border-stone-300 text-forest-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
