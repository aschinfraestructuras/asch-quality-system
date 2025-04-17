
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidadesRoutes from './components/NaoConformidadesRoutes';
import Relatorios from './pages/Relatorios';
import Navbar from './components/Navbar';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Barra de Navegação */}
        <header>
          <Navbar />
        </header>

        {/* Conteúdo Principal */}
        <main className="content-container">
          <Routes>
            {/* Rota padrão redireciona para dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Rota para Checklists */}
            <Route path="/checklists/*" element={<Checklists />} />

            {/* Rota para Ensaios com subrotas */}
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />

            {/* Rota para Não Conformidades */}
            <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />

            {/* Rota para Relatórios */}
            <Route path="/relatorios/*" element={<Relatorios />} />

            {/* Rota para página não encontrada */}
            <Route path="*" element={<h1 style={{ padding: '2rem' }}>Página não encontrada</h1>} />
          </Routes>
        </main>

        {/* Rodapé */}
        <footer className="app-footer">
          <p>© 2025 ASCH - Sistema de Gestão de Qualidade</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
