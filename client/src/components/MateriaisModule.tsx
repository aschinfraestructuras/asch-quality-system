import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MateriaisList from '../pages/MateriaisList';
import NewMaterial from '../pages/NewMaterial';
import ViewMaterial from '../pages/ViewMaterial';
import MateriaisDashboard from './MateriaisDashboard';
import MateriaisReports from './MateriaisReports';
import MaterialInventario from './MaterialInventario';
import MaterialCertificacoes from './MaterialCertificacoes';
import '../styles/MateriaisModule.css';

/**
 * Componente principal para o Módulo de Materiais
 * Este módulo permite a gestão completa de materiais de construção,
 * incluindo stock, certificações, rastreabilidade e integração com fornecedores
 */
const MateriaisModule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Determinar a tab ativa com base na URL atual
  function getActiveTab() {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/inventario')) return 'inventario';
    if (path.includes('/certificacoes')) return 'certificacoes';
    if (path.includes('/rastreabilidade')) return 'rastreabilidade';
    if (path.includes('/novo')) return 'list'; // Consideramos a criação como parte da listagem
    if (path.includes('/materiais/') && path.split('/').length > 3) return 'list'; // Detalhes de um material específico
    return 'list'; // Padrão é a listagem de materiais
  }
  
  // Alternar entre as abas
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'dashboard':
        navigate('/materiais/dashboard');
        break;
      case 'reports':
        navigate('/materiais/reports');
        break;
      case 'inventario':
        navigate('/materiais/inventario');
        break;
      case 'certificacoes':
        navigate('/materiais/certificacoes');
        break;
      case 'rastreabilidade':
        navigate('/materiais/rastreabilidade');
        break;
      default:
        navigate('/materiais');
        break;
    }
  };
  
  return (
    <div className="materiais-module">
      <div className="module-header">
        <h1>Gestão de Materiais</h1>
        <p>Gestão completa de materiais de construção, inventário, certificações e rastreabilidade</p>
      </div>
      
      <div className="module-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => handleTabChange('list')}
        >
          Materiais
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
          className={`tab-btn ${activeTab === 'inventario' ? 'active' : ''}`}
          onClick={() => handleTabChange('inventario')}
        >
          Inventário
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certificacoes' ? 'active' : ''}`}
          onClick={() => handleTabChange('certificacoes')}
        >
          Certificações
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rastreabilidade' ? 'active' : ''}`}
          onClick={() => handleTabChange('rastreabilidade')}
        >
          Rastreabilidade
        </button>
      </div>
      
      <div className="module-content">
        <Routes>
          <Route path="/" element={<MateriaisList />} />
          <Route path="/novo" element={<NewMaterial />} />
          <Route path="/:id" element={<ViewMaterial />} />
          <Route path="/:id/editar" element={<NewMaterial />} />
          <Route path="/dashboard" element={<MateriaisDashboard />} />
          <Route path="/reports" element={<MateriaisReports />} />
          <Route path="/inventario" element={<MaterialInventario />} />
          <Route path="/certificacoes" element={<MaterialCertificacoes />} />

        </Routes>
      </div>
    </div>
  );
};

export default MateriaisModule;