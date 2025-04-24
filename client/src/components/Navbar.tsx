import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoAsch from '../assets/logo-asch.png';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  // Estilo para os itens do dropdown
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

  // Definição dos menus principais
  const mainMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Projetos', path: '/projetos', icon: 'fas fa-building' },
    { label: 'Checklists', path: '/checklists', icon: 'fas fa-tasks' },
    { label: 'Ensaios', path: '/ensaios', icon: 'fas fa-flask' },
    { label: 'Não Conformidades', path: '/nao-conformidades', icon: 'fas fa-exclamation-triangle' },
    { label: 'Documentos', path: '/documentos', icon: 'fas fa-file-alt' },
    { label: 'Materiais', path: '/materiais', icon: 'fas fa-boxes' },
    { label: 'Fornecedores', path: '/fornecedores', icon: 'fas fa-industry' },
    { label: 'Relatórios', path: '/relatorios', icon: 'fas fa-chart-pie' },
    { label: 'Analytics', path: '/dashboard/analytics', icon: 'fas fa-chart-line' }
  ];

  // Submenus dinâmicos por página principal
  const submenus: Record<string, { label: string; path: string }[]> = {
    '/projetos': [
      { label: 'Lista de Projetos', path: '/projetos' },
      { label: 'Novo Projeto', path: '/projetos/novo' },
      { label: 'Dashboard de Projetos', path: '/projetos/dashboard' },
      { label: 'Relatórios', path: '/projetos/relatorios' }
    ],
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
          {mainMenuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={isActive(item.path) ? 'active' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  borderBottom: isActive(item.path) ? '3px solid #2563eb' : '3px solid transparent',
                  background: item.path === '/projetos' && !isActive(item.path) ? '#e6eeff' : 
                             isActive(item.path) ? '#2563eb' : 'transparent',
                  color: isActive(item.path) ? 'white' : 
                         item.path === '/projetos' ? '#2563eb' : 'inherit',
                  fontWeight: isActive(item.path) || item.path === '/projetos' ? '600' : 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive(item.path) ? '0 2px 4px rgba(37, 99, 235, 0.3)' : 'none'
                }}
              >
                <i className={item.icon} style={{ 
                  fontSize: isActive(item.path) || item.path === '/projetos' ? '16px' : '14px' 
                }}></i> 
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* UTILIZADOR */}
        <div className="navbar-user" style={{ position: 'relative' }}>
          <button className="notification-btn" style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginRight: '12px',
            color: '#4B5563',
            borderRadius: '50%',
            transition: 'background 0.2s ease',
          }} title="Notificações">
            <i className="fas fa-bell" style={{ fontSize: '18px' }}></i>
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>3</span>
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
              transition: 'all 0.2s ease',
              // ':hover' pseudo-class cannot be used in inline styles. Use CSS classes instead.
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
          padding: '0.75rem 2rem',
          background: '#f0f4f8',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
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
                color: location.pathname === item.path ? 'white' : '#374151',
                transition: 'all 0.2s ease',
                // Use a CSS class for hover effects instead of inline styles
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