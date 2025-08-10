import { render, screen } from '@testing-library/react';
import AboutPage from '../pages/About';

describe('AboutPage', () => {
  it('renders author information and RS School link', () => {
    render(<AboutPage />);
    expect(
      screen.getByText(/This application is developed by Oleg/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/RS School React course/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /RS School React course/i })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
