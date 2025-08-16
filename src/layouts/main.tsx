"use client"

import { useTheme } from '../ThemeContext';
import Navbar from '../components/Navbar';
import type { ReactNode } from 'react';

function MainLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
