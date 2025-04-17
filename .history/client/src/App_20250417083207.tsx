import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NewChecklist from './pages/NewChecklist';
import ViewChecklist from './pages/ViewChecklist';
import Ensaios from './pages/Ensaios';
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidadesRoutes from './components/NaoConformidadesRoutes';
import Relatorios from './pages/Relatorios';
import './styles/app.css';

// Componente de Navegação
const Navbar = () => {
  const location = useLocation();
  
  // Função para verificar se a rota atual corresponde ao link
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="main-nav">
      <div className="logo">
        <Link to="/" className="logo-text">SGQ ASCH</Link>
      </div>
      
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>Dashboard</Link>
        </li>
        <li>
          <Link to="/checklists" className={isActive('/checklists') ? 'active' : ''}>Checklists</Link>
        </li>
        <li>
          <Link to="/ensaios" className={isActive('/ensaios') ? 'active' : ''}>Ensaios</Link>
        </li>
        <li>
          <Link to="/nao-conformidades" className={isActive('/nao-conformidades') ? 'active' : ''}>Não Conformidades</Link>
        </li>
        <li>
          <Link to="/relatorios" className={isActive('/relatorios') ? 'active' : ''}>Relatórios</Link>
        </li>
      </ul>
      
      <div className="user-menu">
        <div className="user-info">
          <span className="user-name">Admin</span>
          <span className="user-role">Administrador</span>
        </div>
        <div className="user-avatar">
          <span>A</span>
        </div>
      </div>
    </nav>
  );
};

// Componente principal da aplicação
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header>
          <Navbar />
        </header>
        
        <main className="content-container">
          <Routes>
            {/* Rota para o Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Rotas para Checklists */}
            <Route path="/checklists" element={<Checklists />}>
              <Route path="nova" element={<NewChecklist />} />
              <Route path=":id" element={<ViewChecklist />} />
            </Route>
            
            {/* Rotas para Ensaios */}
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            
            {/* Rotas para Não Conformidades */}
            <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />
            
            {/* Rota para Relatórios */}
            <Route path="/relatorios" element={<Relatorios />} />
            
            {/* Rota para página não encontrada */}
            <Route path="*" element={<div className="not-found">Página não encontrada</div>} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>© 2025 ASCH - Sistema de Gestão de Qualidade</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;