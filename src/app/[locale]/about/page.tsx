import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="about-page">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>
        {t('developerInfo')} <br />
        {t('skills')} JavaScript, HTML, CSS, ReactJS, NextJS, Redux, Material
        UI, JQuery, SASS/SCSS, Bootstrap, BackstopJS, BEM, Photoshop, AdobeXD,
        Figma.
        <br />
        <br />
        {t('appDescription')}
      </p>
      <p>
        {t('courseInfo')}{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('courseLink')}
        </a>
        .
      </p>
    </div>
  );
}
