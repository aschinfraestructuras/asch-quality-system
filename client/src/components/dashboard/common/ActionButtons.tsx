import React from 'react';
import { 
  Home, 
  BarChart2, 
  CheckSquare, 
  Package, 
  FilePlus,
  FileText,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ← NOVO
import { UserRole } from '../../../interfaces/dashboardTypes';

interface ActionButtonsProps {
  onViewChange: (view: string) => void;
  activeView: string;
  userRole: UserRole;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onViewChange,
  activeView,
  userRole
}) => {
  const navigate = useNavigate(); // ← NOVO

  // Determinar quais botões mostrar com base no papel do utilizador
  const getViewButtons = () => {
    const buttons = [];
    
    // Botão Visão Geral - disponível para todos
    buttons.push(
      <button
        key="general"
        className={`dashboard-pro-action-button ${activeView === 'general' ? 'active' : ''}`}
        onClick={() => onViewChange('general')}
        aria-label="Visão Geral"
      >
        <Home size={20} />
        <span>Visão Geral</span>
      </button>
    );
    
    // Botões específicos por papel
    switch (userRole) {
      case 'manager':
        // Gestor vê projetos e análises
        buttons.push(
          <button
            key="projects"
            className={`dashboard-pro-action-button ${activeView === 'projects' ? 'active' : ''}`}
            onClick={() => onViewChange('projects')}
            aria-label="Projetos"
          >
            <CheckSquare size={20} />
            <span>Projetos</span>
          </button>
        );
        buttons.push(
          <button
            key="analytics"
            className="dashboard-pro-action-button"
            onClick={() => navigate('/dashboard/analytics')}
            aria-label="Analítico"
          >
            <BarChart2 size={20} />
            <span>Analítico</span>
          </button>
        );
        break;
        
      case 'engineer':
        // Engenheiro vê projetos e qualidade
        buttons.push(
          <button
            key="projects"
            className={`dashboard-pro-action-button ${activeView === 'projects' ? 'active' : ''}`}
            onClick={() => onViewChange('projects')}
            aria-label="Projetos"
          >
            <CheckSquare size={20} />
            <span>Projetos</span>
          </button>
        );
        buttons.push(
          <button
            key="quality"
            className={`dashboard-pro-action-button ${activeView === 'quality' ? 'active' : ''}`}
            onClick={() => onViewChange('quality')}
            aria-label="Qualidade"
          >
            <AlertTriangle size={20} />
            <span>Qualidade</span>
          </button>
        );
        break;
        
      case 'inspector':
        // Inspetor vê principalmente qualidade
        buttons.push(
          <button
            key="quality"
            className={`dashboard-pro-action-button ${activeView === 'quality' ? 'active' : ''}`}
            onClick={() => onViewChange('quality')}
            aria-label="Qualidade"
          >
            <AlertTriangle size={20} />
            <span>Qualidade</span>
          </button>
        );
        break;
        
      case 'warehouse':
        // Almoxarifado vê principalmente materiais
        buttons.push(
          <button
            key="materials"
            className={`dashboard-pro-action-button ${activeView === 'materials' ? 'active' : ''}`}
            onClick={() => onViewChange('materials')}
            aria-label="Materiais"
          >
            <Package size={20} />
            <span>Materiais</span>
          </button>
        );
        break;
    }
    
    return buttons;
  };

  // Botões de ação rápida
  const getQuickActions = () => {
    const actions = [];
    
    // Ações específicas por papel
    switch (userRole) {
      case 'manager':
      case 'engineer':
        // Pode criar novos documentos
        actions.push(
          <button
            key="new-document"
            className="dashboard-pro-quick-action"
            aria-label="Novo Documento"
          >
            <FileText size={18} />
            <span>Novo Documento</span>
          </button>
        );
        break;
        
      case 'inspector':
        // Pode criar checklists e reportar não conformidades
        actions.push(
          <button
            key="new-checklist"
            className="dashboard-pro-quick-action"
            aria-label="Novo Checklist"
          >
            <CheckSquare size={18} />
            <span>Novo Checklist</span>
          </button>
        );
        actions.push(
          <button
            key="new-nonconformity"
            className="dashboard-pro-quick-action"
            aria-label="Nova Não Conformidade"
          >
            <AlertTriangle size={18} />
            <span>Nova NC</span>
          </button>
        );
        break;
        
      case 'warehouse':
        // Pode adicionar novos materiais
        actions.push(
          <button
            key="new-material"
            className="dashboard-pro-quick-action"
            aria-label="Novo Material"
          >
            <Package size={18} />
            <span>Novo Material</span>
          </button>
        );
        break;
    }
    
    // Botão de nova ação genérica
    actions.push(
      <button
        key="new-item"
        className="dashboard-pro-quick-action dashboard-pro-new-item"
        aria-label="Nova Ação"
      >
        <PlusCircle size={18} />
        <span>Nova Ação</span>
      </button>
    );
    
    return actions;
  };

  return (
    <div className="dashboard-pro-action-container">
      <div className="dashboard-pro-view-buttons">
        {getViewButtons()}
      </div>
      <div className="dashboard-pro-quick-actions">
        {getQuickActions()}
      </div>
    </div>
  );
};

export default ActionButtons;
