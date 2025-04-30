// app.tsx corrigido sem apagar nada que escreveste
console.log("🚀 Deploy automático funcionando!");

import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n'; // Configuração i18n
import { LanguageSelector } from './components/common/LanguageSelector';
import styled from 'styled-components';

// Páginas principais
import DashboardPro from './pages/DashboardPro';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DashboardLayout from './pages/DashboardLayout';
import Checklists from './pages/Checklists';
import Relatorios from './pages/Relatorios';
import DocumentosList from './pages/DocumentosList';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Páginas de Projetos
import ProjectsPage from './pages/ProjectsPage';
import ProjectForm from './pages/ProjectForm';
import ProjectDetails from './pages/ProjectDetails';

// Rotas modulares
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidadesRoutes from './components/NaoConformidadesRoutes';
import DocumentosRoutes from './components/DocumentosRoutes';
import MateriaisRoutes from './components/MateriaisRoutes';
import FornecedorRoutes from './components/FornecedorRoutes';

// Componentes globais
import Navbar from './components/Navbar';
import ApiModeStatus from './components/common/ApiModeStatus';

// Estilos
import './styles/App.css';
import './styles/DashboardPro.css';
import './styles/components.css';

// FontAwesome config
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 4rem;
  padding: 2rem;
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  text-align: center;
  color: white;
`;

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">
          <header className="header-fixed">
            <Navbar />
            <div className="header-tools">
              <LanguageSelector />
            </div>
          </header>

          <main className="content-container">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPro />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
              </Route>

              {/* Rotas para Projetos */}
              <Route path="/projetos" element={<ProjectsPage />} />
              <Route path="/projetos/novo" element={<ProjectForm />} />
              <Route path="/projetos/editar/:id" element={<ProjectForm />} />
              <Route path="/projetos/:id" element={<ProjectDetails />} />

              <Route path="/checklists/*" element={<Checklists />} />
              <Route path="/ensaios/*" element={<EnsaioRoutes />} />
              <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />
              <Route path="/documentos/*" element={<DocumentosRoutes />} />
              <Route path="/materiais/*" element={<MateriaisRoutes />} />
              <Route path="/fornecedores/*" element={<FornecedorRoutes />} />
              <Route path="/relatorios/*" element={<Relatorios />} />

              {/* Página não encontrada */}
              <Route path="*" element={<h1 style={{ padding: '2rem' }}>Página não encontrada</h1>} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>© 2025 ASCH – Sistema de Gestão da Qualidade</p>
          </footer>
        </div>
        <ApiModeStatus />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
