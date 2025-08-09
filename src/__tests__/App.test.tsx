/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router';
import Page404 from '../pages/404';
import { ThemeProvider } from '../ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

beforeEach(() => {
  (window.fetch as jest.Mock) = jest.fn();
  localStorage.clear();
});

it('makes initial API call on component mount', async () => {
  (window.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(window.fetch).toHaveBeenCalled();
    expect(screen.getByText('Test name')).toBeInTheDocument();
  });
});

it('handles search term from localStorage on initial load', async () => {
  localStorage.setItem('searchText', 'Test name');
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test name')).toBeInTheDocument();
    expect(screen.getByText('Test name')).toBeInTheDocument();
  });
});

it('manages loading states during API calls', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ animals: [], page: { totalPages: 1 } }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
});

it('calls API with correct parameters', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      animals: [],
      page: { totalPages: 1 },
    }),
  });
  localStorage.setItem('searchText', 'Test');
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining('Test'),
      expect.any(Object)
    );
  });
});

it('handles successful API responses', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(screen.getByText('Test animal name')).toBeInTheDocument();
  });
});

it('handles API error responses', async () => {
  (window.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ message: 'Server Error' }),
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(screen.getByText(/Server Error/i)).toBeInTheDocument();
  });
});

it('updates component state based on API responses', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test animal name', earthAnimal: 'true' }],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  await waitFor(() => {
    expect(screen.getByText('Test animal name')).toBeInTheDocument();
  });
});

it('manages search term state correctly', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    json: async () => ({
      animals: [],
      page: { totalPages: 1 },
    }),
  });
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByTestId('search-input'), {
    target: { value: 'Test animal name' },
  });

  await waitFor(() => {
    expect(screen.getByDisplayValue('Test animal name')).toBeInTheDocument();
  });
});

describe('Page 404', () => {
  it('renders 404 information', () => {
    render(<Page404 />);
    expect(screen.getByText(/Page not found 404/i)).toBeInTheDocument();
  });
});
