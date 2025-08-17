'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '../../components/ErrorBoundary';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
        {children}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
