// components/dashboard/kpis/KPIGrid.tsx
import React from 'react';
import KPICard from './KPICard';
import TrendIndicator from './TrendIndicator';
import { 
  Briefcase, 
  AlertTriangle, 
  FileText, 
  Star, 
  FlaskConical, 
  CheckSquare, 
  BarChart2,
  Package,
  Award,
  Clock,
  XCircle
} from 'lucide-react';

interface KPIGridProps {
  data: any;
  type: 'strategic' | 'technical' | 'inspection' | 'materials';
  loading?: boolean;
  historicalData?: any;
}

const KPIGrid: React.FC<KPIGridProps> = ({ 
  data, 
  type, 
  loading = false,
  historicalData
}) => {
  // Obter dados históricos para comparação (se disponíveis)
  const getHistoricalValue = (key: string) => {
    if (!historicalData || !historicalData[type]) return undefined;
    return historicalData[type][key];
  };

  // Renderização condicional baseada no tipo
  const renderStrategicKPIs = () => {
    if (!data || !data.strategic) return null;
    
    return (
      <div className="dashboard-pro-kpi-grid">
        <KPICard 
          title="Projetos Ativos"
          value={data.strategic.activeProjects}
          previousValue={getHistoricalValue('activeProjects')}
          icon={<Briefcase />}
          color="#4361ee"
          loading={loading}
        />
        <KPICard 
          title="Total de Projetos"
          value={data.strategic.totalProjects}
          previousValue={getHistoricalValue('totalProjects')}
          icon={<Briefcase />}
          color="#3a0ca3"
          loading={loading}
        />
        <KPICard 
          title="Não Conformidades Abertas"
          value={data.strategic.openNonConformities}
          previousValue={getHistoricalValue('openNonConformities')}
          inverseThreshold={true}
          threshold={{ warning: 5, critical: 10 }}
          icon={<AlertTriangle />}
          color="#e63946"
          loading={loading}
        />
        <KPICard 
          title="Conformidade de Documentos"
          value={data.strategic.documentsComplianceRate}
          format="percentage"
          previousValue={getHistoricalValue('documentsComplianceRate')}
          threshold={{ warning: 80, critical: 60 }}
          icon={<FileText />}
          color="#06d6a0"
          loading={loading}
        />
        <KPICard 
          title="Pontuação Geral de Qualidade"
          value={data.strategic.overallQualityScore}
          previousValue={getHistoricalValue('overallQualityScore')}
          threshold={{ warning: 70, critical: 50 }}
          icon={<Star />}
          color="#ffd166"
          loading={loading}
        />
      </div>
    );
  };

  const renderTechnicalKPIs = () => {
    if (!data || !data.technical) return null;
    
    return (
      <div className="dashboard-pro-kpi-grid">
        <KPICard 
          title="Total de Ensaios"
          value={data.technical.totalTests}
          previousValue={getHistoricalValue('totalTests')}
          icon={<FlaskConical />}
          color="#118ab2"
          loading={loading}
        />
        <KPICard 
          title="Ensaios Pendentes"
          value={data.technical.pendingTests}
          previousValue={getHistoricalValue('pendingTests')}
          inverseThreshold={true}
          threshold={{ warning: 5, critical: 10 }}
          icon={<Clock />}
          color="#ff9f1c"
          loading={loading}
        />
        <KPICard 
          title="Ensaios Reprovados"
          value={data.technical.failedTests}
          previousValue={getHistoricalValue('failedTests')}
          inverseThreshold={true}
          threshold={{ warning: 3, critical: 7 }}
          icon={<XCircle />}
          color="#e63946"
          loading={loading}
        />
        <KPICard 
          title="Conclusão de Checklists"
          value={data.technical.checklistCompletion}
          format="percentage"
          previousValue={getHistoricalValue('checklistCompletion')}
          threshold={{ warning: 80, critical: 60 }}
          icon={<CheckSquare />}
          color="#06d6a0"
          loading={loading}
        />
        <KPICard 
          title="Não Conformidades por Categoria"
          value={Object.keys(data.technical.nonConformitiesByCategory || {}).length}
          previousValue={getHistoricalValue('nonConformitiesByCategory') ? 
            Object.keys(getHistoricalValue('nonConformitiesByCategory')).length : undefined}
          icon={<BarChart2 />}
          color="#8338ec"
          loading={loading}
        />
      </div>
    );
  };

  const renderInspectionKPIs = () => {
    if (!data || !data.inspection) return null;
    
    return (
      <div className="dashboard-pro-kpi-grid">
        <KPICard 
          title="Inspeções Pendentes"
          value={data.inspection.pendingInspections}
          previousValue={getHistoricalValue('pendingInspections')}
          inverseThreshold={true}
          threshold={{ warning: 5, critical: 10 }}
          icon={<Clock />}
          color="#ff9f1c"
          loading={loading}
        />
        <KPICard 
          title="Inspeções Concluídas"
          value={data.inspection.completedInspections}
          previousValue={getHistoricalValue('completedInspections')}
          icon={<CheckSquare />}
          color="#06d6a0"
          loading={loading}
        />
        <KPICard 
          title="Taxa de Conformidade em Inspeções"
          value={data.inspection.inspectionComplianceRate}
          format="percentage"
          previousValue={getHistoricalValue('inspectionComplianceRate')}
          threshold={{ warning: 80, critical: 60 }}
          icon={<Star />}
          color="#06d6a0"
          loading={loading}
        />
        <KPICard 
          title="Não Conformidades Críticas"
          value={data.inspection.criticalNonConformities}
          previousValue={getHistoricalValue('criticalNonConformities')}
          inverseThreshold={true}
          threshold={{ warning: 3, critical: 5 }}
          icon={<AlertTriangle />}
          color="#e63946"
          loading={loading}
        />
      </div>
    );
  };

  const renderMaterialsKPIs = () => {
    if (!data || !data.materials) return null;
    
    return (
      <div className="dashboard-pro-kpi-grid">
        <KPICard 
          title="Total de Materiais"
          value={data.materials.totalMaterials}
          previousValue={getHistoricalValue('totalMaterials')}
          icon={<Package />}
          color="#118ab2"
          loading={loading}
        />
        <KPICard 
          title="Materiais com Certificação"
          value={data.materials.materialsWithCertification}
          previousValue={getHistoricalValue('materialsWithCertification')}
          icon={< Award/>}
          color="#06d6a0"
          loading={loading}
        />
        <KPICard 
          title="Aprovações de Materiais Pendentes"
          value={data.materials.pendingMaterialApprovals}
          previousValue={getHistoricalValue('pendingMaterialApprovals')}
          inverseThreshold={true}
          threshold={{ warning: 5, critical: 10 }}
          icon={<Clock />}
          color="#ff9f1c"
          loading={loading}
        />
        <KPICard 
          title="Materiais Rejeitados"
          value={data.materials.rejectedMaterials}
          previousValue={getHistoricalValue('rejectedMaterials')}
          inverseThreshold={true}
          threshold={{ warning: 3, critical: 7 }}
          icon={<XCircle />}
          color="#e63946"
          loading={loading}
        />
      </div>
    );
  };

  // Renderizar o tipo de KPI apropriado
  const renderKPIs = () => {
    switch (type) {
      case 'strategic':
        return renderStrategicKPIs();
      case 'technical':
        return renderTechnicalKPIs();
      case 'inspection':
        return renderInspectionKPIs();
      case 'materials':
        return renderMaterialsKPIs();
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-pro-kpi-container">
      <h2 className="dashboard-pro-kpi-section-title">
        {type === 'strategic' && 'Indicadores Estratégicos'}
        {type === 'technical' && 'Indicadores Técnicos'}
        {type === 'inspection' && 'Indicadores de Inspeção'}
        {type === 'materials' && 'Indicadores de Materiais'}
      </h2>
      {renderKPIs()}
    </div>
  );
};

export default KPIGrid;