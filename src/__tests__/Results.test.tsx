/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import SearchResults, { type SearchResultItem } from '../components/Results';
import SearchPage from '../pages/Search';

const mockData: SearchResultItem[] = [
  { name: 'name 1', earthAnimal: 'true' },
  { name: 'name 2', earthAnimal: '' },
];

it('renders correct number of items when data is provided', () => {
  render(<SearchResults loading={false} results={mockData} error={null} />);
  const items = screen.getAllByTestId('card-item');
  expect(items.length).toBe(mockData.length);
});

it('displays "no results" message when data array is empty', () => {
  render(<SearchResults loading={false} results={[]} error={null} />);
  expect(screen.getByText(/No results/i)).toBeInTheDocument();
});

it('shows loading state while fetching data', () => {
  render(<SearchResults loading={true} results={[]} error={null} />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

it('correctly displays item names and descriptions', () => {
  render(<SearchResults loading={false} results={mockData} error={null} />);
  expect(screen.getByText('name 1')).toBeInTheDocument();
  expect(screen.getByText('name 1')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: Yes')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: No')).toBeInTheDocument();
});

it('handles missing or undefined data gracefully', () => {
  const data: SearchResultItem[] = [
    { name: '', earthAnimal: '' },
    { name: '', earthAnimal: '' },
  ];
  render(<SearchResults loading={false} results={data} error={null} />);
  expect(screen.getAllByTestId('card-item').length).toBe(data.length);
});

describe('SearchPage', () => {
  beforeEach(() => {
    window.fetch = jest.fn();
    localStorage.clear();
  });

  it('displays error message when API call fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: 'Network error',
        animals: [],
      }),
    });
    localStorage.setItem('searchText', 'saved text query');
    render(<SearchPage params={{}} />);
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('shows appropriate error for 4xx HTTP status code', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({
        message: 'error message',
        animals: [],
      }),
    });
    localStorage.setItem('searchText', 'saved text query');
    render(<SearchPage params={{}} />);
    await waitFor(() => {
      expect(screen.getByText('Not Found')).toBeInTheDocument();
    });
  });

  it('shows appropriate error for 5xx HTTP status code', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({
        message: 'error message',
        animals: [],
      }),
    });
    localStorage.setItem('searchText', 'saved text query');
    render(<SearchPage params={{}} />);
    await waitFor(() => {
      expect(screen.getByText('Server Error')).toBeInTheDocument();
    });
  });
});
