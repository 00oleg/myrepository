/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

it('renders loading indicator', () => {
  render(<Loading loading={true} />);
  expect(screen.getByTestId('loading-item')).toBeInTheDocument();
});

it('shows/hides based on loading prop', () => {
  render(<Loading loading={false} />);
  expect(screen.queryByTestId('loading-item')).not.toBeInTheDocument();
});

it('has appropriate ARIA label for accessibility', () => {
  render(<Loading loading={true} />);
  const indicator = screen.getByTestId('loading-item');
  expect(indicator).toHaveAttribute('aria-label', 'Loading');
});
