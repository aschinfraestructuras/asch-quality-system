import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logoASCH from '../assets/logo-asch.png';


const Navbar = () => {
  const location = useLocation();
  
  // Determinar qual link está ativo com base na URL atual
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SGQ ASCH</Link>
      </div>
      
      <ul className="navbar-menu">
        <li className={isActive('/dashboard') ? 'active' : ''}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={isActive('/checklists') ? 'active' : ''}>
          <Link to="/checklists">Checklists</Link>
        </li>
        <li className={isActive('/ensaios') ? 'active' : ''}>
          <Link to="/ensaios">Ensaios</Link>
        </li>
        <li className={isActive('/nao-conformidades') ? 'active' : ''}>
          <Link to="/nao-conformidades">Não Conformidades</Link>
        </li>
        <li className={isActive('/relatorios') ? 'active' : ''}>
          <Link to="/relatorios">Relatórios</Link>
        </li>
      </ul>
      
      <div className="navbar-user">
        <span>Administrador</span>
      </div>
    </nav>
  );
};

export default Navbar;