import '../styles/index.css';
import { ThemeProvider } from '../ThemeContext';
import MainLayout from '../layouts/main';
import type { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
