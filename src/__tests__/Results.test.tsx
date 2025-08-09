/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import SearchResults from '../components/Results';
import SearchPage from '../pages/Search';
import type { SearchResultItem } from 'components/Card';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockData: SearchResultItem[] = [
  { uid: '1', name: 'name 1', earthAnimal: 'true' },
  { uid: '2', name: 'name 2', earthAnimal: '' },
];

it('renders correct number of items when data is provided', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResults
        loading={false}
        results={mockData}
        error={null}
        pageNumber={1}
      />
    </MemoryRouter>
  );
  const items = screen.getAllByTestId('card-item');
  expect(items.length).toBe(mockData.length);
});

it('displays "no results" message when data array is empty', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResults loading={false} results={[]} error={null} pageNumber={1} />
    </MemoryRouter>
  );
  expect(screen.getByText(/No results/i)).toBeInTheDocument();
});

it('shows loading state while fetching data', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResults loading={true} results={[]} error={null} pageNumber={1} />
    </MemoryRouter>
  );
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

it('correctly displays item names and descriptions', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResults
        loading={false}
        results={mockData}
        error={null}
        pageNumber={1}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('name 1')).toBeInTheDocument();
  expect(screen.getByText('name 1')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: Yes')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: No')).toBeInTheDocument();
});

it('handles missing or undefined data gracefully', () => {
  const data: SearchResultItem[] = [
    { uid: '1', name: '', earthAnimal: '' },
    { uid: '2', name: '', earthAnimal: '' },
  ];
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResults
        loading={false}
        results={data}
        error={null}
        pageNumber={1}
      />
    </MemoryRouter>
  );
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
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    localStorage.setItem('searchText', 'saved text query');
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
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
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    localStorage.setItem('searchText', 'saved text query');
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
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
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    localStorage.setItem('searchText', 'saved text query');
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <SearchPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Server Error')).toBeInTheDocument();
    });
  });
});
