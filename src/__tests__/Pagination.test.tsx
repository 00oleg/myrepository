/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { fireEvent, render } from '@testing-library/react';
import PaginationResults from '../components/Pagination';
import getArryByNumber from '../utils/getArryByNumber';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.search}</div>;
};

it('Pagination component updates URL query parameter when page changes', () => {
  const { getByTestId, getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PaginationResults
                pageNumber={1}
                totalPages={10}
                perPage={10}
                handlePerPage={() => {}}
              />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(getByTestId('location-display')).toHaveTextContent('');
  fireEvent.click(getByText('2'));
  expect(getByTestId('location-display')).toHaveTextContent('?page=2');
  fireEvent.click(getByText('3'));
  expect(getByTestId('location-display')).toHaveTextContent('?page=3');
});

it('Pagination component calls handlePerPage when perPage changes', () => {
  const handlePerPageMock = jest.fn();
  const { getByTestId } = render(
    <MemoryRouter initialEntries={['/']}>
      <PaginationResults
        pageNumber={1}
        totalPages={10}
        perPage={10}
        handlePerPage={handlePerPageMock}
      />
    </MemoryRouter>
  );

  fireEvent.click(getByTestId('pagination-per-page-20'));
  expect(handlePerPageMock).toHaveBeenCalledWith(20);
});

describe('getArryByNumber', () => {
  it('returns array of numbers from 0 to total-1', () => {
    expect(getArryByNumber(5)).toEqual([0, 1, 2, 3, 4]);
    expect(getArryByNumber(0)).toEqual([]);
    expect(getArryByNumber(1)).toEqual([0]);
  });

  it('returns default array when no argument is passed', () => {
    expect(getArryByNumber()).toEqual([0, 1, 2, 3, 4]);
  });
});
