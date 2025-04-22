// components/dashboard/panels/GeneralView.tsx
import React, { useMemo } from 'react';
import ProjectProgress from '../charts/ProjectProgress';
import NonConformityAnalysis from '../charts/NonConformityAnalysis';
import QualityMetrics from '../charts/QualityMetrics';
import { AlertTriangle, CheckSquare, Package, FileText, BarChart2 } from 'lucide-react';

// Interfaces para definir a estrutura dos dados
interface Project {
  id: string;
  status: string;
  name?: string;
}

interface Document {
  id: string;
  title?: string;
  is_compliant: boolean;
  created_at?: string;
  updated_at?: string;
  project_name?: string;
  status: string;
}

interface NonConformity {
  id: string;
  title?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  project_name?: string;
  category?: string;
}

interface Test {
  id: string;
  status: string;
}

interface Material {
  id: string;
  name?: string;
  has_certification: boolean;
  created_at?: string;
  updated_at?: string;
  project_name?: string;
  status: string;
}

interface Checklist {
  id: string;
  title?: string;
  status: string;
  is_compliant: boolean;
  created_at?: string;
  updated_at?: string;
  project_name?: string;
}

interface DashboardData {
  projects?: Project[];
  documents?: Document[];
  nonConformities?: NonConformity[];
  tests?: Test[];
  materials?: Material[];
  checklists?: Checklist[];
}

interface GeneralViewProps {
  data: DashboardData;
}

const GeneralView: React.FC<GeneralViewProps> = ({ data }) => {
  // Processamento de dados para métricas de qualidade
  const qualityMetricsData = useMemo(() => {
    if (!data) return null;
    
    return {
      documentsComplianceRate: data.documents ? 
        Math.round((data.documents.filter(d => d.is_compliant).length / data.documents.length) * 100) : 0,
      
      testsPassRate: data.tests ? 
        Math.round((data.tests.filter(t => t.status === 'passed').length / data.tests.length) * 100) : 0,
      
      inspectionComplianceRate: data.checklists ? 
        Math.round((data.checklists.filter(c => c.is_compliant).length / data.checklists.length) * 100) : 0,
      
      materialsCertificationRate: data.materials ? 
        Math.round((data.materials.filter(m => m.has_certification).length / data.materials.length) * 100) : 0,
      
      nonConformityResolutionRate: data.nonConformities ? 
        Math.round((data.nonConformities.filter(nc => nc.status === 'resolved').length / data.nonConformities.length) * 100) : 0,
      
      checklistCompletionRate: data.checklists ? 
        Math.round((data.checklists.filter(c => c.status === 'completed').length / data.checklists.length) * 100) : 0
    };
  }, [data]);

  // Se não houver dados, mostrar mensagem
  if (!data) {
    return (
      <div className="dashboard-pro-no-data">
        <h2>Sem dados disponíveis</h2>
        <p>Não foi possível carregar os dados para o dashboard.</p>
      </div>
    );
  }

  // Transformar dados para exibição de contagens
  const counts = {
    projects: data.projects?.length || 0,
    activeProjects: data.projects?.filter(p => p.status === 'active').length || 0,
    documents: data.documents?.length || 0,
    materials: data.materials?.length || 0,
    nonConformities: data.nonConformities?.length || 0,
    openNonConformities: data.nonConformities?.filter(nc => nc.status === 'open').length || 0,
    tests: data.tests?.length || 0,
    pendingTests: data.tests?.filter(t => t.status === 'pending').length || 0,
    checklists: data.checklists?.length || 0,
    completedChecklists: data.checklists?.filter(c => c.status === 'completed').length || 0
  };

  return (
    <div className="dashboard-pro-panel">
      <div className="dashboard-pro-panel-header">
        <h2>Visão Geral</h2>
        <p className="dashboard-pro-panel-description">
          Resumo do estado atual de todos os módulos do sistema
        </p>
      </div>

      <div className="dashboard-pro-summary-cards">
        <div className="dashboard-pro-summary-card">
          <div className="dashboard-pro-summary-icon projects">
            <BarChart2 size={24} />
          </div>
          <div className="dashboard-pro-summary-info">
            <h3>Projetos</h3>
            <div className="dashboard-pro-summary-counts">
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Total:</span>
                <span className="dashboard-pro-count-value">{counts.projects}</span>
              </div>
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Ativos:</span>
                <span className="dashboard-pro-count-value">{counts.activeProjects}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-pro-summary-card">
          <div className="dashboard-pro-summary-icon documents">
            <FileText size={24} />
          </div>
          <div className="dashboard-pro-summary-info">
            <h3>Documentos</h3>
            <div className="dashboard-pro-summary-counts">
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Total:</span>
                <span className="dashboard-pro-count-value">{counts.documents}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-pro-summary-card">
          <div className="dashboard-pro-summary-icon nonconformities">
            <AlertTriangle size={24} />
          </div>
          <div className="dashboard-pro-summary-info">
            <h3>Não Conformidades</h3>
            <div className="dashboard-pro-summary-counts">
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Total:</span>
                <span className="dashboard-pro-count-value">{counts.nonConformities}</span>
              </div>
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Abertas:</span>
                <span className="dashboard-pro-count-value">{counts.openNonConformities}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-pro-summary-card">
          <div className="dashboard-pro-summary-icon tests">
            <CheckSquare size={24} />
          </div>
          <div className="dashboard-pro-summary-info">
            <h3>Checklists & Ensaios</h3>
            <div className="dashboard-pro-summary-counts">
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Checklists:</span>
                <span className="dashboard-pro-count-value">{counts.completedChecklists}/{counts.checklists}</span>
              </div>
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Ensaios Pendentes:</span>
                <span className="dashboard-pro-count-value">{counts.pendingTests}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-pro-summary-card">
          <div className="dashboard-pro-summary-icon materials">
            <Package size={24} />
          </div>
          <div className="dashboard-pro-summary-info">
            <h3>Materiais</h3>
            <div className="dashboard-pro-summary-counts">
              <div className="dashboard-pro-summary-count">
                <span className="dashboard-pro-count-label">Total:</span>
                <span className="dashboard-pro-count-value">{counts.materials}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-pro-charts-grid">
        <div className="dashboard-pro-chart-container dashboard-pro-chart-container-large">
          <ProjectProgress 
            data={data.projects || []}
            height={350}
          />
        </div>
        
        <div className="dashboard-pro-chart-container">
          <NonConformityAnalysis 
            data={data.nonConformities || []}
            groupBy="category"
            height={350}
          />
        </div>
        
        <div className="dashboard-pro-chart-container">
          <QualityMetrics 
            data={qualityMetricsData || {}}
            height={350}
            title="Métricas de Qualidade"
          />
        </div>
      </div>

      <div className="dashboard-pro-recent-activities">
        <h3 className="dashboard-pro-section-title">Atividades Recentes</h3>
        
        <div className="dashboard-pro-activities-list">
          {generateRecentActivities(data)}
        </div>
      </div>
    </div>
  );
};

