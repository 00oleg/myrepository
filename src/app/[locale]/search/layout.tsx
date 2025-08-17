'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { ReactNode } from 'react';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<p>ErrorBoundary: Something went wrong.</p>}>
        {children}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
