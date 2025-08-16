import '../styles/index.css';
import { ThemeProvider } from '../ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import MainLayout from '../layouts/main';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
        <ThemeProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default MyApp;
