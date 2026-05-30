import { create } from 'zustand';

export type TeeSheetFilters = {
  date: Date;
  players: 0 | 1 | 2 | 3 | 4; // 0 = any
  holes: 0 | 9 | 18; // 0 = both
  timeMin: number; // hour 0-23
  timeMax: number; // hour 0-23
};

type TeeSheetState = {
  filters: TeeSheetFilters;
  setDate: (date: Date) => void;
  setPlayers: (players: TeeSheetFilters['players']) => void;
  setHoles: (holes: TeeSheetFilters['holes']) => void;
  setTimeRange: (min: number, max: number) => void;
};

export const useTeeSheetStore = create<TeeSheetState>((set) => ({
  filters: {
    date: new Date(),
    players: 0,
    holes: 0,
    timeMin: 5,
    timeMax: 21,
  },
  setDate: (date) => set((s) => ({ filters: { ...s.filters, date } })),
  setPlayers: (players) => set((s) => ({ filters: { ...s.filters, players } })),
  setHoles: (holes) => set((s) => ({ filters: { ...s.filters, holes } })),
  setTimeRange: (timeMin, timeMax) =>
    set((s) => ({ filters: { ...s.filters, timeMin, timeMax } })),
}));
