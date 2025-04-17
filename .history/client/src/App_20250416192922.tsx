import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Importações de Páginas
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NewChecklist from './pages/NewChecklist';
import ViewChecklist from './pages/ViewChecklist';
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import Ensaios from './pages/Ensaios';

// Importações de Estilos
import './styles/App.css';

// Componente de Navegação
const Navbar = () => {
  const location = useLocation();
  
  // Função para verificar se a rota atual corresponde ao link
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/" className="logo-text">SGQ ASCH</Link>
      </div>
      <nav className="main-nav">
        <Link to="/" className={isActive('/') ? 'active' : ''}>Dashboard</Link>
        <Link to="/checklists" className={isActive('/checklists') ? 'active' : ''}>Checklists</Link>
        <Link to="/ensaios" className={isActive('/ensaios') ? 'active' : ''}>Ensaios</Link>
        <Link to="/nao-conformidades" className={isActive('/nao-conformidades') ? 'active' : ''}>Não Conformidades</Link>
        <Link to="/relatorios" className={isActive('/relatorios') ? 'active' : ''}>Relatórios</Link>
      </nav>
      <div className="user-menu">
        <div className="user-info">
          <span className="user-name">Admin</span>
          <span className="user-role">Administrador</span>
        </div>
        <div className="user-avatar">
          <span>A</span>
        </div>
      </div>
    </header>
  );
};

// Componente de Página Não Encontrada
const NotFound = () => (
  <div className="container not-found">
    <h1>404 - Página não encontrada</h1>
    <p>A página que procura não existe ou foi movida.</p>
    <Link to="/" className="btn-primary">Voltar ao Dashboard</Link>
  </div>
);

// Componente Principal da Aplicação
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rotas de Checklists com aninhamento */}
            <Route path="/checklists" element={<Checklists />}>
              <Route path="novo" element={<NewChecklist />} />
              <Route path=":id" element={<ViewChecklist />} />
            </Route>
            
            {/* Rotas de Ensaios */}
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            
            {/* Outras rotas */}
            <Route path="/nao-conformidades" element={<NaoConformidades />} />
            <Route path="/relatorios" element={<Relatorios />} />
            
            {/* Rota de Página Não Encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} ASCH - Sistema de Gestão de Qualidade</p>
            <p>Versão 1.0.0</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;