import '../../styles/index.css';
import { ThemeProvider } from '../../ThemeContext';
import MainLayout from '../../layouts/main';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
