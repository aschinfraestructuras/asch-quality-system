console.log("🚀 Deploy automático funcionando!");

import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n'; // Configuração i18n
import { LanguageSelector } from './components/common/LanguageSelector';

// Páginas principais
import DashboardPro from './pages/DashboardPro';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DashboardLayout from './pages/DashboardLayout';
import Checklists from './pages/Checklists';
import Relatorios from './pages/Relatorios';
import DocumentosList from './pages/DocumentosList';

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
import {
  faBuilding, faFile, faFlask, faExclamationTriangle, faClipboardCheck,
  faBox, faSync, faCalendarAlt, faUser, faFilter, faHistory, faClock,
  faEye, faPlus, faTasks, faCheckCircle, faChartBar, faChartLine,
  faChartPie, faChartArea, faTable, faSort, faSortUp, faSortDown,
  faFileExport, faSearch, faBell, faCog, faList, faCheck, faTachometerAlt,
  faHome, faExclamationCircle, faBoxes, faArrowUp, faArrowDown, faMinus,
  faTimes, faCubes, faWarehouse, faCalendarDay, faCertificate, faIdCard,
  faStar, faStarHalf, faEllipsisV, faPencilAlt, faFileContract,
  faInfoCircle, faShoppingCart, faStickyNote, faFilePdf, faEnvelope, faPhone
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt as farCalendarAlt,
  faStar as farStar
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faBuilding, faFile, faFlask, faExclamationTriangle, faClipboardCheck,
  faBox, faSync, faCalendarAlt, farCalendarAlt, faUser, faFilter, faHistory,
  faClock, faEye, faPlus, faTasks, faCheckCircle, faChartBar, faChartLine,
  faChartPie, faChartArea, faTable, faSort, faSortUp, faSortDown,
  faFileExport, faSearch, faBell, faCog, faList, faCheck, faTachometerAlt,
  faHome, faExclamationCircle, faBoxes, faArrowUp, faArrowDown,
  faMinus, faTimes, faCubes, faWarehouse, faCalendarDay, faCertificate,
  faIdCard, faStar, farStar, faStarHalf, faEllipsisV, faPencilAlt,
  faFileContract, faInfoCircle, faShoppingCart, faStickyNote,
  faFilePdf, faEnvelope, faPhone
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">

          {/* 🔝 Barra de navegação fixa */}
          <header className="header-fixed">
            <Navbar />
            <div className="header-tools">
              <LanguageSelector />
            </div>
          </header>

          {/* 🧭 Conteúdo principal */}
          <main className="content-container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard/*" element={<DashboardLayout />}>
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

          {/* 📌 Rodapé */}
          <footer className="app-footer">
            <p>© 2025 ASCH – Sistema de Gestão da Qualidade</p>
          </footer>

          {/* Indicador do modo de API (apenas em desenvolvimento) */}
          <ApiModeStatus />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;