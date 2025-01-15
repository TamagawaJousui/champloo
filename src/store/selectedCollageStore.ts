import { create } from "zustand";

export interface ImagePosition {
  x: number;
  y: number;
  scale: number;
}

interface SelectedCollageState {
  selectedCollage: Map<string, ImagePosition>;
  setSelectedCollage: (items: Set<string>) => void;
  regenerateAllPositions: () => void;
}

const generateImagePosition = (): ImagePosition => ({
  x: Math.random(),
  y: Math.random(),
  scale: Math.random() + 0.5,
});

export const useSelectedCollageStore = create<SelectedCollageState>(
  (set, get) => ({
    selectedCollage: new Map<string, ImagePosition>(),
    setSelectedCollage: (items: Set<string>) => {
      const newMap = new Map<string, ImagePosition>();
      const currentMap = get().selectedCollage;

      items.forEach((item) => {
        if (currentMap.has(item)) {
          newMap.set(item, currentMap.get(item)!);
        } else {
          newMap.set(item, generateImagePosition());
        }
      });

      set({ selectedCollage: newMap });
    },

    regenerateAllPositions: () => {
      const currentMap = get().selectedCollage;
      const newMap = new Map<string, ImagePosition>();

      currentMap.forEach((_, key) => {
        newMap.set(key, generateImagePosition());
      });

      set({ selectedCollage: newMap });
    },
  })
);
