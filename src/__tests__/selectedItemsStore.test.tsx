import { useSelectedItemsStore } from '../store/selectedItemsStore';
import type { SelectedItem } from '../store/selectedItemsStore';

describe('useSelectedItemsStore', () => {
  const item1: SelectedItem = {
    uid: '1',
    name: 'Item 1',
    earthAnimal: 'true',
  };
  const item2: SelectedItem = {
    uid: '2',
    name: 'Item 2',
    earthAnimal: 'false',
  };

  beforeEach(() => {
    useSelectedItemsStore.getState().clearAll();
  });

  it('should add an item when toggled on', () => {
    useSelectedItemsStore.getState().toggleItem(item1);
    expect(useSelectedItemsStore.getState().selectedItems[item1.uid]).toEqual(
      item1
    );
  });

  it('should remove an item when toggled off', () => {
    useSelectedItemsStore.getState().toggleItem(item1);
    useSelectedItemsStore.getState().toggleItem(item1);
    expect(
      useSelectedItemsStore.getState().selectedItems[item1.uid]
    ).toBeUndefined();
  });

  it('should add multiple items and then remove one', () => {
    useSelectedItemsStore.getState().toggleItem(item1);
    useSelectedItemsStore.getState().toggleItem(item2);
    expect(useSelectedItemsStore.getState().selectedItems[item1.uid]).toEqual(
      item1
    );
    expect(useSelectedItemsStore.getState().selectedItems[item2.uid]).toEqual(
      item2
    );
    useSelectedItemsStore.getState().toggleItem(item1);
    expect(
      useSelectedItemsStore.getState().selectedItems[item1.uid]
    ).toBeUndefined();
    expect(useSelectedItemsStore.getState().selectedItems[item2.uid]).toEqual(
      item2
    );
  });
});
