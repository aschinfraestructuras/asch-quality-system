import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Páginas principais
import DashboardPro from './pages/DashboardPro';
import Checklists from './pages/Checklists';
import Relatorios from './pages/Relatorios';

// Rotas modulares
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidadesRoutes from './components/NaoConformidadesRoutes';
import DocumentosRoutes from './components/DocumentosRoutes';
import MateriaisRoutes from './components/MateriaisRoutes';
import FornecedorRoutes from './components/FornecedorRoutes'; // Nova importação

// Componentes globais
import Navbar from './components/Navbar';

// Estilos globais
import './styles/App.css';
import './styles/DashboardPro.css';

// FontAwesome: setup da biblioteca de ícones
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBuilding, faFile, faFlask, faExclamationTriangle, faClipboardCheck,
  faBox, faSync, faCalendarAlt, faUser, faFilter, faHistory, faClock, faEye,
  faPlus, faTasks, faCheckCircle, faChartBar, faChartLine, faChartPie,
  faChartArea, faTable, faSort, faSortUp, faSortDown, faFileExport,
  faSearch, faBell, faCog, faList, faCheck, faTachometerAlt, faHome,
  faExclamationCircle, faBoxes, faArrowUp, faArrowDown, faMinus, faTimes,
  faCubes, faWarehouse, faCalendarDay, faCertificate, faIdCard, faStar,
  faStarHalf, faEllipsisV, faPencilAlt, faFileContract, faInfoCircle,
  faShoppingCart, faStickyNote, faFilePdf, faEnvelope, faPhone 
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
    <BrowserRouter>
      <div className="app-container">
        
        {/* 🔝 Navbar
  <div className="app-container">
        
        {/* 🔝 Navbar fixa no topo */}
        <header className="header-fixed">
          <Navbar />
        </header>

        {/* 🧭 Área de conteúdo com navegação entre módulos */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPro />} />
            <Route path="/checklists/*" element={<Checklists />} />
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            <Route path="/nao-conformidades/*" element={<NaoConformidadesRoutes />} />
            <Route path="/documentos/*" element={<DocumentosRoutes />} />
            <Route path="/materiais/*" element={<MateriaisRoutes />} />
            <Route path="/fornecedores/*" element={<FornecedorRoutes />} />
            <Route path="/relatorios/*" element={<Relatorios />} />
            <Route path="*" element={<h1 style={{ padding: '2rem' }}>Página não encontrada</h1>} />
          </Routes>
        </main>

        {/* 📌 Rodapé fixo com branding */}
        <footer className="app-footer">
          <p>© 2025 ASCH – Sistema de Gestão da Qualidade</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;      