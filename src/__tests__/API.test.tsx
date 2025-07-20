/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  (window.fetch as jest.Mock) = jest.fn();
  localStorage.clear();
});

it('API success scenario', async () => {
  localStorage.setItem('searchText', 'Test name');
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      animals: [{ name: 'Test name', earthAnimal: 'true' }],
    }),
  });
  render(<App />);
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test name')).toBeInTheDocument();
    expect(screen.getByText('Test name')).toBeInTheDocument();
  });
});

it('API error scenario', async () => {
  (window.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({ message: 'Server Error' }),
  });
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/Server Error/i)).toBeInTheDocument();
  });
});
