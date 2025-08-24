import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { MemoryRouter } from 'react-router';

it('catches and handles JavaScript errors in child components', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const ErrorChild = () => {
    throw new Error('Render error');
  };

  render(
    <MemoryRouter initialEntries={['/']}>
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <ErrorChild />
      </ErrorBoundary>
    </MemoryRouter>
  );
  expect(screen.getByText('Fallback UI')).toBeInTheDocument();
  (console.error as jest.Mock).mockRestore();
});

it('Logs error to console', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const ErrorChild = () => {
    throw new Error('Render error');
  };

  render(
    <ErrorBoundary fallback={<div>Fallback UI</div>}>
      <MemoryRouter initialEntries={['/']}>
        <ErrorChild />
      </MemoryRouter>
    </ErrorBoundary>
  );
  expect(console.error).toHaveBeenCalled();
  (console.error as jest.Mock).mockRestore();
});