// Tipo para atividade
interface Activity {
  id: string;
  type: string;
  title: string;
  date: Date;
  project: string;
  status: string;
  icon: React.ReactNode;
}

// Função para gerar lista de atividades recentes baseada nos dados
const generateRecentActivities = (data: DashboardData): React.ReactNode => {
  if (!data) return null;
  
  // Combinar atividades de diferentes módulos
  const activities: Activity[] = [
    // Não conformidades
    ...(data.nonConformities || []).map((nc): Activity => ({
      id: `nc-${nc.id}`,
      type: 'nonconformity',
      title: `NC: ${nc.title || 'Sem título'}`,
      date: new Date(nc.created_at || nc.updated_at || Date.now()),
      project: nc.project_name || 'Sem projeto',
      status: nc.status,
      icon: <AlertTriangle size={16} />
    })),
    
    // Documentos
    ...(data.documents || []).map((doc): Activity => ({
      id: `doc-${doc.id}`,
      type: 'document',
      title: `Documento: ${doc.title || 'Sem título'}`,
      date: new Date(doc.created_at || doc.updated_at || Date.now()),
      project: doc.project_name || 'Sem projeto',
      status: doc.status,
      icon: <FileText size={16} />
    })),
    
    // Checklists
    ...(data.checklists || []).map((checklist): Activity => ({
      id: `check-${checklist.id}`,
      type: 'checklist',
      title: `Checklist: ${checklist.title || 'Sem título'}`,
      date: new Date(checklist.created_at || checklist.updated_at || Date.now()),
      project: checklist.project_name || 'Sem projeto',
      status: checklist.status,
      icon: <CheckSquare size={16} />
    })),
    
    // Materiais
    ...(data.materials || []).map((material): Activity => ({
      id: `mat-${material.id}`,
      type: 'material',
      title: `Material: ${material.name || 'Sem nome'}`,
      date: new Date(material.created_at || material.updated_at || Date.now()),
      project: material.project_name || 'Sem projeto',
      status: material.status,
      icon: <Package size={16} />
    })),
  ];
  
  // Ordenar por data (mais recente primeiro)
  const sortedActivities = activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Limitar a 10 atividades mais recentes
  const recentActivities = sortedActivities.slice(0, 10);
  
  if (recentActivities.length === 0) {
    return (
      <div className="dashboard-pro-no-activities">
        <p>Sem atividades recentes</p>
      </div>
    );
  }
  
  // Traduzir status para português
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      'active': 'Ativo',
      'completed': 'Concluído',
      'pending': 'Pendente',
      'suspended': 'Suspenso',
      'open': 'Aberto',
      'closed': 'Fechado',
      'in_progress': 'Em Progresso',
      'resolved': 'Resolvido',
      'failed': 'Reprovado',
      'passed': 'Aprovado'
    };

    return translations[status] || status;
  };
  
  // Formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return recentActivities.map(activity => (
    <div key={activity.id} className="dashboard-pro-activity-item">
      <div className="dashboard-pro-activity-icon">
        {activity.icon}
      </div>
      <div className="dashboard-pro-activity-content">
        <div className="dashboard-pro-activity-title">{activity.title}</div>
        <div className="dashboard-pro-activity-meta">
          <span className="dashboard-pro-activity-project">{activity.project}</span>
          <span className="dashboard-pro-activity-status">
            {translateStatus(activity.status)}
          </span>
        </div>
      </div>
      <div className="dashboard-pro-activity-date">
        {formatDate(activity.date)}
      </div>
    </div>
  ));
};

export default GeneralView;