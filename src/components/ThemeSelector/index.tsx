import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '../../ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <div>
      <label>
        <input
          type="radio"
          value="dark"
          checked={theme === 'dark'}
          onChange={() => toggleTheme('dark')}
        />
        {t('dark')}
      </label>
      <label>
        <input
          type="radio"
          value="light"
          checked={theme === 'light'}
          onChange={() => toggleTheme('light')}
        />
        {t('light')}
      </label>
    </div>
  );
};

export default ThemeSelector;
