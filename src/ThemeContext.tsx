"use client"

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: (selectedTheme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const [theme, setTheme] = useState<Theme>(
  //   (localStorage.getItem('theme') as Theme) || 'dark'
  // );
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
