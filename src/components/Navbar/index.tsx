import ThemeSelector from '../../components/ThemeSelector';
import { NavLink } from 'react-router';

const Navbar = () => {
  return (
    <header className="app-header">
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <NavLink className="navbar-link" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar-link" to="/about">
              About
            </NavLink>
          </li>
        </ul>

        <ThemeSelector />
      </nav>
    </header>
  );
};

export default Navbar;
