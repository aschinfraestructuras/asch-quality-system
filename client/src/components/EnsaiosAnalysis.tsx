import { useState, useEffect } from 'react';
import '../styles/EnsaiosAnalysis.css';

// Tipos para análise de ensaios
interface AnalysisParameter {
  id: string;
  name: string;
  unit: string;
  type: string;
  relatedEnsaio: string;
}

interface CorrelationData {
  id: string;
  xParameter: string;
  yParameter: string;
  correlationCoefficient: number;
  dataPoints: Array<[number, number]>;
  regressionEquation?: string;
}

interface TrendData {
  parameter: string;
  unit: string;
  data: Array<{
    date: string;
    value: number;
    ensaioId: string;
    project: string;
  }>;
}

interface StatisticalData {
  parameter: string;
  unit: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  ucl: number; // Upper Control Limit
  lcl: number; // Lower Control Limit
}

// Parâmetros disponíveis para análise
const availableParameters: AnalysisParameter[] = [
  {
    id: 'param-1',
    name: 'Resistência à Compressão',
    unit: 'MPa',
    type: 'Numérico',
    relatedEnsaio: 'Betão - Compressão'
  },
  {
    id: 'param-2',
    name: 'Abaixamento',
    unit: 'mm',
    type: 'Numérico',
    relatedEnsaio: 'Betão - Abaixamento'
  },
  {
    id: 'param-3',
    name: 'Valor CBR',
    unit: '%',
    type: 'Numérico',
    relatedEnsaio: 'Solos - CBR'
  },
  {
    id: 'param-4',
    name: 'Grau de Compactação',
    unit: '%',
    type: 'Numérico',
    relatedEnsaio: 'Solos - Controlo de Compactação'
  },
  {
    id: 'param-5',
    name: 'Temperatura do Betão',
    unit: '°C',
    type: 'Numérico',
    relatedEnsaio: 'Betão - Abaixamento'
  },
  {
    id: 'param-6',
    name: 'Tensão de Cedência',
    unit: 'MPa',
    type: 'Numérico',
    relatedEnsaio: 'Aço - Tração'
  },
  {
    id: 'param-7',
    name: 'Teor de Humidade',
    unit: '%',
    type: 'Numérico',
    relatedEnsaio: 'Solos - Controlo de Compactação'
  },
  {
    id: 'param-8',
    name: 'Módulo de Finura',
    unit: '',
    type: 'Numérico',
    relatedEnsaio: 'Agregados - Granulometria'
  }
];

// Dados de exemplo para correlação
const sampleCorrelationData: CorrelationData = {
  id: 'corr-1',
  xParameter: 'param-5', // Temperatura do Betão
  yParameter: 'param-1', // Resistência à Compressão
  correlationCoefficient: -0.72, // Correlação negativa significativa
  dataPoints: [
    [18, 37], [20, 35], [22, 33], [24, 31], 
    [19, 36], [21, 34], [23, 32], [25, 30],
    [18.5, 36.5], [19.5, 35.5], [20.5, 34.5], [21.5, 33.5],
    [22.5, 32.5], [23.5, 31.5], [24.5, 30.5], [25.5, 29.5],
    [19.2, 36.2], [20.2, 35.1], [21.2, 34], [22.2, 33.1]
  ],
  regressionEquation: 'y = -0.84x + 51.87'
};

// Dados de exemplo para tendências
const sampleTrendData: TrendData = {
  parameter: 'Resistência à Compressão',
  unit: 'MPa',
  data: [
    { date: '10/01/2025', value: 32, ensaioId: 'E-2015', project: 'Obra Ferroviária Setúbal' },
    { date: '25/01/2025', value: 33, ensaioId: 'E-2043', project: 'Obra Ferroviária Setúbal' },
    { date: '07/02/2025', value: 31, ensaioId: 'E-2089', project: 'Obra Ferroviária Setúbal' },
    { date: '22/02/2025', value: 34, ensaioId: 'E-2127', project: 'Obra Ferroviária Setúbal' },
    { date: '10/03/2025', value: 32, ensaioId: 'E-2183', project: 'Obra Ferroviária Setúbal' },
    { date: '25/03/2025', value: 31, ensaioId: 'E-2214', project: 'Obra Ferroviária Setúbal' },
    { date: '10/04/2025', value: 33, ensaioId: 'E-2288', project: 'Obra Ferroviária Setúbal' },
    { date: '16/04/2025', value: 32, ensaioId: 'E-2342', project: 'Obra Ferroviária Setúbal' }
  ]
};

