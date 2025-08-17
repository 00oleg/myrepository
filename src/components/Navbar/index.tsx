import { useTranslations } from 'next-intl';
import ThemeSelector from '../../components/ThemeSelector';
import LanguageSelector from '../LanguageSelector';
import { Link } from '../../i18n/navigation';

const Navbar = () => {
  const t = useTranslations('navigation');

  return (
    <header className="app-header">
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <Link className="navbar-link" href="/search">
              {t('home')}
            </Link>
          </li>
          <li>
            <Link className="navbar-link" href="/about">
              {t('about')}
            </Link>
          </li>
        </ul>

        <div className="navbar-controls">
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
