'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../../i18n/navigation';
import { useSearchParams } from 'next/navigation';

const locales = ['en', 'ru'] as const;

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const params = new URLSearchParams(searchParams.toString());
    const fullPath = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(fullPath, { locale: newLocale });
  };

  return (
    <div className="language-selector">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
      >
        {locales.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
