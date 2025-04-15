import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Estilos
import './styles/App.css';

// Páginas
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NewChecklist from './pages/NewChecklist';
import ViewChecklist from './pages/ViewChecklist';

// Componentes de layout
const Header = () => {
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

const NotFound = () => (
  <div className="container not-found">
    <h1>404 - Página não encontrada</h1>
    <p>A página que procura não existe ou foi movida.</p>
    <Link to="/" className="btn-primary">Voltar ao Dashboard</Link>
  </div>
);

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/checklists/novo" element={<NewChecklist />} />
          <Route path="/checklists/:id" element={<ViewChecklist />} />
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
  );
}

export default App;