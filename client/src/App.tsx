import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardV2 from './pages/DashboardV2';
import Checklists from './pages/Checklists';
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidadesRoutes from './components/NaoConformidadesRoutes';
import DocumentosRoutes from './components/DocumentosRoutes';
import MateriaisRoutes from './components/MateriaisRoutes'; // Rota dos Materiais
import Relatorios from './pages/Relatorios';
import Navbar from './components/Navbar';
import './styles/App.css';

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
            {/* Redireciona "/" para "/dashboard" */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardV2 />} />
            <Route path="/checklists/*" element={<Checklists />} />
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />
            <Route path="/documentos/*" element={<DocumentosRoutes />} />
            <Route path="/materiais/*" element={<MateriaisRoutes />} /> {/* Materiais */}
            <Route path="/relatorios/*" element={<Relatorios />} />

            {/* Página não encontrada */}
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
