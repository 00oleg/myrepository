import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="about-page">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>
        This application is developed by Oleg. <br />
        My Skills: JavaScript, HTML, CSS, ReactJS, NextJS, Redux, Material UI,
        JQuery, SASS/SCSS, Bootstrap, BackstopJS, BEM, Photoshop, AdobeXD,
        Figma. <br />
        <br />
        It showcases various Star Trek Animals details fetched from an external
        API.
      </p>
      <p>
        For more information about React course, you can check out the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React course
        </a>
        .
      </p>
    </div>
  );
}
