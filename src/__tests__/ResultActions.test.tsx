/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import type { SelectedItem } from '../store/selectedItemsStore';
import { render, screen, fireEvent } from '@testing-library/react';
import * as store from '../store/selectedItemsStore';
import ResultActions from '../components/ResultActions';
import convertToCSV from '../utils/convertToCSV';

describe('ResultActions', () => {
  const mockClearAll = jest.fn();
  const mockGetSelectedItems = jest.fn();
  const mockGetSelectedItemsCount = jest.fn();

  beforeEach(() => {
    jest.spyOn(store, 'useSelectedItemsStore').mockReturnValue({
      clearAll: mockClearAll,
      getSelectedItems: mockGetSelectedItems,
      getSelectedItemsCount: mockGetSelectedItemsCount,
    });
    jest.clearAllMocks();
  });

  it('should not render if no items are selected', () => {
    mockGetSelectedItemsCount.mockReturnValue(0);
    render(<ResultActions />);
    expect(screen.queryByText(/items are selected/i)).toBeNull();
  });

  it('should render selected items count and buttons', () => {
    mockGetSelectedItemsCount.mockReturnValue(2);
    mockGetSelectedItems.mockReturnValue([
      { uid: '1', name: 'Cat', earthAnimal: 'true' },
      { uid: '2', name: 'Dog', earthAnimal: 'true' },
    ]);
    render(<ResultActions />);
    expect(screen.getByText('2 items are selected.')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should call clearAll when Unselect all is clicked', () => {
    mockGetSelectedItemsCount.mockReturnValue(1);
    mockGetSelectedItems.mockReturnValue([
      { uid: '1', name: 'Cat', earthAnimal: 'true' },
    ]);
    render(<ResultActions />);
    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockClearAll).toHaveBeenCalled();
  });

  it('should trigger download when Download is clicked', () => {
    mockGetSelectedItemsCount.mockReturnValue(1);
    mockGetSelectedItems.mockReturnValue([
      { uid: '1', name: 'Cat', earthAnimal: 'true' },
    ]);

    const fakeBlobUrl = 'blob:fake-url';
    Object.defineProperty(window.URL, 'createObjectURL', {
      value: jest.fn().mockReturnValue(fakeBlobUrl),
      configurable: true,
    });

    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');

    render(<ResultActions />);
    fireEvent.click(screen.getByText('Download'));

    const anchor = document.querySelector('a') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.href).toBe(fakeBlobUrl);
    expect(anchor.download).toBe('1_animals.csv');
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe('convertToCSV', () => {
  it('should convert empty array to CSV with headers only', () => {
    const items: SelectedItem[] = [];
    const result = convertToCSV(items);
    expect(result).toBe('UUID;Name;Earth Animal');
  });

  it('should convert single item to CSV', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Test Animal', earthAnimal: 'true' },
    ];
    const result = convertToCSV(items);
    const expected = 'UUID;Name;Earth Animal\r\n123;Test Animal;true';
    expect(result).toBe(expected);
  });

  it('should convert multiple items to CSV', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Test Animal 1', earthAnimal: 'true' },
      { uid: '456', name: 'Test Animal 2', earthAnimal: 'false' },
      { uid: '789', name: 'Test Animal 3', earthAnimal: 'true' },
    ];
    const result = convertToCSV(items);
    const expected =
      'UUID;Name;Earth Animal\r\n123;Test Animal 1;true\r\n456;Test Animal 2;false\r\n789;Test Animal 3;true';
    expect(result).toBe(expected);
  });

  it('should handle special characters in names', () => {
    const items: SelectedItem[] = [
      { uid: '123', name: 'Animal, with comma', earthAnimal: 'true' },
      { uid: '456', name: 'Animal "with quotes"', earthAnimal: 'false' },
    ];
    const result = convertToCSV(items);
    const expected =
      'UUID;Name;Earth Animal\r\n123;Animal, with comma;true\r\n456;Animal "with quotes";false';
    expect(result).toBe(expected);
  });
});
