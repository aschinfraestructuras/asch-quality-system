import React, { useState, useEffect } from 'react';
import '../styles/Relatorios.css';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Registar componentes do ChartJS
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

// Interfaces para tipagem
interface TipoRelatorio {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

interface Projeto {
  id: number;
  nome: string;
}

interface KPICardProps {
  titulo: string;
  valor: number;
  icone: string;
  cor: string;
  unidade?: string;
  descricao?: string;
}

interface DadosSimulados {
  kpis: {
    concluidos: number;
    pendentes: number;
    conformidade: number;
    eficiencia: number;
  };
  evolucaoMensal: {
    labels: string[];
    conformidade: number[];
    naoConformidades: number[];
    auditorias: number[];
  };
  comparativoMensal: {
    labels: string[];
    concluidos: number[];
    planejados: number[];
  };
  distribuicao: {
    labels: string[];
    dados: number[];
  };
}

// Tipos de relatórios disponíveis com ícones atualizados
const tiposRelatorios: TipoRelatorio[] = [
  {
    id: 'resumo',
    nome: 'Resumo Geral',
    descricao: 'Visão geral de todas as atividades e métricas de qualidade',
    icone: 'fas fa-chart-line',
    cor: '#4e73df'
  },
  {
    id: 'checklist',
    nome: 'Relatório de Checklists',
    descricao: 'Dados consolidados sobre checklists e inspeções',
    icone: 'fas fa-tasks',
    cor: '#1cc88a'
  },
  {
    id: 'ensaio',
    nome: 'Relatório de Ensaios',
    descricao: 'Resultados e estatísticas dos ensaios realizados',
    icone: 'fas fa-flask',
    cor: '#36b9cc'
  },
  {
    id: 'nc',
    nome: 'Relatório de Não Conformidades',
    descricao: 'Análise de não conformidades e suas ações corretivas',
    icone: 'fas fa-exclamation-triangle',
    cor: '#f6c23e'
  },
  {
    id: 'material',
    nome: 'Relatório de Materiais',
    descricao: 'Controlo de qualidade de materiais recebidos e utilizados',
    icone: 'fas fa-pallet',
    cor: '#6f42c1'
  },
  {
    id: 'fornecedor',
    nome: 'Avaliação de Fornecedores',
    descricao: 'Análise de desempenho e qualidade dos fornecedores',
    icone: 'fas fa-truck',
    cor: '#fd7e14'
  },
  {
    id: 'auditoria',
    nome: 'Relatório de Auditorias',
    descricao: 'Resultados de auditorias internas e externas',
    icone: 'fas fa-clipboard-check',
    cor: '#20c997'
  },
  {
    id: 'personalizado',
    nome: 'Relatório Personalizado',
    descricao: 'Crie relatórios com os critérios e métricas desejados',
    icone: 'fas fa-sliders-h',
    cor: '#e74a3b'
  }
];

// Projetos para filtro
const projetos: Projeto[] = [
  { id: 1, nome: 'Obra Ferroviária Setúbal' },
  { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
  { id: 3, nome: 'Ampliação Terminal Portuário' },
  { id: 4, nome: 'Todos os Projetos' }
];

// Dados simulados para os gráficos e KPIs
const dadosSimulados: DadosSimulados = {
  kpis: {
    concluidos: 87,
    pendentes: 14,
    conformidade: 94,
    eficiencia: 86
  },
  evolucaoMensal: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    conformidade: [82, 85, 87, 89, 92, 94],
    naoConformidades: [12, 10, 8, 9, 7, 5],
    auditorias: [4, 8, 5, 7, 9, 8]
  },
  comparativoMensal: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    concluidos: [42, 53, 60, 65, 70, 87],
    planejados: [50, 55, 65, 70, 75, 90]
  },
  distribuicao: {
    labels: ['Críticas', 'Graves', 'Moderadas', 'Baixas'],
    dados: [4, 12, 27, 58]
  }
};

// Componente de card KPI
const KPICard: React.FC<KPICardProps> = ({ titulo, valor, icone, cor, unidade = '%', descricao = '' }) => {
  return (
    <div className="kpi-card" style={{ borderLeft: `4px solid ${cor}` }}>
      <div className="kpi-icon" style={{ color: cor }}>
        <i className={icone}></i>
      </div>
      <div className="kpi-content">
        <h4>{titulo}</h4>
        <div className="kpi-valor">
          <span className="valor">{valor}</span>
          <span className="unidade">{unidade}</span>
        </div>
        {descricao && <p className="kpi-descricao">{descricao}</p>}
      </div>
    </div>
  );
};

