import { useState } from 'react';
import '../styles/EnsaiosReports.css';

// Tipos para filtros e relatórios
interface ReportFilter {
  startDate: string;
  endDate: string;
  projects: string[];
  types: string[];
  materials: string[];
  conformity: string[];
  technicians: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Dados disponíveis para filtros
const availableProjects = [
  'Obra Ferroviária Setúbal',
  'Ponte Vasco da Gama - Manutenção',
  'Ampliação Terminal Portuário',
  'Edifício Sede - Lisboa',
  'Barragem Norte'
];

const availableTypes = [
  'Betão - Compressão',
  'Betão - Abaixamento',
  'Solos - CBR',
  'Solos - Compactação',
  'Solos - Controlo de Compactação',
  'Agregados - Granulometria',
  'Aço - Tração',
  'Betão - Tração Diametral',
  'Argamassas - Flexão',
  'Geotecnia - Ensaio Triaxial'
];

const availableMaterials = [
  'Betão',
  'Solo',
  'Aço',
  'Balastro',
  'Agregado',
  'Argamassa'
];

const availableTechnicians = [
  'Carlos Santos',
  'Maria Oliveira',
  'João Silva',
  'Ana Pereira',
  'Ricardo Almeida',
  'Sofia Costa',
  'Pedro Martins'
];

// Templates de relatórios
const reportTemplates: ReportTemplate[] = [
  {
    id: 'summary',
    name: 'Resumo Geral',
    description: 'Resumo geral de todos os ensaios com estatísticas e gráficos',
    icon: 'chart-bar'
  },
  {
    id: 'detail',
    name: 'Relatório Detalhado',
    description: 'Relatório detalhado com todos os resultados de ensaios',
    icon: 'document-text'
  },
  {
    id: 'conformity',
    name: 'Relatório de Conformidade',
    description: 'Análise de conformidade por tipo de ensaio e projeto',
    icon: 'clipboard-check'
  },
  {
    id: 'project',
    name: 'Relatório por Projeto',
    description: 'Relatório específico para um projeto com todos os ensaios',
    icon: 'building'
  },
  {
    id: 'technical',
    name: 'Relatório Técnico',
    description: 'Relatório técnico detalhado com análises e recomendações',
    icon: 'beaker'
  },
  {
    id: 'custom',
    name: 'Relatório Personalizado',
    description: 'Crie um relatório personalizado com os campos que desejar',
    icon: 'puzzle'
  }
];

const EnsaiosReports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    projects: [],
    types: [],
    materials: [],
    conformity: [],
    technicians: []
  });
  
  // Atualizar filtros
  const updateFilter = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Atualizar filtros de array (multi-select)
  const toggleArrayFilter = (field: string, value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[field as keyof ReportFilter]] as string[];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      } else {
        currentValues.splice(index, 1);
        return {
          ...prev,
          [field]: currentValues
        };
      }
    });
  };
  
  // Selecionar template
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowFilterPanel(true);
  };
  
  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      projects: [],
      types: [],
      materials: [],
      conformity: [],
      technicians: []
    });
  };
  
  // Gerar relatório
  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulação de geração de relatório
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 1500);
  };
  
  // Voltar para a seleção de template
  const backToTemplates = () => {
    setSelectedTemplate('');
    setShowFilterPanel(false);
    setReportGenerated(false);
  };
  
  // Exportar relatório
  const exportReport = (format: string) => {
    alert(`Relatório exportado em formato ${format}`);
  };

  return (
    <div className="ensaios-reports">
      <div className="reports-header">
        <h2>Relatórios de Ensaios</h2>
        
        {selectedTemplate && (
          <button 
            className="back-button"
            onClick={backToTemplates}
          >
            ← Voltar
          </button>
        )}
      </div>
      
      {!selectedTemplate ? (
        // Seleção de Template
        <div className="template-selection">
          <h3>Selecione um modelo de relatório</h3>
          
          <div className="templates-grid">
            {reportTemplates.map(template => (
              <div 
                key={template.id}
                className="template-card"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="template-icon">
                  <span className={`icon-${template.icon}`}></span>
                </div>
                <h4>{template.name}</h4>
                <p>{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Painel de Filtros e Geração de Relatório
        <div className="report-panel">
          {showFilterPanel && !reportGenerated && (
            <div className="filter-panel">
              <h3>Filtros do Relatório</h3>
              
              <div className="filter-form">
                <div className="filter-section">
                  <h4>Período</h4>
                  <div className="filter-row">
                    <div className="filter-group">
                      <label>Data de Início</label>
                      <input 
                        type="date" 
                        value={filters.startDate}
                        onChange={(e) => updateFilter('startDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="filter-group">
                      <label>Data de Fim</label>
                      <input 
                        type="date" 
                        value={filters.endDate}
                        onChange={(e) => updateFilter('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="filter-section">
                  <h4>Projetos</h4>
                  <div className="checkbox-grid">
                    {availableProjects.map(project => (
                      <div key={project} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`project-${project}`}
                          checked={filters.projects.includes(project)}
                          onChange={() => toggleArrayFilter('projects', project)}
                        />
                        <label htmlFor={`project-${project}`}>{project}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="filter-section">
                  <h4>Tipos de Ensaio</h4>
                  <div className="checkbox-grid">
                    {availableTypes.map(type => (
                      <div key={type} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          checked={filters.types.includes(type)}
                          onChange={() => toggleArrayFilter('types', type)}
                        />
                        <label htmlFor={`type-${type}`}>{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="filter-section">
                  <h4>Materiais</h4>
                  <div className="checkbox-grid">
                    {availableMaterials.map(material => (
                      <div key={material} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`material-${material}`}
                          checked={filters.materials.includes(material)}
                          onChange={() => toggleArrayFilter('materials', material)}
                        />
                        <label htmlFor={`material-${material}`}>{material}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="filter-section">
                  <h4>Conformidade</h4>
                  <div className="checkbox-grid">
                    {['Conforme', 'Não Conforme', 'Em análise', 'Pendente'].map(status => (
                      <div key={status} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`conformity-${status}`}
                          checked={filters.conformity.includes(status)}
                          onChange={() => toggleArrayFilter('conformity', status)}
                        />
                        <label htmlFor={`conformity-${status}`}>{status}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="filter-section">
                  <h4>Técnicos</h4>
                  <div className="checkbox-grid">
                    {availableTechnicians.map(technician => (
                      <div key={technician} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`technician-${technician}`}
                          checked={filters.technicians.includes(technician)}
                          onChange={() => toggleArrayFilter('technicians', technician)}
                        />
                        <label htmlFor={`technician-${technician}`}>{technician}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="filter-actions">
                <button 
                  className="clear-btn"
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </button>
                <button 
                  className="generate-btn"
                  onClick={generateReport}
                >
                  Gerar Relatório
                </button>
              </div>
            </div>
          )}
          
          {isGenerating && (
            <div className="generating-report">
              <div className="loading-spinner"></div>
              <p>A gerar relatório, por favor aguarde...</p>
            </div>
          )}
          
          {reportGenerated && (
            <div className="report-result">
              <div className="report-header">
                <h3>
                  {reportTemplates.find(t => t.id === selectedTemplate)?.name} - 
                  Gerado em {new Date().toLocaleDateString('pt-PT')}
                </h3>
                
                <div className="export-options">
                  <button onClick={() => exportReport('pdf')}>
                    Exportar PDF
                  </button>
                  <button onClick={() => exportReport('excel')}>
                    Exportar Excel
                  </button>
                  <button onClick={() => exportReport('csv')}>
                    Exportar CSV
                  </button>
                </div>
              </div>
              
              <div className="report-preview">
                {/* Aqui seria renderizada a pré-visualização do relatório */}
                <div className="report-placeholder">
                  <h4>Pré-visualização do Relatório</h4>
                  <p>O relatório foi gerado com sucesso. Utilize as opções acima para exportar.</p>
                  
                  <div className="report-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total de Ensaios:</span>
                      <span className="summary-value">142</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Período:</span>
                      <span className="summary-value">
                        {filters.startDate ? new Date(filters.startDate).toLocaleDateString('pt-PT') : 'N/A'} 
                        {' a '}
                        {filters.endDate ? new Date(filters.endDate).toLocaleDateString('pt-PT') : 'N/A'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Projetos:</span>
                      <span className="summary-value">
                        {filters.projects.length > 0 ? filters.projects.length : 'Todos'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Taxa de Conformidade:</span>
                      <span className="summary-value success">94%</span>
                    </div>
                  </div>
                  
                  <div className="report-table-preview">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Ensaio</th>
                          <th>Projeto</th>
                          <th>Data</th>
                          <th>Resultado</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>E-2342</td>
                          <td>Betão - Compressão</td>
                          <td>Obra Ferroviária Setúbal</td>
                          <td>15/04/2025</td>
                          <td>32 MPa</td>
                          <td><span className="status-badge success">Conforme</span></td>
                        </tr>
                        <tr>
                          <td>E-2343</td>
                          <td>Solos - CBR</td>
                          <td>Ponte Vasco da Gama - Manutenção</td>
                          <td>12/04/2025</td>
                          <td>4%</td>
                          <td><span className="status-badge danger">Não Conforme</span></td>
                        </tr>
                        <tr>
                          <td>E-2344</td>
                          <td>Betão - Abaixamento</td>
                          <td>Obra Ferroviária Setúbal</td>
                          <td>15/04/2025</td>
                          <td>100 mm</td>
                          <td><span className="status-badge success">Conforme</span></td>
                        </tr>
                        <tr>
                          <td>E-2345</td>
                          <td>Agregados - Granulometria</td>
                          <td>Ampliação Terminal Portuário</td>
                          <td>14/04/2025</td>
                          <td>Cat. GF85</td>
                          <td><span className="status-badge success">Conforme</span></td>
                        </tr>
                        <tr>
                          <td>E-2346</td>
                          <td>Aço - Tração</td>
                          <td>Edifício Sede - Lisboa</td>
                          <td>13/04/2025</td>
                          <td>550 MPa</td>
                          <td><span className="status-badge warning">Pendente</span></td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="table-footer">
                      Mostrando 5 de 142 ensaios. Exporte o relatório para ver todos os dados.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnsaiosReports;