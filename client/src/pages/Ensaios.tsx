import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import EnsaiosList from './EnsaiosList';
import NewEnsaio from './NewEnsaio';
import ViewEnsaio from './ViewEnsaio';
import EnsaiosDashboard from '../components/EnsaiosDashboard';
import EnsaiosReports from '../components/EnsaiosReports';
import EnsaiosAnalysis from '../components/EnsaiosAnalysis';
import EnsaiosWorkflow from '../components/EnsaiosWorkflow';
import LabIntegration from '../components/LabIntegration';
import '../styles/EnsaiosModule.css';

const EnsaiosModule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Determinar a tab ativa com base na URL atual
  function getActiveTab() {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/analysis')) return 'analysis';
    if (path.includes('/workflow')) return 'workflow';
    if (path.includes('/lab-integration')) return 'lab-integration';
    if (path.includes('/novo')) return 'list'; // Consideramos a criação como parte da listagem
    if (path.includes('/ensaios/') && path.split('/').length > 3) return 'list'; // Detalhes de um ensaio específico
    return 'list'; // Padrão é a listagem de ensaios
  }
  
  // Alternar entre as abas
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'dashboard':
        navigate('/ensaios/dashboard');
        break;
      case 'reports':
        navigate('/ensaios/reports');
        break;
      case 'analysis':
        navigate('/ensaios/analysis');
        break;
      case 'workflow':
        navigate('/ensaios/workflow');
        break;
      case 'lab-integration':
        navigate('/ensaios/lab-integration');
        break;
      default:
        navigate('/ensaios');
        break;
    }
  };
  
  return (
    <div className="ensaios-module">
      <div className="module-header">
        <h1>Gestão de Ensaios</h1>
        <p>Gestão completa de ensaios laboratoriais e de campo para controlo de qualidade</p>
      </div>
      
      <div className="module-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => handleTabChange('list')}
        >
          Ensaios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabChange('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleTabChange('reports')}
        >
          Relatórios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => handleTabChange('analysis')}
        >
          Análise Avançada
        </button>
        <button 
          className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => handleTabChange('workflow')}
        >
          Fluxo de Trabalho
        </button>
        <button 
          className={`tab-btn ${activeTab === 'lab-integration' ? 'active' : ''}`}
          onClick={() => handleTabChange('lab-integration')}
        >
          Integração Laboratorial
        </button>
      </div>
      
      <div className="module-content">
        <Routes>
          <Route path="/" element={<EnsaiosList />} />
          <Route path="/novo" element={<NewEnsaio />} />
          <Route path="/:id" element={<ViewEnsaio />} />
          <Route path="/:id/editar" element={<NewEnsaio />} />
          <Route path="/dashboard" element={<EnsaiosDashboard />} />
          <Route path="/reports" element={<EnsaiosReports />} />
          <Route path="/analysis" element={<EnsaiosAnalysis />} />
          <Route path="/workflow" element={<EnsaiosWorkflow />} />
          <Route path="/lab-integration" element={<LabIntegration />} />
        </Routes>
      </div>
    </div>
  );
};

export default EnsaiosModule;