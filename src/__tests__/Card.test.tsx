import { render, screen } from '@testing-library/react';
import SearchResultsCard from '../components/Card';
import { MemoryRouter } from 'react-router';

it('displays item name and description correctly', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard uid={'1'} name="Test Name" earthAnimal="true" />
    </MemoryRouter>
  );
  expect(screen.getByText('Test Name')).toBeInTheDocument();
  expect(screen.getByText('Earth Animal: Yes')).toBeInTheDocument();
});

it('handles missing props gracefully', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SearchResultsCard uid={'1'} name="" earthAnimal="" />
    </MemoryRouter>
  );
  expect(screen.getByText('Undefined name')).toBeInTheDocument();
});