// Dados de exemplo para estatísticas
const sampleStatisticalData: StatisticalData = {
  parameter: 'Resistência à Compressão',
  unit: 'MPa',
  count: 35,
  min: 29,
  max: 38,
  mean: 32.4,
  median: 32,
  stdDev: 1.8,
  ucl: 36.0, // Mean + 2*StdDev
  lcl: 28.8  // Mean - 2*StdDev
};

const EnsaiosAnalysis = () => {
  const [activeTab, setActiveTab] = useState<string>('correlation');
  const [selectedXParameter, setSelectedXParameter] = useState<string>('param-5');
  const [selectedYParameter, setSelectedYParameter] = useState<string>('param-1');
  const [correlationData, setCorrelationData] = useState<CorrelationData | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [statisticalData, setStatisticalData] = useState<StatisticalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>('6months');
  const [projectFilter, setProjectFilter] = useState<string[]>([]);
  
  // Projetos disponíveis (normalmente obtidos a partir da API)
  const availableProjects = [
    'Obra Ferroviária Setúbal',
    'Ponte Vasco da Gama - Manutenção',
    'Ampliação Terminal Portuário',
    'Edifício Sede - Lisboa',
    'Barragem Norte'
  ];
  
  // Efeito para carregar dados de correlação quando os parâmetros são alterados
  useEffect(() => {
    if (selectedXParameter && selectedYParameter) {
      loadCorrelationData();
    }
  }, [selectedXParameter, selectedYParameter, timeFrame, projectFilter]);
  
  // Efeito para carregar dados de tendência quando o parâmetro é alterado
  useEffect(() => {
    if (selectedYParameter) {
      loadTrendData();
    }
  }, [selectedYParameter, timeFrame, projectFilter]);
  
  // Efeito para carregar dados estatísticos quando o parâmetro é alterado
  useEffect(() => {
    if (selectedYParameter) {
      loadStatisticalData();
    }
  }, [selectedYParameter, timeFrame, projectFilter]);
  
  // Carregar dados de correlação (simulação)
  const loadCorrelationData = () => {
    setIsLoading(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setCorrelationData(sampleCorrelationData);
      setIsLoading(false);
    }, 1000);
  };
  
  // Carregar dados de tendência (simulação)
  const loadTrendData = () => {
    setIsLoading(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setTrendData(sampleTrendData);
      setIsLoading(false);
    }, 1000);
  };
  
  // Carregar dados estatísticos (simulação)
  const loadStatisticalData = () => {
    setIsLoading(true);
    
    // Simulação de chamada à API
    setTimeout(() => {
      setStatisticalData(sampleStatisticalData);
      setIsLoading(false);
    }, 1000);
  };
  
  // Obter nome do parâmetro por ID
  const getParameterName = (id: string): string => {
    const param = availableParameters.find(p => p.id === id);
    return param ? param.name : 'Desconhecido';
  };
  
  // Obter unidade do parâmetro por ID
  const getParameterUnit = (id: string): string => {
    const param = availableParameters.find(p => p.id === id);
    return param ? param.unit : '';
  };
  
  // Alternar filtro de projeto
  const toggleProjectFilter = (project: string) => {
    setProjectFilter(prev => {
      const newFilter = [...prev];
      const index = newFilter.indexOf(project);
      
      if (index === -1) {
        return [...newFilter, project];
      } else {
        newFilter.splice(index, 1);
        return newFilter;
      }
    });
  };
  
  // Renderizar gráfico de correlação (simulado com div)
  const renderCorrelationChart = () => {
    if (!correlationData) return null;
    
    return (
      <div className="analysis-chart correlation-chart">
        <div className="chart-header">
          <h4>Correlação entre {getParameterName(selectedXParameter)} e {getParameterName(selectedYParameter)}</h4>
          <div className="chart-info">
            <div className="info-item">
              <strong>Coeficiente de Correlação:</strong> 
              <span className={`correlation-value ${
                Math.abs(correlationData.correlationCoefficient) > 0.7 
                  ? 'strong' 
                  : Math.abs(correlationData.correlationCoefficient) > 0.4 
                    ? 'moderate'
                    : 'weak'
              }`}>
                {correlationData.correlationCoefficient.toFixed(2)}
              </span>
            </div>
            {correlationData.regressionEquation && (
              <div className="info-item">
                <strong>Equação de Regressão:</strong> {correlationData.regressionEquation}
              </div>
            )}
          </div>
        </div>
        
        <div className="chart-placeholder">
          <div className="chart-content">
            <div className="chart-axis y-axis">
              <div className="axis-label">{getParameterName(selectedYParameter)} ({getParameterUnit(selectedYParameter)})</div>
            </div>
            <div className="chart-body">
              <div className="scatter-plot">
                {correlationData.dataPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="data-point"
                    style={{
                      left: `${((point[0] - Math.min(...correlationData.dataPoints.map(p => p[0]))) / 
                        (Math.max(...correlationData.dataPoints.map(p => p[0])) - 
                        Math.min(...correlationData.dataPoints.map(p => p[0])))) * 100}%`,
                      bottom: `${((point[1] - Math.min(...correlationData.dataPoints.map(p => p[1]))) / 
                        (Math.max(...correlationData.dataPoints.map(p => p[1])) - 
                        Math.min(...correlationData.dataPoints.map(p => p[1])))) * 100}%`
                    }}
                    title={`${getParameterName(selectedXParameter)}: ${point[0]} ${getParameterUnit(selectedXParameter)}, 
                      ${getParameterName(selectedYParameter)}: ${point[1]} ${getParameterUnit(selectedYParameter)}`}
                  ></div>
                ))}
                <div className="regression-line"></div>
              </div>
            </div>
            <div className="chart-axis x-axis">
              <div className="axis-label">{getParameterName(selectedXParameter)} ({getParameterUnit(selectedXParameter)})</div>
            </div>
          </div>
        </div>
        
        <div className="chart-interpretation">
          <h4>Interpretação</h4>
          {Math.abs(correlationData.correlationCoefficient) > 0.7 ? (
            <p>
              Existe uma <strong>forte correlação {correlationData.correlationCoefficient > 0 ? 'positiva' : 'negativa'}</strong> entre 
              {' '}{getParameterName(selectedXParameter)} e {getParameterName(selectedYParameter)}. 
              {correlationData.correlationCoefficient < 0 
                ? ` Isto significa que quando ${getParameterName(selectedXParameter)} aumenta, ${getParameterName(selectedYParameter)} tende a diminuir.` 
                : ` Isto significa que quando ${getParameterName(selectedXParameter)} aumenta, ${getParameterName(selectedYParameter)} também tende a aumentar.`
              }
            </p>
          ) : Math.abs(correlationData.correlationCoefficient) > 0.4 ? (
            <p>
              Existe uma <strong>correlação moderada {correlationData.correlationCoefficient > 0 ? 'positiva' : 'negativa'}</strong> entre 
              {' '}{getParameterName(selectedXParameter)} e {getParameterName(selectedYParameter)}. 
              Isto sugere alguma relação, mas outros fatores também podem estar a influenciar os resultados.
            </p>
          ) : (
            <p>
              Existe uma <strong>fraca correlação</strong> entre {getParameterName(selectedXParameter)} e {getParameterName(selectedYParameter)}. 
              Isto sugere que não há uma relação significativa entre estes parâmetros.
            </p>
          )}
        </div>
      </div>
    );
  };
  
  // Renderizar gráfico de tendências (simulado com div)
  const renderTrendChart = () => {
    if (!trendData) return null;
    
    return (
      <div className="analysis-chart trend-chart">
        <div className="chart-header">
          <h4>Tendência de {trendData.parameter} ao Longo do Tempo</h4>
          <div className="chart-info">
            <div className="info-item">
              <strong>Total de Ensaios:</strong> {trendData.data.length}
            </div>
            <div className="info-item">
              <strong>Período:</strong> {trendData.data[0].date} a {trendData.data[trendData.data.length-1].date}
            </div>
          </div>
        </div>
        
        <div className="chart-placeholder">
          <div className="chart-content">
            <div className="chart-axis y-axis">
              <div className="axis-label">{trendData.parameter} ({trendData.unit})</div>
            </div>
            <div className="chart-body">
              <div className="line-chart">
                <div className="data-line"></div>
                {trendData.data.map((point, index) => (
                  <div 
                    key={index}
                    className="data-point"
                    style={{
                      left: `${(index / (trendData.data.length - 1)) * 100}%`,
                      bottom: `${((point.value - Math.min(...trendData.data.map(p => p.value))) / 
                        (Math.max(...trendData.data.map(p => p.value)) - 
                        Math.min(...trendData.data.map(p => p.value)))) * 100}%`
                    }}
                    title={`Data: ${point.date}, Valor: ${point.value} ${trendData.unit}, Ensaio: ${point.ensaioId}`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="chart-axis x-axis">
              <div className="axis-label">Data</div>
            </div>
          </div>
        </div>
        
        <div className="chart-interpretation">
          <h4>Análise de Tendência</h4>
          <p>
            Os valores de {trendData.parameter} mantiveram-se relativamente estáveis durante o período analisado,
            com uma média em torno de {
              (trendData.data.reduce((sum, point) => sum + point.value, 0) / trendData.data.length).toFixed(1)
            } {trendData.unit}. 
            Não se observam tendências significativas de aumento ou diminuição ao longo do tempo.
          </p>
        </div>
      </div>
    );
  };
  
  // Renderizar gráfico de controlo estatístico (simulado com div)
  const renderStatisticalChart = () => {
    if (!statisticalData) return null;
    
    return (
      <div className="analysis-chart statistical-chart">
        <div className="chart-header">
          <h4>Análise Estatística de {statisticalData.parameter}</h4>
          <div className="chart-info">
            <div className="info-item">
              <strong>Total de Amostras:</strong> {statisticalData.count}
            </div>
            <div className="info-item">
              <strong>Média:</strong> {statisticalData.mean.toFixed(1)} {statisticalData.unit}
            </div>
            <div className="info-item">
              <strong>Desvio Padrão:</strong> {statisticalData.stdDev.toFixed(1)} {statisticalData.unit}
            </div>
          </div>
        </div>
        
        <div className="statistical-grid">
          <div className="stat-card">
            <div className="stat-value">{statisticalData.min.toFixed(1)}</div>
            <div className="stat-label">Mínimo ({statisticalData.unit})</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statisticalData.max.toFixed(1)}</div>
            <div className="stat-label">Máximo ({statisticalData.unit})</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statisticalData.median.toFixed(1)}</div>
            <div className="stat-label">Mediana ({statisticalData.unit})</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{((statisticalData.stdDev / statisticalData.mean) * 100).toFixed(1)}%</div>
            <div className="stat-label">Coeficiente de Variação</div>
          </div>
        </div>
        
        <div className="chart-placeholder control-chart">
          <div className="chart-content">
            <div className="control-limits">
              <div className="ucl" style={{ top: '20%' }}>
                <span className="limit-label">LSC: {statisticalData.ucl.toFixed(1)}</span>
              </div>
              <div className="center-line" style={{ top: '50%' }}>
                <span className="limit-label">Média: {statisticalData.mean.toFixed(1)}</span>
              </div>
              <div className="lcl" style={{ top: '80%' }}>
                <span className="limit-label">LIC: {statisticalData.lcl.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-interpretation">
          <h4>Interpretação Estatística</h4>
          <p>
            O processo apresenta uma variabilidade de {((statisticalData.stdDev / statisticalData.mean) * 100).toFixed(1)}%, 
            o que é considerado {((statisticalData.stdDev / statisticalData.mean) * 100) < 5 ? 'muito bom' : 
              ((statisticalData.stdDev / statisticalData.mean) * 100) < 10 ? 'bom' : 'aceitável'} 
            para este tipo de ensaio. Os limites de controlo estatístico (LCS e LCI) estão definidos a ±2 desvios padrão da média.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="ensaios-analysis">
      <div className="analysis-header">
        <h2>Análise Avançada de Ensaios</h2>
      </div>
      
      <div className="analysis-options">
        <div className="parameter-selection">
          <div className="form-group">
            <label>Parâmetro X (Variável Independente)</label>
            <select 
              value={selectedXParameter}
              onChange={(e) => setSelectedXParameter(e.target.value)}
            >
              {availableParameters.map(param => (
                <option key={param.id} value={param.id}>
                  {param.name} ({param.unit})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Parâmetro Y (Variável Dependente)</label>
            <select 
              value={selectedYParameter}
              onChange={(e) => setSelectedYParameter(e.target.value)}
            >
              {availableParameters.map(param => (
                <option key={param.id} value={param.id}>
                  {param.name} ({param.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="analysis-filters">
          <div className="form-group">
            <label>Período</label>
            <select 
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="3months">Últimos 3 meses</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="1year">Último ano</option>
              <option value="all">Todo o histórico</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Projetos</label>
            <div className="projects-filter">
              {availableProjects.map(project => (
                <div key={project} className="filter-checkbox">
                  <input 
                    type="checkbox"
                    id={`project-${project}`}
                    checked={projectFilter.includes(project)}
                    onChange={() => toggleProjectFilter(project)}
                  />
                  <label htmlFor={`project-${project}`}>{project}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="analysis-tabs">
        <button 
          className={`tab-btn ${activeTab === 'correlation' ? 'active' : ''}`}
          onClick={() => setActiveTab('correlation')}
        >
          Correlação
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          Tendências
        </button>
        <button 
          className={`tab-btn ${activeTab === 'statistical' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistical')}
        >
          Análise Estatística
        </button>
      </div>
      
      <div className="analysis-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>A processar dados de análise...</p>
          </div>
        ) : (
          <>
            {activeTab === 'correlation' && renderCorrelationChart()}
            {activeTab === 'trend' && renderTrendChart()}
            {activeTab === 'statistical' && renderStatisticalChart()}
          </>
        )}
      </div>
    </div>
  );
};

export default EnsaiosAnalysis;