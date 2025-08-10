/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DetailPage from '../pages/Detail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('DetailedCard', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          animal: {
            uid: 'ANMA0000264633',
            name: 'Abalone',
            earthAnimal: true,
            earthInsect: false,
            avian: false,
            canine: false,
            feline: false,
          },
        }),
    } as Response);
  });

  describe('DetailPage Querying & Caching', () => {
    let queryClient: QueryClient;
    beforeEach(() => {
      queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      jest.clearAllMocks();
    });

    it('should cache data and not refetch within staleTime', async () => {
      const fetchSpy = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            animal: {
              uid: 'ANMA0000264633',
              name: 'Abalone',
              earthAnimal: true,
              earthInsect: false,
              avian: false,
              canine: false,
              feline: false,
            },
          }),
      });
      global.fetch = fetchSpy;

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter
            initialEntries={['/details?page=1&detail=ANMA0000264633']}
          >
            <Routes>
              <Route path="details" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('Abalone')).toBeInTheDocument();
      });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter
            initialEntries={['/details?page=1&detail=ANMA0000264633']}
          >
            <Routes>
              <Route path="details" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should refetch data when Refresh button is clicked', async () => {
      const fetchSpy = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              animal: {
                uid: 'ANMA0000264633',
                name: 'Abalone',
                earthAnimal: true,
                earthInsect: false,
                avian: false,
                canine: false,
                feline: false,
              },
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              animal: {
                uid: 'ANMA0000264633',
                name: 'Abalone Refreshed',
                earthAnimal: true,
                earthInsect: false,
                avian: false,
                canine: false,
                feline: false,
              },
            }),
        });
      global.fetch = fetchSpy;

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter
            initialEntries={['/details?page=1&detail=ANMA0000264633']}
          >
            <Routes>
              <Route path="details" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('Abalone')).toBeInTheDocument();
      });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Refresh'));
      await waitFor(() => {
        expect(screen.getByText('Abalone Refreshed')).toBeInTheDocument();
      });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('shows loading indicator during refresh', async () => {
      const fetchSpy = jest
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              animal: {
                uid: 'ANMA0000264633',
                name: 'Abalone',
                earthAnimal: true,
                earthInsect: false,
                avian: false,
                canine: false,
                feline: false,
              },
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              animal: {
                uid: 'ANMA0000264633',
                name: 'Abalone Refreshed',
                earthAnimal: true,
                earthInsect: false,
                avian: false,
                canine: false,
                feline: false,
              },
            }),
        });
      global.fetch = fetchSpy;

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter
            initialEntries={['/details?page=1&detail=ANMA0000264633']}
          >
            <Routes>
              <Route path="details" element={<DetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('Abalone')).toBeInTheDocument();
      });
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Refresh'));
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByText('Abalone Refreshed')).toBeInTheDocument();
      });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('DetailedCard component a loading indicator is displayed while fetching data', async () => {
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
          <DetailPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('DetailedCard component correctly displays the detailed card data', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <DetailPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByText('Abalone')).toBeInTheDocument();
      expect(getByText('ANMA0000264633')).toBeInTheDocument();
    });
  });

  it('DetailedCard component clicking the close button hides the component', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={['/details?page=1&detail=ANMA0000264633']}
        >
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="details" element={<DetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(container.querySelector('.detail-page')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-button'));

    await waitFor(() => {
      expect(container.querySelector('.detail-page')).not.toBeInTheDocument();
    });
  });

  it('DetailedCard component show error message', async () => {
    global.fetch = mockFetch.mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          animal: {},
        }),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={['/details?page=1&detail=ANMA0000264633']}
        >
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="details" element={<DetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByText('Response was not ok')).toBeInTheDocument();
    });
  });

  it('DetailedCard component show error message if no animal found', async () => {
    global.fetch = mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={['/details?page=1&detail=ANMA0000264633']}
        >
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="details" element={<DetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(getByText('Animal not found')).toBeInTheDocument();
    });
  });
});
