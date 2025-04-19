import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const isActive = (path: string): boolean => location.pathname.startsWith(path);
  const toggleMenu = (menu: string) => setExpandedMenu(prev => prev === menu ? null : menu);
  const closeMenus = () => setExpandedMenu(null);

  return (
    <nav className="main-navbar upgraded-navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="logo-link">
          <img src="/logo-asch.svg" alt="ASCH Logo" className="logo-img" />
          <span className="logo-text">SGQ ASCH</span>
        </Link>
      </div>

      <ul className="navbar-menu">
        <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={closeMenus}><i className="fas fa-home"></i> Dashboard</Link></li>
        <li><Link to="/checklists" className={isActive('/checklists') ? 'active' : ''} onClick={closeMenus}><i className="fas fa-tasks"></i> Checklists</Link></li>

        <li className="has-submenu">
          <span className={isActive('/ensaios') ? 'active' : ''} onClick={() => toggleMenu('ensaios')}><i className="fas fa-flask"></i> Ensaios <i className={`fas fa-chevron-down ${expandedMenu === 'ensaios' ? 'rotated' : ''}`}></i></span>
          {expandedMenu === 'ensaios' && (
            <ul className="submenu">
              <li><Link to="/ensaios" onClick={closeMenus}>Lista</Link></li>
              <li><Link to="/ensaios/dashboard" onClick={closeMenus}>Dashboard</Link></li>
              <li><Link to="/ensaios/reports" onClick={closeMenus}>Relatórios</Link></li>
              <li><Link to="/ensaios/analysis" onClick={closeMenus}>Análise Avançada</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/nao-conformidades" className={isActive('/nao-conformidades') ? 'active' : ''} onClick={closeMenus}><i className="fas fa-exclamation-triangle"></i> Não Conformidades</Link></li>
        <li><Link to="/documentos" className={isActive('/documentos') ? 'active' : ''} onClick={closeMenus}><i className="fas fa-file-alt"></i> Documentos</Link></li>

        <li className="has-submenu">
          <span className={isActive('/materiais') ? 'active' : ''} onClick={() => toggleMenu('materiais')}><i className="fas fa-boxes"></i> Materiais <i className={`fas fa-chevron-down ${expandedMenu === 'materiais' ? 'rotated' : ''}`}></i></span>
          {expandedMenu === 'materiais' && (
            <ul className="submenu">
              <li><Link to="/materiais" onClick={closeMenus}>Lista</Link></li>
              <li><Link to="/materiais/dashboard" onClick={closeMenus}>Dashboard</Link></li>
              <li><Link to="/materiais/inventario" onClick={closeMenus}>Inventário</Link></li>
              <li><Link to="/materiais/certificacoes" onClick={closeMenus}>Certificações</Link></li>
              <li><Link to="/materiais/rastreabilidade" onClick={closeMenus}>Rastreabilidade</Link></li>
              <li><Link to="/materiais/reports" onClick={closeMenus}>Relatórios</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/relatorios" className={isActive('/relatorios') ? 'active' : ''} onClick={closeMenus}><i className="fas fa-chart-pie"></i> Relatórios</Link></li>
      </ul>

      <div className="navbar-user">
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <img src="/avatar-default.png" alt="Utilizador" className="user-avatar" />
          <div className="user-info">
            <span className="user-name">João Silva</span>
            <span className="user-role">Gestor de Qualidade</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
