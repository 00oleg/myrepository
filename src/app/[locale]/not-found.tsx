import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('errors');

  return (
    <div className="about-page">
      <h1>{t('pageNotFound')}</h1>
      <p>{t('somethingWentWrong')}</p>
    </div>
  );
}
