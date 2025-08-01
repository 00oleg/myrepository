import { create } from 'zustand';

interface SelectedItemsState {
  selectedItems: Set<string>;
  toggleItem: (uid: string) => void;
  clearAll: () => void;
  isSelected: (uid: string) => boolean;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  selectedItems: new Set<string>(),
  toggleItem: (uid: string) =>
    set((state) => {
      const newSet = new Set(state.selectedItems);
      if (newSet.has(uid)) {
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return { selectedItems: newSet };
    }),
  clearAll: () =>
    set(() => ({
      selectedItems: new Set<string>(),
    })),
  isSelected: (uid: string) => get().selectedItems.has(uid),
}));
