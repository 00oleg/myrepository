/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SearchTop from '../components/Search';
import SearchPage from '../pages/Search';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

beforeEach(() => {
  window.fetch = jest.fn();
  localStorage.clear();
});

it('renders search input and search button', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} refresh={jest.fn()} />
  );
  expect(getByTestId('search-input')).toBeInTheDocument();
  expect(getByTestId('search-button')).toBeInTheDocument();
});

it('displays previously saved search term from localStorage on mount', async () => {
  localStorage.setItem('searchText', 'saved text query');

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const { getByTestId } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(getByTestId('search-input')).toHaveValue('saved text query');
  });
});

it('shows empty input when no saved term exists', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} refresh={jest.fn()} />
  );
  expect(getByTestId('search-input')).toHaveValue('');
});

it('updates input value when user types', () => {
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={jest.fn()} refresh={jest.fn()} />
  );
  const input = getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'text query' } });
  expect(input).toHaveValue('text query');
});

it('saves search term to localStorage when search button is clicked', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const { getByTestId } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'text query' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(localStorage.getItem('searchText')).toBe('text query');
  });
});

it('trims whitespace from search input before saving', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const { getByTestId } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: '   spaced text   ' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(localStorage.getItem('searchText')).toBe('spaced text');
  });
});

it('triggers search callback with correct parameters', () => {
  const onSearchMock = jest.fn();
  const { getByTestId } = render(
    <SearchTop searchText="" onSearch={onSearchMock} refresh={jest.fn()} />
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'callback test' } });
  fireEvent.click(button);
  expect(onSearchMock).toHaveBeenCalledWith('callback test');
});

it('retrieves saved search term on component mount', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  localStorage.setItem('searchText', 'persisted value');

  const { getByTestId } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => {
    expect(getByTestId('search-input')).toHaveValue('persisted value');
  });
});

it('overwrites existing localStorage value when new search is performed', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  localStorage.setItem('searchText', 'old localStorage value');
  const { getByTestId } = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
  const input = getByTestId('search-input');
  const button = getByTestId('search-button');
  fireEvent.change(input, { target: { value: 'new value' } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(localStorage.getItem('searchText')).toBe('new value');
  });
});
