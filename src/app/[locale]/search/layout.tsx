'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { ReactNode } from 'react';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const t = useTranslations('errors');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<p>{t('somethingWentWrong')}</p>}>
        {children}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
