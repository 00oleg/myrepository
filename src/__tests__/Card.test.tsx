/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import SearchResultsCard from '../components/Card';

it('displays item name and description correctly', () => {
  render(<SearchResultsCard name="Test Name" earthAnimal="true" />);
  expect(screen.getByText('Test Name')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: Yes')).toBeInTheDocument();
});

it('handles missing props gracefully', () => {
  render(<SearchResultsCard name="" earthAnimal="" />);
  expect(screen.getByText('Undefined name')).toBeInTheDocument();
});
