import { useState } from 'react';
import '../styles/EnsaiosDashboard.css';

// Tipos para os dados do dashboard
interface EnsaioStats {
  total: number;
  conformes: number;
  naoConformes: number;
  emAnalise: number;
  pendentes: number;
}

interface ProjectStats {
  name: string;
  count: number;
  conformes: number;
  naoConformes: number;
}

interface TypeStats {
  type: string;
  count: number;
  conformityRate: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  conformes: number;
  naoConformes: number;
}

// Dados de exemplo
const statsData: EnsaioStats = {
  total: 342,
  conformes: 278,
  naoConformes: 28,
  emAnalise: 18,
  pendentes: 18
};

const projectStats: ProjectStats[] = [
  {
    name: 'Obra Ferroviária Setúbal',
    count: 145,
    conformes: 120,
    naoConformes: 25
  },
  {
    name: 'Ponte Vasco da Gama - Manutenção',
    count: 78,
    conformes: 65,
    naoConformes: 13
  },
  {
    name: 'Ampliação Terminal Portuário',
    count: 56,
    conformes: 48,
    naoConformes: 8
  },
  {
    name: 'Edifício Sede - Lisboa',
    count: 34,
    conformes: 32,
    naoConformes: 2
  },
  {
    name: 'Barragem Norte',
    count: 29,
    conformes: 26,
    naoConformes: 3
  }
];

const typeStats: TypeStats[] = [
  { type: 'Betão - Compressão', count: 85, conformityRate: 94 },
  { type: 'Solos - Compactação', count: 68, conformityRate: 88 },
  { type: 'Solos - CBR', count: 45, conformityRate: 91 },
  { type: 'Betão - Abaixamento', count: 42, conformityRate: 98 },
  { type: 'Agregados - Granulometria', count: 38, conformityRate: 89 },
  { type: 'Solos - Controlo de Compactação', count: 36, conformityRate: 78 },
  { type: 'Aço - Tração', count: 28, conformityRate: 96 }
];

const monthlyStats: MonthlyStats[] = [
  { month: 'Jan', count: 28, conformes: 24, naoConformes: 4 },
  { month: 'Fev', count: 32, conformes: 29, naoConformes: 3 },
  { month: 'Mar', count: 35, conformes: 30, naoConformes: 5 },
  { month: 'Abr', count: 42, conformes: 36, naoConformes: 6 },
  { month: 'Mai', count: 38, conformes: 35, naoConformes: 3 },
  { month: 'Jun', count: 45, conformes: 40, naoConformes: 5 },
  { month: 'Jul', count: 42, conformes: 39, naoConformes: 3 },
  { month: 'Ago', count: 25, conformes: 22, naoConformes: 3 },
  { month: 'Set', count: 30, conformes: 28, naoConformes: 2 },
  { month: 'Out', count: 35, conformes: 32, naoConformes: 3 },
  { month: 'Nov', count: 0, conformes: 0, naoConformes: 0 },
  { month: 'Dez', count: 0, conformes: 0, naoConformes: 0 }
];

