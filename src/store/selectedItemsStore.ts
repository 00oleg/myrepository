import { create } from 'zustand';

export interface SelectedItem {
  uid: string;
  name: string;
  earthAnimal: string;
}

interface SelectedItemsState {
  selectedItems: Record<string, SelectedItem>;
  toggleItem: (item: SelectedItem) => void;
  clearAll: () => void;
  isSelected: (uid: string) => boolean;
  getSelectedItems: () => SelectedItem[];
  getSelectedItemsCount: () => number;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  selectedItems: {},

  toggleItem: (item: SelectedItem) =>
    set((state) => {
      const newItems = { ...state.selectedItems };
      if (newItems[item.uid]) {
        delete newItems[item.uid];
      } else {
        newItems[item.uid] = item;
      }
      return { selectedItems: newItems };
    }),

  clearAll: () =>
    set(() => ({
      selectedItems: {},
    })),

  isSelected: (uid: string) => Boolean(get().selectedItems[uid]),

  getSelectedItems: () => Object.values(get().selectedItems),

  getSelectedItemsCount: () => Object.keys(get().selectedItems).length,
}));
