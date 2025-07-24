import { fireEvent, render, screen } from '@testing-library/react';
import SearchResults from '../components/Results';
import ErrorBoundary from '../components/ErrorBoundary';
import { MemoryRouter } from 'react-router';

const mockResults = [{ uid: '1', name: 'Test', earthAnimal: 'true' }];

it('catches and handles JavaScript errors in child components', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <MemoryRouter initialEntries={['/']}>
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <SearchResults
          results={mockResults}
          loading={false}
          error={null}
          pageNumber={1}
        />
      </ErrorBoundary>
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText('Get Error'));
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  (console.error as jest.Mock).mockRestore();
});

it('displays fallback UI when error occurs', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary fallback={<div>Fallback UI</div>}>
      <MemoryRouter initialEntries={['/']}>
        <SearchResults
          results={mockResults}
          loading={false}
          error={null}
          pageNumber={1}
        />
      </MemoryRouter>
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText('Get Error'));
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  (console.error as jest.Mock).mockRestore();
});

it('Logs error to console', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary fallback={<div>Fallback UI</div>}>
      <MemoryRouter initialEntries={['/']}>
        <SearchResults
          results={mockResults}
          loading={false}
          error={null}
          pageNumber={1}
        />
      </MemoryRouter>
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText('Get Error'));
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  expect(console.error).toHaveBeenCalled();
  (console.error as jest.Mock).mockRestore();
});

it('throws error when test button is clicked', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary fallback={<div>Fallback UI</div>}>
      <MemoryRouter initialEntries={['/']}>
        <SearchResults
          results={mockResults}
          loading={false}
          error={null}
          pageNumber={1}
        />
      </MemoryRouter>
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText('Get Error'));
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  (console.error as jest.Mock).mockRestore();
});

it('triggers error boundary fallback UI', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <ErrorBoundary fallback={<div>Fallback UI</div>}>
      <MemoryRouter initialEntries={['/']}>
        <SearchResults
          results={mockResults}
          loading={false}
          error={null}
          pageNumber={1}
        />
      </MemoryRouter>
    </ErrorBoundary>
  );
  fireEvent.click(screen.getByText('Get Error'));
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  (console.error as jest.Mock).mockRestore();
});
