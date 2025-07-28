import { NavLink } from 'react-router';

const Navbar = () => {
  return (
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
    </nav>
  );
};

export default Navbar;
