import type { SelectedItem } from '../store/selectedItemsStore';

const convertToCSV = (items: SelectedItem[]) => {
  const rows = items.map((item) => {
    return [item.uid, item.name, item.earthAnimal];
  });

  return [['UUID', 'Name', 'Earth Animal'], ...rows]
    .map((e) => e.join(','))
    .join('\n');
};

describe('convertToCSV', () => {
  it('should convert empty array to CSV with headers only', () => {
    const items: SelectedItem[] = [];
    const result = convertToCSV(items);
    expect(result).toBe('UUID,Name,Earth Animal');
  });

  it('should convert single item to CSV', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Test Animal', earthAnimal: 'Lion' },
    ];
    const result = convertToCSV(items);
    const expected = 'UUID,Name,Earth Animal\n123,Test Animal,Lion';
    expect(result).toBe(expected);
  });

  it('should convert multiple items to CSV', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Test Animal 1', earthAnimal: 'Lion' },
      { uid: '456', name: 'Test Animal 2', earthAnimal: 'Tiger' },
      { uid: '789', name: 'Test Animal 3', earthAnimal: 'Bear' },
    ];
    const result = convertToCSV(items);
    const expected =
      'UUID,Name,Earth Animal\n123,Test Animal 1,Lion\n456,Test Animal 2,Tiger\n789,Test Animal 3,Bear';
    expect(result).toBe(expected);
  });

  it('should handle special characters in names', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Animal, with comma', earthAnimal: 'Lion' },
      { uid: '456', name: 'Animal "with quotes"', earthAnimal: 'Tiger' },
    ];
    const result = convertToCSV(items);
    const expected =
      'UUID,Name,Earth Animal\n123,Animal, with comma,Lion\n456,Animal "with quotes",Tiger';
    expect(result).toBe(expected);
  });
});
