import React from 'react';
import { useTheme } from '../../ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <label>
        <input
          type="radio"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => toggleTheme('dark')}
        />
        Dark
      </label>
      <label>
        <input
          type="radio"
          value="light"
          checked={theme === 'light'}
          onChange={() => toggleTheme('light')}
        />
        Light
      </label>
    </div>
  );
};

export default ThemeSelector;
