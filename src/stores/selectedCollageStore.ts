import { create } from "zustand";

interface SelectedCollageState {
  selectedCollage: Set<string>;
  setSelectedCollage: (newSet: Set<string>) => void;
}

export const useSelectedCollageStore = create<SelectedCollageState>((set) => ({
  selectedCollage: new Set<string>(),
  setSelectedCollage: (newSet: Set<string>) => {
    set({ selectedCollage: new Set(newSet) });
  },
}));

