/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import SearchTop from '../components/Search';

beforeEach(() => {
  localStorage.clear();
});

it('renders search input and search button', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  expect(getByTestId('search-input')).toBeInTheDocument();
  expect(getByTestId('search-button')).toBeInTheDocument();
});

it('displays previously saved search term from localStorage on mount', () => {
  localStorage.setItem('searchText', 'saved text query');

  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );

  expect(getByTestId('search-input')).toHaveValue('saved text query');
});

it('shows empty input when no saved term exists', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  expect(getByTestId('search-input')).toHaveValue('');
});

it('updates input value when user types', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  const input = getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'text query' } });
  expect(input).toHaveValue('text query');
});

it('saves search term to localStorage when search button is clicked', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'text query' } });
  fireEvent.click(button);
  expect(localStorage.getItem('searchText')).toBe('text query');
});

it('trims whitespace from search input before saving', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: '   spaced text   ' } });
  fireEvent.click(button);
  expect(localStorage.getItem('searchText')).toBe('spaced text');
});

it('triggers search callback with correct parameters', () => {
  const onSearchMock = jest.fn();
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={onSearchMock} />
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'callback test' } });
  fireEvent.click(button);
  expect(onSearchMock).toHaveBeenCalledWith('callback test');
});

it('retrieves saved search term on component mount', () => {
  localStorage.setItem('searchText', 'persisted value');
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  expect(getByTestId('search-input')).toHaveValue('persisted value');
});

it('overwrites existing localStorage value when new search is performed', () => {
  localStorage.setItem('searchText', 'old localStorage value');
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} />
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'new value' } });
  fireEvent.click(button);
  expect(localStorage.getItem('searchText')).toBe('new value');
});
