/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import SearchTop from '../components/Top';

beforeEach(() => {
  localStorage.clear();
});

test('Search component clicking the Search button saves the entered value to the local storage', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={() => {}} />
  );

  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'text query' } });
  expect(input).toHaveValue('text query');
  fireEvent.click(button);
  expect(localStorage.getItem('searchText')).toBe('text query');
});

test('Component retrieves the value from local storage upon mounting', () => {
  localStorage.setItem('searchText', 'saved text query');

  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={() => {}} />
  );

  const input = getByTestId('search-input');
  expect(input).toHaveValue('saved text query');
});