// Componente principal de Relatórios
const Relatorios: React.FC = () => {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number>(4); // "Todos os Projetos" como padrão
  const [periodoInicio, setPeriodoInicio] = useState<string>('2023-01-01');
  const [periodoFim, setPeriodoFim] = useState<string>('2023-06-30');
  const [formatoExportacao, setFormatoExportacao] = useState<string>('pdf');
  const [abaAtiva, setAbaAtiva] = useState<string>('visaogeral');
  const [modoVisualizacao, setModoVisualizacao] = useState<'card' | 'tabela'>('card');
  const [dadosCarregados, setDadosCarregados] = useState<boolean>(false);

  // Efeito para simular carregamento de dados
  useEffect(() => {
    if (tipoSelecionado) {
      setDadosCarregados(false);
      const timer = setTimeout(() => {
        setDadosCarregados(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [tipoSelecionado, projetoSelecionado, periodoInicio, periodoFim]);

  // Configuração dos dados para o gráfico de linha
  const lineChartData: ChartData<'line'> = {
    labels: dadosSimulados.evolucaoMensal.labels,
    datasets: [
      {
        label: 'Taxa de Conformidade',
        data: dadosSimulados.evolucaoMensal.conformidade,
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Não Conformidades',
        data: dadosSimulados.evolucaoMensal.naoConformidades,
        borderColor: '#e74a3b',
        backgroundColor: 'rgba(231, 74, 59, 0)',
        borderDash: [5, 5],
        tension: 0.3
      }
    ]
  };

  // Configuração dos dados para o gráfico de barras
  const barChartData: ChartData<'bar'> = {
    labels: dadosSimulados.comparativoMensal.labels,
    datasets: [
      {
        label: 'Concluídos',
        data: dadosSimulados.comparativoMensal.concluidos,
        backgroundColor: '#4e73df',
        borderRadius: 4
      },
      {
        label: 'Planeados',
        data: dadosSimulados.comparativoMensal.planejados,
        backgroundColor: '#36b9cc',
        borderRadius: 4
      }
    ]
  };

  // Configuração dos dados para o gráfico de pizza
  const pieChartData: ChartData<'pie'> = {
    labels: dadosSimulados.distribuicao.labels,
    datasets: [
      {
        data: dadosSimulados.distribuicao.dados,
        backgroundColor: ['#e74a3b', '#f6c23e', '#4e73df', '#1cc88a'],
        borderWidth: 1
      }
    ]
  };

  // Opções específicas para cada tipo de gráfico
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    }
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    }
  };

  const pieChartOptions: ChartOptions<'pie'> = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  // Função para gerar o relatório
  const gerarRelatorio = () => {
    if (!tipoSelecionado) {
      alert('Por favor, selecione um tipo de relatório.');
      return;
    }

    // Aqui seria implementada a lógica para gerar o relatório
    const mensagem = `Relatório ${tiposRelatorios.find(t => t.id === tipoSelecionado)?.nome} gerado com sucesso! O download começará em instantes.`;
    alert(mensagem);
  };

  // Componente de loading
  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <div className="spinner">
        <i className="fas fa-circle-notch fa-spin"></i>
      </div>
      <p>A carregar dados...</p>
    </div>
  );

  return (
    <div className="relatorios-container">
      {!tipoSelecionado ? (
        // Tela de seleção de tipo de relatório
        <>
          <div className="page-header">
            <h1>Relatórios</h1>
            <p className="page-description">
              Selecione o tipo de relatório que deseja gerar. Os relatórios fornecem insights e métricas 
              sobre diferentes aspectos do sistema de qualidade.
            </p>
          </div>

          <div className="relatorios-tipos">
            <div className="tipos-grid">
              {tiposRelatorios.map(tipo => (
                <div 
                  key={tipo.id} 
                  className="tipo-card"
                  onClick={() => setTipoSelecionado(tipo.id)}
                  style={{ borderTop: `3px solid ${tipo.cor}` }}
                >
                  <div className="tipo-icon" style={{ color: tipo.cor }}>
                    <i className={tipo.icone}></i>
                  </div>
                  <div className="tipo-info">
                    <h3>{tipo.nome}</h3>
                    <p>{tipo.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Conteúdo do relatório selecionado
        <div className="relatorio-view">
          {/* Cabeçalho do relatório */}
          <div className="relatorio-header" style={{ borderLeft: `4px solid ${tiposRelatorios.find(t => t.id === tipoSelecionado)?.cor}` }}>
            <div className="header-actions">
              <button 
                className="btn-voltar"
                onClick={() => setTipoSelecionado(null)}
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
            
            <div className="header-content">
              <div className="header-icon" style={{ color: tiposRelatorios.find(t => t.id === tipoSelecionado)?.cor }}>
                <i className={tiposRelatorios.find(t => t.id === tipoSelecionado)?.icone}></i>
              </div>
              <div className="header-text">
                <h1>{tiposRelatorios.find(t => t.id === tipoSelecionado)?.nome}</h1>
                <p>{tiposRelatorios.find(t => t.id === tipoSelecionado)?.descricao}</p>
              </div>
            </div>
            
            <div className="header-controls">
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${modoVisualizacao === 'card' ? 'active' : ''}`}
                  onClick={() => setModoVisualizacao('card')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`toggle-btn ${modoVisualizacao === 'tabela' ? 'active' : ''}`}
                  onClick={() => setModoVisualizacao('tabela')}
                >
                  <i className="fas fa-table"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Painel lateral + Conteúdo principal */}
          <div className="relatorio-content">
            {/* Painel lateral com filtros */}
            <div className="relatorio-sidebar">
              <div className="sidebar-section">
                <h3>Filtros</h3>
                
                <div className="form-group">
                  <label htmlFor="projeto">Projeto</label>
                  <select 
                    id="projeto" 
                    value={projetoSelecionado}
                    onChange={e => setProjetoSelecionado(Number(e.target.value))}
                    className="form-control"
                  >
                    {projetos.map(projeto => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="periodoInicio">Período - Início</label>
                  <input 
                    type="date" 
                    id="periodoInicio"
                    value={periodoInicio}
                    onChange={e => setPeriodoInicio(e.target.value)}
                    className="form-control"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="periodoFim">Período - Fim</label>
                  <input 
                    type="date" 
                    id="periodoFim"
                    value={periodoFim}
                    onChange={e => setPeriodoFim(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              {tipoSelecionado === 'personalizado' && (
                <div className="sidebar-section">
                  <h3>Campos Personalizados</h3>
                  
                  <div className="form-group">
                    <label>Selecione os Módulos</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked /> Checklists
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked /> Ensaios
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked /> Não Conformidades
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Materiais
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" /> Fornecedores
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Agrupamento</label>
                    <select className="form-control">
                      <option value="projeto">Por Projeto</option>
                      <option value="data">Por Data</option>
                      <option value="tipo">Por Tipo</option>
                      <option value="responsavel">Por Responsável</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="sidebar-section">
                <h3>Exportar Relatório</h3>
                
                <div className="export-options">
                  <div className={`export-option ${formatoExportacao === 'pdf' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('pdf')}>
                    <i className="far fa-file-pdf"></i>
                    <span>PDF</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'excel' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('excel')}>
                    <i className="far fa-file-excel"></i>
                    <span>Excel</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'word' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('word')}>
                    <i className="far fa-file-word"></i>
                    <span>Word</span>
                  </div>
                  <div className={`export-option ${formatoExportacao === 'csv' ? 'selected' : ''}`} onClick={() => setFormatoExportacao('csv')}>
                    <i className="far fa-file-csv"></i>
                    <span>CSV</span>
                  </div>
                </div>

                <button className="btn-gerar" onClick={gerarRelatorio}>
                  <i className="fas fa-file-download"></i> Gerar Relatório
                </button>
              </div>
            </div>

            {/* Conteúdo principal do relatório */}
            <div className="relatorio-main">
              {/* Tabs de navegação */}
              <div className="relatorio-tabs">
                <button 
                  className={`tab-btn ${abaAtiva === 'visaogeral' ? 'active' : ''}`}
                  onClick={() => setAbaAtiva('visaogeral')}
                >
                  <i className="fas fa-chart-pie"></i> Visão Geral
                </button>
                <button 
                  className={`tab-btn ${abaAtiva === 'tendencias' ? 'active' : ''}`}
                  onClick={() => setAbaAtiva('tendencias')}
                >
                  <i className="fas fa-chart-line"></i> Tendências
                </button>
                <button 
                  className={`tab-btn ${abaAtiva === 'detalhes' ? 'active' : ''}`}
                  onClick={() => setAbaAtiva('detalhes')}
                >
                  <i className="fas fa-table"></i> Detalhes
                </button>
                <button 
                  className={`tab-btn ${abaAtiva === 'recomendacoes' ? 'active' : ''}`}
                  onClick={() => setAbaAtiva('recomendacoes')}
                >
                  <i className="fas fa-lightbulb"></i> Recomendações
                </button>
              </div>

              {/* Conteúdo das abas */}
              <div className="tab-content">
                {!dadosCarregados ? (
                  <LoadingOverlay />
                ) : (
                  <>
                    {/* Aba de Visão Geral */}
                    {abaAtiva === 'visaogeral' && (
                      <div className="tab-pane active">
                        <div className="dashboard-summary">
                          <div className="kpi-row">
                            <KPICard 
                              titulo="Taxa de Conformidade" 
                              valor={dadosSimulados.kpis.conformidade} 
                              icone="fas fa-check-circle" 
                              cor="#1cc88a"
                            />
                            <KPICard 
                              titulo="Eficiência" 
                              valor={dadosSimulados.kpis.eficiencia} 
                              icone="fas fa-tachometer-alt" 
                              cor="#4e73df"
                            />
                            <KPICard 
                              titulo="Itens Concluídos" 
                              valor={dadosSimulados.kpis.concluidos} 
                              icone="fas fa-clipboard-check" 
                              cor="#36b9cc"
                              unidade=""
                            />
                            <KPICard 
                              titulo="Itens Pendentes" 
                              valor={dadosSimulados.kpis.pendentes} 
                              icone="fas fa-clock" 
                              cor="#f6c23e"
                              unidade=""
                            />
                          </div>

                          <div className="charts-row">
                            <div className="chart-container">
                              <div className="chart-header">
                                <h3>Evolução da Conformidade</h3>
                                <div className="chart-actions">
                                  <button className="btn-chart-action">
                                    <i className="fas fa-expand"></i>
                                  </button>
                                  <button className="btn-chart-action">
                                    <i className="fas fa-download"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="chart-body">
                                <Line data={lineChartData} options={lineChartOptions} />
                              </div>
                            </div>

                            <div className="chart-container">
                              <div className="chart-header">
                                <h3>Distribuição por Gravidade</h3>
                                <div className="chart-actions">
                                  <button className="btn-chart-action">
                                    <i className="fas fa-expand"></i>
                                  </button>
                                  <button className="btn-chart-action">
                                    <i className="fas fa-download"></i>
                                  </button>
                                </div>
                              </div>
                              <div className="chart-body">
                                <Pie data={pieChartData} options={pieChartOptions} />
                              </div>
                            </div>
                          </div>

                          <div className="chart-container full-width">
                            <div className="chart-header">
                              <h3>Comparativo Mensal: Planeado vs. Concluído</h3>
                              <div className="chart-actions">
                                <button className="btn-chart-action">
                                  <i className="fas fa-expand"></i>
                                </button>
                                <button className="btn-chart-action">
                                  <i className="fas fa-download"></i>
                                </button>
                              </div>
                            </div>
                            <div className="chart-body">
                              <Bar data={barChartData} options={barChartOptions} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aba de Tendências */}
                    {abaAtiva === 'tendencias' && (
                      <div className="tab-pane active">
                        <div className="section-header">
                          <h2>Análise de Tendências</h2>
                          <p>Análise da evolução dos indicadores ao longo do tempo e previsões de tendência.</p>
                        </div>

                        <div className="chart-container full-width">
                          <div className="chart-header">
                            <h3>Evolução Anual por Trimestre</h3>
                          </div>
                          <div className="chart-body">
                            <Line 
                              data={{
                                labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023'],
                                datasets: [
                                  {
                                    label: 'Taxa de Conformidade',
                                    data: [75, 78, 80, 85, 90, 94],
                                    borderColor: '#4e73df',
                                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                                    tension: 0.3,
                                    fill: true
                                  },
                                  {
                                    label: 'Meta',
                                    data: [80, 80, 85, 85, 90, 90],
                                    borderColor: '#20c997',
                                    borderDash: [5, 5],
                                    borderWidth: 2,
                                    pointRadius: 0,
                                    fill: false
                                  }
                                ]
                              }} 
                              options={lineChartOptions} 
                            />
                          </div>
                        </div>

                        <div className="charts-row">
                          <div className="chart-container">
                            <div className="chart-header">
                              <h3>Índice de Resolução</h3>
                            </div>
                            <div className="chart-body">
                              <Bar 
                                data={{
                                  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                                  datasets: [
                                    {
                                      label: 'Dentro do Prazo',
                                      data: [28, 32, 34, 38, 42, 45],
                                      backgroundColor: '#1cc88a',
                                      borderRadius: 4
                                    },
                                    {
                                      label: 'Fora do Prazo',
                                      data: [12, 10, 8, 7, 5, 3],
                                      backgroundColor: '#e74a3b',
                                      borderRadius: 4
                                    }
                                  ]
                                }} 
                                options={{
                                  ...barChartOptions,
                                  scales: {
                                    x: {
                                      stacked: true
                                    },
                                    y: {
                                      stacked: true
                                    }
                                  }
                                }} 
                              />
                            </div>
                          </div>

                          <div className="chart-container">
                            <div className="chart-header">
                              <h3>Distribuição por Categoria</h3>
                            </div>
                            <div className="chart-body">
                              <Pie 
                                data={{
                                  labels: ['Documentação', 'Processo', 'Equipamento', 'Material', 'Pessoal'],
                                  datasets: [
                                    {
                                      data: [25, 35, 15, 10, 15],
                                      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                                      borderWidth: 1
                                    }
                                  ]
                                }} 
                                options={pieChartOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aba de Detalhes */}
                    {abaAtiva === 'detalhes' && (
                      <div className="tab-pane active">
                        <div className="section-header">
                          <h2>Detalhes e Dados</h2>
                          <p>Visualização detalhada dos registos e dados individuais.</p>
                        </div>

                        <div className="table-container">
                          <div className="table-header">
                            <div className="table-title">
                              <h3><i className="fas fa-table"></i> Registos Detalhados</h3>
                            </div>
                            <div className="table-actions">
                              <div className="search-box">
                                <input type="text" placeholder="Pesquisar..." className="search-input" />
                                <i className="fas fa-search"></i>
                              </div>
                              <div className="table-filters">
                                <button className="btn-filter">
                                  <i className="fas fa-filter"></i> Filtrar
                                </button>
                                <button className="btn-export">
                                  <i className="fas fa-download"></i> Exportar
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="table-responsive">
                            <table className="data-table">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Data</th>
                                  <th>Projeto</th>
                                  <th>Tipo</th>
                                  <th>Descrição</th>
                                  <th>Estado</th>
                                  <th>Responsável</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>NC-2023-001</td>
                                  <td>15/01/2023</td>
                                  <td>Obra Ferroviária</td>
                                  <td>Não Conformidade</td>
                                  <td>Desvio em especificações técnicas</td>
                                  <td><span className="badge resolved">Resolvido</span></td>
                                  <td>António Silva</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>CK-2023-042</td>
                                  <td>22/02/2023</td>
                                  <td>Ponte Vasco da Gama</td>
                                  <td>Checklist</td>
                                  <td>Inspeção de elementos estruturais</td>
                                  <td><span className="badge complete">Completo</span></td>
                                  <td>Maria Gomes</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>EN-2023-018</td>
                                  <td>08/03/2023</td>
                                  <td>Terminal Portuário</td>
                                  <td>Ensaio</td>
                                  <td>Teste de resistência do betão</td>
                                  <td><span className="badge complete">Completo</span></td>
                                  <td>João Ribeiro</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>NC-2023-008</td>
                                  <td>14/04/2023</td>
                                  <td>Obra Ferroviária</td>
                                  <td>Não Conformidade</td>
                                  <td>Atraso na entrega de materiais críticos</td>
                                  <td><span className="badge pending">Pendente</span></td>
                                  <td>Pedro Santos</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>AU-2023-005</td>
                                  <td>05/05/2023</td>
                                  <td>Ponte Vasco da Gama</td>
                                  <td>Auditoria</td>
                                  <td>Auditoria de segurança semestral</td>
                                  <td><span className="badge complete">Completo</span></td>
                                  <td>Ana Sousa</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                                <tr>
                                  <td>MT-2023-029</td>
                                  <td>18/06/2023</td>
                                  <td>Terminal Portuário</td>
                                  <td>Material</td>
                                  <td>Verificação de lote de aço estrutural</td>
                                  <td><span className="badge warning">Atenção</span></td>
                                  <td>Luís Ferreira</td>
                                  <td>
                                    <button className="btn-action"><i className="fas fa-eye"></i></button>
                                    <button className="btn-action"><i className="fas fa-edit"></i></button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="table-footer">
                            <div className="pagination">
                              <button className="page-btn"><i className="fas fa-angle-double-left"></i></button>
                              <button className="page-btn"><i className="fas fa-angle-left"></i></button>
                              <button className="page-btn active">1</button>
                              <button className="page-btn">2</button>
                              <button className="page-btn">3</button>
                              <button className="page-btn"><i className="fas fa-angle-right"></i></button>
                              <button className="page-btn"><i className="fas fa-angle-double-right"></i></button>
                            </div>
                            <div className="page-info">
                              A mostrar 1-6 de 42 registos
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aba de Recomendações */}
                    {abaAtiva === 'recomendacoes' && (
                      <div className="tab-pane active">
                        <div className="section-header">
                          <h2>Análise e Recomendações</h2>
                          <p>Análise inteligente dos dados e recomendações para melhorias.</p>
                        </div>

                        <div className="insight-cards">
                          <div className="insight-card">
                            <div className="insight-icon positive">
                              <i className="fas fa-arrow-up"></i>
                            </div>
                            <div className="insight-content">
                              <h4>Melhoria significativa na taxa de conformidade</h4>
                              <p>Aumento de 12% na taxa de conformidade nos últimos 3 meses, superando a meta estabelecida para o semestre.</p>
                              <div className="insight-metrics">
                                <span className="metric positive">+12%</span>
                                <span className="period">3 meses</span>
                              </div>
                            </div>
                          </div>

                          <div className="insight-card">
                            <div className="insight-icon warning">
                              <i className="fas fa-exclamation"></i>
                            </div>
                            <div className="insight-content">
                              <h4>Área de melhoria: Documentação</h4>
                              <p>A categoria "Documentação" representa 25% das não conformidades. Recomenda-se revisar os processos de controlo documental.</p>
                              <div className="insight-metrics">
                                <span className="metric warning">25%</span>
                                <span className="period">de NC's</span>
                              </div>
                            </div>
                          </div>

                          <div className="insight-card">
                            <div className="insight-icon negative">
                              <i className="fas fa-arrow-down"></i>
                            </div>
                            <div className="insight-content">
                              <h4>Redução de não conformidades críticas</h4>
                              <p>Redução de 60% nas não conformidades classificadas como críticas, comparado ao mesmo período do ano anterior.</p>
                              <div className="insight-metrics">
                                <span className="metric positive">-60%</span>
                                <span className="period">anual</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="recommendation-section">
                          <h3><i className="fas fa-lightbulb"></i> Recomendações para Melhorias</h3>
                          
                          <div className="recommendations-list">
                            <div className="recommendation-item">
                              <div className="recommendation-priority high"></div>
                              <div className="recommendation-content">
                                <h4>Implementar verificação digital em auditorias internas</h4>
                                <p>Adotar um sistema digital para verificações em campo durante auditorias internas reduziria o tempo de processamento em aproximadamente 40% e diminuiria erros de transcrição.</p>
                                <div className="recommendation-tags">
                                  <span className="tag">Auditorias</span>
                                  <span className="tag">Digitalização</span>
                                  <span className="tag">Eficiência</span>
                                </div>
                              </div>
                            </div>

                            <div className="recommendation-item">
                              <div className="recommendation-priority medium"></div>
                              <div className="recommendation-content">
                                <h4>Revisão dos critérios de aceitação de materiais</h4>
                                <p>Os dados indicam que os critérios atuais para aceitação de materiais estruturais podem ser refinados para reduzir a taxa de 10% de rejeições após inspeção detalhada.</p>
                                <div className="recommendation-tags">
                                  <span className="tag">Materiais</span>
                                  <span className="tag">Critérios</span>
                                  <span className="tag">Qualidade</span>
                                </div>
                              </div>
                            </div>

                            <div className="recommendation-item">
                              <div className="recommendation-priority low"></div>
                              <div className="recommendation-content">
                                <h4>Programa de formação adicional para equipas de campo</h4>
                                <p>A análise dos dados sugere que um programa de formação adicional focado em técnicas específicas de verificação poderia melhorar a deteção precoce de problemas.</p>
                                <div className="recommendation-tags">
                                  <span className="tag">Formação</span>
                                  <span className="tag">Pessoal</span>
                                  <span className="tag">Prevenção</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;