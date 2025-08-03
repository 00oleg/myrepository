/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from '../components/ThemeSelector';
import { ThemeProvider } from '../ThemeContext';

describe('ThemeSelector localstorage', () => {
  it('saves theme to localStorage when toggled', () => {
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByLabelText('Light'));
    expect(localStorage.getItem('theme')).toBe('light');
    fireEvent.click(screen.getByLabelText('Dark'));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('initializes theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('Light')).toBeChecked();
    expect(screen.getByLabelText('Dark')).not.toBeChecked();
  });
});
