import '../styles/index.css';
import { ThemeProvider } from '../ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import MainLayout from '../layouts/main';
import type { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body>
          <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
            <ThemeProvider>
              <MainLayout>{children}</MainLayout>
            </ThemeProvider>
          </ErrorBoundary>
      </body>
    </html>
  );
};

export default Layout;
