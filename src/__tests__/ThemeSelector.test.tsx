/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from '../components/ThemeSelector';
import { useTheme } from '../ThemeContext';

jest.mock('../ThemeContext');

const mockToggleTheme = jest.fn();

describe('ThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both theme options and checks the correct one', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeSelector />);
    expect(screen.getByLabelText('Dark')).toBeChecked();
    expect(screen.getByLabelText('Light')).not.toBeChecked();
  });

  it('calls toggleTheme with correct value when selecting light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeSelector />);
    fireEvent.click(screen.getByLabelText('Light'));
    expect(mockToggleTheme).toHaveBeenCalledWith('light');
  });

  it('calls toggleTheme with correct value when selecting dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
    render(<ThemeSelector />);
    fireEvent.click(screen.getByLabelText('Dark'));
    expect(mockToggleTheme).toHaveBeenCalledWith('dark');
  });
});
