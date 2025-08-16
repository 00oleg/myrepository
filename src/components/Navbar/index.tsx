import Link from 'next/link';
import ThemeSelector from '../../components/ThemeSelector';

const Navbar = () => {
  return (
    <header className="app-header">
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <Link className="navbar-link" href="/search">
              Home
            </Link>
          </li>
          <li>
            <Link className="navbar-link" href="/about">
              About
            </Link>
          </li>
        </ul>

        <ThemeSelector />
      </nav>
    </header>
  );
};

export default Navbar;