const EnsaiosDashboard = () => {
  const [stats] = useState<EnsaioStats>(statsData);
  const [projects] = useState<ProjectStats[]>(projectStats);

  const [types] = useState<TypeStats[]>(typeStats);
  const [monthly] = useState<MonthlyStats[]>(monthlyStats);
  const [timeFrame, setTimeFrame] = useState<string>('year');
  const [loading, setLoading] = useState<boolean>(false);

  // Filtro de período para os dados
  const handleTimeFrameChange = (period: string) => {
    setLoading(true);
    setTimeFrame(period);
    
    // Simular uma chamada à API para buscar dados do período selecionado
    setTimeout(() => {
      // Neste exemplo, apenas fingimos atualizar os dados
      setLoading(false);
    }, 500);
  };

  // Calcular a taxa de conformidade geral
  const conformityRate = stats.total > 0 
    ? Math.round((stats.conformes / stats.total) * 100) 
    : 0;

  return (
    <div className="ensaios-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard de Ensaios</h2>
        
        <div className="time-filter">
          <button 
            className={`time-btn ${timeFrame === 'month' ? 'active' : ''}`}
            onClick={() => handleTimeFrameChange('month')}
          >
            Este Mês
          </button>
          <button 
            className={`time-btn ${timeFrame === 'quarter' ? 'active' : ''}`}
            onClick={() => handleTimeFrameChange('quarter')}
          >
            Último Trimestre
          </button>
          <button 
            className={`time-btn ${timeFrame === 'year' ? 'active' : ''}`}
            onClick={() => handleTimeFrameChange('year')}
          >
            Este Ano
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-indicator">A carregar dados...</div>
      ) : (
        <div className="dashboard-content">
          {/* Estatísticas gerais */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total de Ensaios</div>
            </div>
            <div className="stat-card card-success">
              <div className="stat-value">{stats.conformes}</div>
              <div className="stat-label">Conformes</div>
            </div>
            <div className="stat-card card-danger">
              <div className="stat-value">{stats.naoConformes}</div>
              <div className="stat-label">Não Conformes</div>
            </div>
            <div className="stat-card card-warning">
              <div className="stat-value">{stats.emAnalise}</div>
              <div className="stat-label">Em Análise</div>
            </div>
            <div className="stat-card card-info">
              <div className="stat-value">{stats.pendentes}</div>
              <div className="stat-label">Pendentes</div>
            </div>
          </div>
          
          {/* Taxa de Conformidade */}
          <div className="conformity-rate-container">
            <div className="conformity-rate-title">Taxa de Conformidade</div>
            <div className="conformity-rate-wrapper">
              <div 
                className="conformity-rate-progress"
                style={{ 
                  width: `${conformityRate}%`,
                  backgroundColor: conformityRate >= 90 
                    ? '#27ae60' 
                    : conformityRate >= 75 
                      ? '#f39c12' 
                      : '#e74c3c'
                }}
              ></div>
              <div className="conformity-rate-label">{conformityRate}%</div>
            </div>
          </div>
          
          <div className="dashboard-row">
            {/* Ensaios por Projeto */}
            <div className="chart-container">
              <h3>Ensaios por Projeto</h3>
              <div className="horizontal-chart">
                {projects.map((project, index) => (
                  <div key={index} className="chart-item">
                    <div className="chart-label">{project.name}</div>
                    <div className="chart-bar-container">
                      <div 
                        className="chart-bar chart-bar-success"
                        style={{ width: `${(project.conformes / project.count) * 100}%` }}
                      ></div>
                      <div 
                        className="chart-bar chart-bar-danger"
                        style={{ width: `${(project.naoConformes / project.count) * 100}%` }}
                      ></div>
                    </div>
                    <div className="chart-value">{project.count}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color legend-success"></div>
                  <div className="legend-label">Conformes</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-danger"></div>
                  <div className="legend-label">Não Conformes</div>
                </div>
              </div>
            </div>
            
            {/* Ensaios por Tipo */}
            <div className="chart-container">
              <h3>Principais Tipos de Ensaio</h3>
              <div className="horizontal-chart">
                {types.map((type, index) => (
                  <div key={index} className="chart-item">
                    <div className="chart-label">{type.type}</div>
                    <div className="chart-bar-container">
                      <div 
                        className={`chart-bar ${
                          type.conformityRate >= 90 
                            ? 'chart-bar-success' 
                            : type.conformityRate >= 75 
                              ? 'chart-bar-warning' 
                              : 'chart-bar-danger'
                        }`}
                        style={{ width: `${type.conformityRate}%` }}
                      ></div>
                    </div>
                    <div className="chart-value">{type.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Ensaios por Mês */}
          <div className="chart-container full-width">
            <h3>Ensaios por Mês</h3>
            <div className="vertical-chart">
              {monthly.map((month, index) => (
                <div key={index} className="vertical-chart-item">
                  <div className="vertical-chart-column">
                    {month.count > 0 && (
                      <>
                        <div 
                          className="vertical-bar vertical-bar-danger"
                          style={{ 
                            height: `${(month.naoConformes / month.count) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="vertical-bar vertical-bar-success"
                          style={{ 
                            height: `${(month.conformes / month.count) * 100}%` 
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                  <div className="vertical-chart-value">{month.count}</div>
                  <div className="vertical-chart-label">{month.month}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color legend-success"></div>
                <div className="legend-label">Conformes</div>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-danger"></div>
                <div className="legend-label">Não Conformes</div>
              </div>
            </div>
          </div>
          
          {/* KPIs Adicionais */}
          <div className="kpi-container">
            <div className="kpi-card">
              <div className="kpi-value">4.8</div>
              <div className="kpi-label">Dias em Média para Conclusão</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">96%</div>
              <div className="kpi-label">Taxa de Aprovação à Primeira</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">82%</div>
              <div className="kpi-label">Conformidade com Normas</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-value">12h</div>
              <div className="kpi-label">Tempo Médio de Processamento</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnsaiosDashboard;