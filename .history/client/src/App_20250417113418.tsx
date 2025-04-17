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
        <header>
          <Navbar />
        </header>

        <main className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/checklists/*" element={<Checklists />} />
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />
            <Route path="/relatorios/*" element={<Relatorios />} />
            <Route path="*" element={<h1>Página não encontrada</h1>} />
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
