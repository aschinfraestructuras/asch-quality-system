import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoAsch from '../assets/logo-asch.png'; // Caminho correto
import '../styles/Navbar.css'; // Se tiveres estilos globais, manténs isto

const dropdownItemStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '14px',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease'
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  const dropdownItemStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    fontSize: '14px',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  };

  // Submenus dinâmicos por página principal
  const submenus: Record<string, { label: string; path: string }[]> = {
    '/ensaios': [
      { label: 'Lista', path: '/ensaios' },
      { label: 'Dashboard', path: '/ensaios/dashboard' },
      { label: 'Relatórios', path: '/ensaios/reports' },
      { label: 'Análise Avançada', path: '/ensaios/analysis' },
      { label: 'Workflow', path: '/ensaios/workflow' },
      { label: 'Integração Lab', path: '/ensaios/lab-integration' }
    ],
    '/materiais': [
      { label: 'Lista', path: '/materiais' },
      { label: 'Dashboard', path: '/materiais/dashboard' },
      { label: 'Inventário', path: '/materiais/inventario' },
      { label: 'Certificações', path: '/materiais/certificacoes' },
      { label: 'Rastreabilidade', path: '/materiais/rastreabilidade' },
      { label: 'Relatórios', path: '/materiais/reports' },
      { label: 'Novo Material', path: '/materiais/novo' }
    ],
    '/relatorios': [
      { label: 'Painel', path: '/relatorios' },
      { label: 'Qualidade', path: '/relatorios/qualidade' },
      { label: 'Projetos', path: '/relatorios/projetos' },
      { label: 'Materiais', path: '/relatorios/materiais' },
      { label: 'Personalizados', path: '/relatorios/personalizados' }
    ],
    '/documentos': [
      { label: 'Documentos', path: '/documentos' },
      { label: 'RFIs (Pedidos de Informação)', path: '/documentos/rfis' },
      { label: 'Procedimentos', path: '/documentos/procedimentos' }
    ]
  };

  const currentSubmenu = Object.entries(submenus).find(([prefix]) =>
    location.pathname.startsWith(prefix)
  )?.[1];

  return (
    <>
      {/* NAVBAR PRINCIPAL */}
      <nav className="main-navbar upgraded-navbar">
        {/* LOGOTIPO + TEXTO */}
        <div className="navbar-left">
          <Link to="/dashboard" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={logoAsch} alt="ASCH Logo" className="logo-img" style={{ height: '34px' }} />
            <span className="logo-text" style={{ fontWeight: 600, fontSize: '16px' }}>
              Sistema de Gestão da Qualidade <strong>ASCH</strong>
            </span>
          </Link>
        </div>
        
{/* MENU PRINCIPAL */}
<ul className="navbar-menu">
  <li>
    <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
      <i className="fas fa-tachometer-alt"></i> Dashboard
    </Link>
  </li>
  <li>
    <Link to="/checklists" className={isActive('/checklists') ? 'active' : ''}>
      <i className="fas fa-tasks"></i> Checklists
    </Link>
  </li>
  <li>
    <Link to="/ensaios" className={isActive('/ensaios') ? 'active' : ''}>
      <i className="fas fa-flask"></i> Ensaios
    </Link>
  </li>
  <li>
    <Link to="/nao-conformidades" className={isActive('/nao-conformidades') ? 'active' : ''}>
      <i className="fas fa-exclamation-triangle"></i> Não Conformidades
    </Link>
  </li>
  <li>
    <Link to="/documentos" className={isActive('/documentos') ? 'active' : ''}>
      <i className="fas fa-file-alt"></i> Documentos
    </Link>
  </li>
  <li>
    <Link to="/materiais" className={isActive('/materiais') ? 'active' : ''}>
      <i className="fas fa-boxes"></i> Materiais
    </Link>
  </li>
  <li>
    <Link to="/fornecedores" className={isActive('/fornecedores') ? 'active' : ''}>
      <i className="fas fa-industry"></i> Fornecedores
    </Link>
  </li>
  <li>
    <Link to="/relatorios" className={isActive('/relatorios') ? 'active' : ''}>
      <i className="fas fa-chart-pie"></i> Relatórios
    </Link>
  </li>
  <li>
    <Link to="/dashboard/analytics" className={isActive('/dashboard/analytics') ? 'active' : ''}>
      <i className="fas fa-chart-line"></i> Analytics
    </Link>
  </li>
</ul>


        {/* UTILIZADOR */}
        <div className="navbar-user" style={{ position: 'relative' }}>
          <button className="notification-btn" title="Notificações">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          <div
            className="user-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.6rem',
              background: '#ffffff',
              borderRadius: '9999px',
              boxShadow: '0 0 0 1px #d1d5db',
              transition: 'all 0.2s ease'
            }}
          >
            <img
              src="/avatar-default.png"
              alt="Utilizador"
              className="user-avatar"
              style={{ width: '32px', height: '32px', borderRadius: '9999px' }}
            />
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name" style={{ fontSize: '14px', fontWeight: 600 }}>Jose Antunes</span>
              <span className="user-role" style={{ fontSize: '12px', color: '#6b7280' }}>Gestor de Qualidade</span>
            </div>
            <i className="fas fa-chevron-down" style={{ fontSize: '0.75rem', color: '#6b7280' }}></i>
          </div>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.5rem 0',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
              minWidth: '180px',
              zIndex: 50
            }}>
              <Link to="/perfil" style={dropdownItemStyle}><i className="fas fa-user-circle"></i> Perfil</Link>
              <Link to="/definicoes" style={dropdownItemStyle}><i className="fas fa-cog"></i> Definições</Link>
              <div onClick={() => alert('Logout...')} style={{ ...dropdownItemStyle, color: '#dc2626' }}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* BARRA DE SUBMENUS */}
      {currentSubmenu && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem 2rem',
          background: '#f0f4f8',
          borderBottom: '1px solid #ccc'
        }}>
          {currentSubmenu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 500,
                background: location.pathname === item.path ? '#3b82f6' : 'transparent',
                color: location.pathname === item.path ? 'white' : '#333',
                transition: 'background 0.2s ease'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
