import { fireEvent, render, screen } from '@testing-library/react';
import SearchResultsCard from '../components/Card';
import { MemoryRouter } from 'react-router';
import type { SearchResultItem } from '../components/Card';
import * as store from '../store/selectedItemsStore';

const mockToggleItem = jest.fn();
const mockClearAll = jest.fn();
const mockGetSelectedItems = jest.fn();
const mockGetSelectedItemsCount = jest.fn();
const mockIsSelected = jest.fn();

beforeEach(() => {
  jest.spyOn(store, 'useSelectedItemsStore').mockReturnValue({
    clearAll: mockClearAll,
    toggleItem: mockToggleItem,
    getSelectedItems: mockGetSelectedItems,
    getSelectedItemsCount: mockGetSelectedItemsCount,
    isSelected: mockIsSelected,
  });
  jest.clearAllMocks();
});

const defaultProps: SearchResultItem = {
  uid: 'test-uid',
  name: 'Test Name',
  earthAnimal: 'true',
  pageNumber: 1,
};

it('displays item name and description correctly', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard uid={'1'} name="Test Name" earthAnimal="true" />
    </MemoryRouter>
  );
  expect(screen.getByText('Test Name')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: Yes')).toBeInTheDocument();
});

it('handles missing props gracefully', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard uid={'1'} name="" earthAnimal="" />
    </MemoryRouter>
  );
  expect(screen.getByText('Undefined name')).toBeInTheDocument();
});

it('calls handleCheckboxChange and toggleItem when checkbox is clicked', () => {
  mockToggleItem.mockClear();
  const { getByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard {...defaultProps} />
    </MemoryRouter>
  );
  const checkbox = getByRole('checkbox');
  fireEvent.click(checkbox);
  expect(mockToggleItem).toHaveBeenCalledWith({
    uid: 'test-uid',
    name: 'Test Name',
    earthAnimal: 'true',
  });
});

it('checkbox is checked if isSelected returns true', () => {
  mockIsSelected.mockReturnValueOnce(true);
  const selectedProps = { ...defaultProps, uid: 'selected-uid' };
  const { getByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard {...selectedProps} />
    </MemoryRouter>
  );
  const checkbox = getByRole('checkbox');
  expect(checkbox).toBeChecked();
});

it('checkbox is not checked if isSelected returns false', () => {
  mockIsSelected.mockReturnValueOnce(false);
  const { getByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard {...defaultProps} />
    </MemoryRouter>
  );
  const checkbox = getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
});
