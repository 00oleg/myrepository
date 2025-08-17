import { getTranslations } from 'next-intl/server';
import { Link } from '../../../i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('errors');
  const tNav = await getTranslations('navigation');

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">{t('pageNotFound')}</h2>
      <p className="not-found-description">{t('somethingWentWrong')}</p>
      <Link href="/search" className="not-found-link">
        {tNav('home')}
      </Link>
    </div>
  );
}
