import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Filter, 
  Download, 
  PieChart, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  X, 
  Eye, 
  Edit, 
  BarChart2,
  Plus,
  Calendar,
  User,
  Building,
  FileText,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Sliders,
  Check,
  RefreshCw,
  List,
  Grid
} from 'lucide-react';
import '../styles/NaoConformidades.css';
// Interface para os dados das não conformidades
interface NaoConformidadeItem {
  id: string;
  titulo: string;
  projeto: string;
  data: string;
  gravidade: string;
  estado: string;
  responsavel: string;
  prazo: string;
  descricao?: string;
  diasRestantes?: number;
}

// Interface para os filtros
interface FiltrosState {
  texto: string;
  estado: string;
  gravidade: string;
  projeto: string;
  responsavel: string;
  prazoInicio: string;
  prazoFim: string;
  filtroPrazoProximo: boolean;
}

// Dados de exemplo para simulação
const dadosExemplo: NaoConformidadeItem[] = [
  {
    id: 'NC001',
    titulo: 'Desvio na espessura do betão',
    projeto: 'Obra Ferroviária Setúbal',
    data: '15/04/2025',
    gravidade: 'Alta',
    estado: 'Aberta',
    responsavel: 'João Silva',
    prazo: '30/04/2025',
    descricao: 'Foi detectada uma variação na espessura do betão que está fora das tolerâncias permitidas...',
    diasRestantes: 10
  },
  {
    id: 'NC002',
    titulo: 'Falta de documentação em ensaio',
    projeto: 'Ponte Vasco da Gama - Manutenção',
    data: '14/04/2025',
    gravidade: 'Média',
    estado: 'Em tratamento',
    responsavel: 'Ana Costa',
    prazo: '28/04/2025',
    descricao: 'Documentação obrigatória não foi preenchida durante o procedimento de ensaio...',
    diasRestantes: 8
  },
  {
    id: 'NC003',
    titulo: 'Não conformidade em material recebido',
    projeto: 'Ampliação Terminal Portuário',
    data: '12/04/2025',
    gravidade: 'Baixa',
    estado: 'Resolvida',
    responsavel: 'Manuel Gomes',
    prazo: '20/04/2025',
    descricao: 'Material recebido não corresponde às especificações solicitadas...',
    diasRestantes: 0
  },
  {
    id: 'NC004',
    titulo: 'Falha em procedimento de segurança',
    projeto: 'Obra Ferroviária Setúbal',
    data: '10/04/2025',
    gravidade: 'Alta',
    estado: 'Em tratamento',
    responsavel: 'Sofia Martins',
    prazo: '25/04/2025',
    descricao: 'Não foram seguidos os procedimentos de segurança durante a operação de equipamento...',
    diasRestantes: 5
  },
  {
    id: 'NC005',
    titulo: 'Desvio de cronograma em fase crítica',
    projeto: 'Ponte Vasco da Gama - Manutenção',
    data: '08/04/2025',
    gravidade: 'Média',
    estado: 'Verificação',
    responsavel: 'Carlos Oliveira',
    prazo: '22/04/2025',
    descricao: 'Atraso significativo detectado na fase de montagem estrutural...',
    diasRestantes: 2
  },
  {
    id: 'NC006',
    titulo: 'Erro de medição em estacas',
    projeto: 'Ampliação Terminal Portuário',
    data: '05/04/2025',
    gravidade: 'Alta',
    estado: 'Aberta',
    responsavel: 'João Silva',
    prazo: '18/04/2025',
    descricao: 'Detectados erros nas medições de profundidade das estacas...',
    diasRestantes: -2
  },
  {
    id: 'NC007',
    titulo: 'Amostra com irregularidades',
    projeto: 'Obra Ferroviária Setúbal',
    data: '03/04/2025',
    gravidade: 'Baixa',
    estado: 'Resolvida',
    responsavel: 'Ana Costa',
    prazo: '15/04/2025',
    descricao: 'Amostra de material apresentando irregularidades na composição...',
    diasRestantes: -5
  }
];

// Opções para selects
const estadosDisponiveis = ['Aberta', 'Em tratamento', 'Verificação', 'Resolvida'];
const gravidadesDisponiveis = ['Alta', 'Média', 'Baixa'];
const projetosDisponiveis = ['Obra Ferroviária Setúbal', 'Ponte Vasco da Gama - Manutenção', 'Ampliação Terminal Portuário', 'Reabilitação Urbana Baixa', 'Metro de Lisboa - Expansão'];
const responsaveisDisponiveis = ['João Silva', 'Ana Costa', 'Manuel Gomes', 'Sofia Martins', 'Carlos Oliveira'];

const NaoConformidadesList: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para controle da interface
  const [filtros, setFiltros] = useState<FiltrosState>({
    texto: '',
    estado: '',
    gravidade: '',
    projeto: '',
    responsavel: '',
    prazoInicio: '',
    prazoFim: '',
    filtroPrazoProximo: false
  });
  
  const [painelFiltrosColapsado, setPainelFiltrosColapsado] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'tabela' | 'cards'>('tabela');
  const [sortConfig, setSortConfig] = useState<{ key: keyof NaoConformidadeItem; direction: 'asc' | 'desc' }>({
    key: 'id',
    direction: 'asc'
  });
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);
  const [estatisticaAtiva, setEstatisticaAtiva] = useState<'estado' | 'gravidade' | 'projeto'>('estado');
  const [filtrosAtivos, setFiltrosAtivos] = useState(0);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Atualizar contagem de filtros ativos
  useEffect(() => {
    let count = 0;
    if (filtros.texto) count++;
    if (filtros.estado) count++;
    if (filtros.gravidade) count++;
    if (filtros.projeto) count++;
    if (filtros.responsavel) count++;
    if (filtros.prazoInicio || filtros.prazoFim) count++;
    if (filtros.filtroPrazoProximo) count++;
    setFiltrosAtivos(count);
  }, [filtros]);

  // Função para atualizar filtros
  const atualizarFiltro = (campo: keyof FiltrosState, valor: string | boolean) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
    setPaginaAtual(1);
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      texto: '',
      estado: '',
      gravidade: '',
      projeto: '',
      responsavel: '',
      prazoInicio: '',
      prazoFim: '',
      filtroPrazoProximo: false
    });
    setPaginaAtual(1);
  };

  // Função para alternar painel de filtros
  const alternarPainelFiltros = () => {
    setPainelFiltrosColapsado(!painelFiltrosColapsado);
  };

  // Função para alterar ordenação
  const alterarOrdenacao = (coluna: keyof NaoConformidadeItem) => {
    setSortConfig(prev => ({
      key: coluna,
      direction: prev.key === coluna && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Funções para exportar CSV
  const exportarCSV = () => {
    console.log("Exportando para CSV...");
    // Implementação da exportação para CSV
  };

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const stats = {
      total: dadosExemplo.length,
      porEstado: {} as Record<string, number>,
      porGravidade: {} as Record<string, number>,
      porProjeto: {} as Record<string, number>,
      proximasDoPrazo: 0,
      emAtraso: 0
    };

    dadosExemplo.forEach(nc => {
      // Contagem por estado
      stats.porEstado[nc.estado] = (stats.porEstado[nc.estado] || 0) + 1;
      
      // Contagem por gravidade
      stats.porGravidade[nc.gravidade] = (stats.porGravidade[nc.gravidade] || 0) + 1;
      
      // Contagem por projeto
      stats.porProjeto[nc.projeto] = (stats.porProjeto[nc.projeto] || 0) + 1;
      
      // Contagem de NCs próximas do prazo (5 dias ou menos)
      if (nc.diasRestantes !== undefined && nc.diasRestantes >= 0 && nc.diasRestantes <= 5 && nc.estado !== 'Resolvida') {
        stats.proximasDoPrazo++;
      }
      
      // Contagem de NCs em atraso
      if (nc.diasRestantes !== undefined && nc.diasRestantes < 0 && nc.estado !== 'Resolvida') {
        stats.emAtraso++;
      }
    });

    return stats;
  }, [dadosExemplo]);

  // Filtrar dados
  const dadosFiltrados = useMemo(() => {
    return dadosExemplo.filter(nc => {
      // Filtro por texto
      const matchTexto = filtros.texto === '' || 
        nc.id.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.titulo.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.projeto.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.responsavel.toLowerCase().includes(filtros.texto.toLowerCase());
      
      // Filtros específicos
      const matchEstado = filtros.estado === '' || nc.estado === filtros.estado;
      const matchGravidade = filtros.gravidade === '' || nc.gravidade === filtros.gravidade;
      const matchProjeto = filtros.projeto === '' || nc.projeto === filtros.projeto;
      const matchResponsavel = filtros.responsavel === '' || nc.responsavel === filtros.responsavel;
      
      // Filtros de prazo
      let matchPrazo = true;
      if (filtros.prazoInicio || filtros.prazoFim) {
        const dataPrazo = new Date(nc.prazo.split('/').reverse().join('-'));
        
        if (filtros.prazoInicio) {
          const dataInicio = new Date(filtros.prazoInicio);
          matchPrazo = matchPrazo && dataPrazo >= dataInicio;
        }
        
        if (filtros.prazoFim) {
          const dataFim = new Date(filtros.prazoFim);
          matchPrazo = matchPrazo && dataPrazo <= dataFim;
        }
      }
      
      // Filtro de prazo próximo
      let matchPrazoProximo = true;
      if (filtros.filtroPrazoProximo) {
        matchPrazoProximo = nc.diasRestantes !== undefined && 
                           nc.diasRestantes >= 0 && 
                           nc.diasRestantes <= 5 && 
                           nc.estado !== 'Resolvida';
      }
      
      return matchTexto && matchEstado && matchGravidade && matchProjeto && 
             matchResponsavel && matchPrazo && matchPrazoProximo;
    });
  }, [dadosExemplo, filtros]);

 // Ordenar dados
const dadosOrdenados = useMemo(() => {
  let sortableItems = [...dadosFiltrados];
  
  sortableItems.sort((a, b) => {
    let valorA = a[sortConfig.key];
    let valorB = b[sortConfig.key];
    
    // Tratamento especial para datas
    if (sortConfig.key === 'data' || sortConfig.key === 'prazo') {
      // Converter para string explicitamente antes de usar split()
      const strValorA = String(valorA);
      const strValorB = String(valorB);
      
      const dataA = new Date(strValorA.split('/').reverse().join('-'));
      const dataB = new Date(strValorB.split('/').reverse().join('-'));
      
      return sortConfig.direction === 'asc' 
        ? dataA.getTime() - dataB.getTime() 
        : dataB.getTime() - dataA.getTime();
    }
    
    // Ordenação para outros tipos
    if (String(valorA) < String(valorB)) return sortConfig.direction === 'asc' ? -1 : 1;
    if (String(valorA) > String(valorB)) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sortableItems;
}, [dadosFiltrados, sortConfig]);

  // Paginar dados
  const dadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itemsPorPagina;
    const fim = inicio + itemsPorPagina;
    return dadosOrdenados.slice(inicio, fim);
  }, [dadosOrdenados, paginaAtual, itemsPorPagina]);

  // Calcular total de páginas
  const totalPaginas = Math.ceil(dadosOrdenados.length / itemsPorPagina);

  // Função para navegação entre páginas
  const irParaPagina = (pagina: number) => {
    setPaginaAtual(Math.max(1, Math.min(pagina, totalPaginas)));
  };

  // Função para renderizar ícone de ordenação
  const renderIconeOrdenacao = (coluna: keyof NaoConformidadeItem) => {
    if (sortConfig.key !== coluna) {
      return <ChevronDown size={14} className="nc-sort-icon" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="nc-sort-icon active" /> 
      : <ChevronDown size={14} className="nc-sort-icon active" />;
  };

  // Renderizar painel de filtros
  const renderPainelFiltros = () => {
    if (painelFiltrosColapsado) {
      return (
        <div className="nc-filtros-colapsados">
          <button 
            className="nc-btn nc-btn-icon nc-btn-expand-filtros" 
            onClick={alternarPainelFiltros}
            title="Expandir filtros"
          >
            <Filter size={18} />
            {filtrosAtivos > 0 && (
              <span className="nc-filtros-badge">{filtrosAtivos}</span>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="nc-filtros-panel">
        <div className="nc-filtros-header">
          <h3>Filtros</h3>
          <div className="nc-filtros-actions">
            <button 
              className="nc-btn nc-btn-text nc-btn-limpar" 
              onClick={limparFiltros}
              disabled={filtrosAtivos === 0}
            >
              Limpar
            </button>
            <button 
              className="nc-btn nc-btn-icon" 
              onClick={alternarPainelFiltros}
              title="Colapsar filtros"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
        
        <div className="nc-filtros-body">
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Pesquisa</div>
            <div className="nc-filtro-campo nc-search-field">
              <Search size={16} className="nc-search-icon" />
              <input
                type="text"
                placeholder="Pesquisar por ID, título..."
                value={filtros.texto}
                onChange={e => atualizarFiltro('texto', e.target.value)}
                className="nc-input"
              />
              {filtros.texto && (
                <button 
                  className="nc-btn nc-btn-icon nc-btn-clear-input" 
                  onClick={() => atualizarFiltro('texto', '')}
                  title="Limpar pesquisa"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Estado</div>
            <select 
              value={filtros.estado} 
              onChange={e => atualizarFiltro('estado', e.target.value)}
              className="nc-select"
            >
              <option value="">Todos os estados</option>
              {estadosDisponiveis.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Gravidade</div>
            <select 
              value={filtros.gravidade} 
              onChange={e => atualizarFiltro('gravidade', e.target.value)}
              className="nc-select"
            >
              <option value="">Todas as gravidades</option>
              {gravidadesDisponiveis.map(gravidade => (
                <option key={gravidade} value={gravidade}>{gravidade}</option>
              ))}
            </select>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Projeto</div>
            <select 
              value={filtros.projeto} 
              onChange={e => atualizarFiltro('projeto', e.target.value)}
              className="nc-select"
            >
              <option value="">Todos os projetos</option>
              {projetosDisponiveis.map(projeto => (
                <option key={projeto} value={projeto}>{projeto}</option>
              ))}
            </select>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Responsável</div>
            <select 
              value={filtros.responsavel} 
              onChange={e => atualizarFiltro('responsavel', e.target.value)}
              className="nc-select"
            >
              <option value="">Todos os responsáveis</option>
              {responsaveisDisponiveis.map(responsavel => (
                <option key={responsavel} value={responsavel}>{responsavel}</option>
              ))}
            </select>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-label">Período de Prazo</div>
            <div className="nc-filtro-data-range">
              <div className="nc-filtro-data">
                <div className="nc-filtro-data-label">De:</div>
                <input 
                  type="date" 
                  value={filtros.prazoInicio} 
                  onChange={e => atualizarFiltro('prazoInicio', e.target.value)}
                  className="nc-input nc-input-date"
                />
              </div>
              <div className="nc-filtro-data">
                <div className="nc-filtro-data-label">Até:</div>
                <input 
                  type="date" 
                  value={filtros.prazoFim} 
                  onChange={e => atualizarFiltro('prazoFim', e.target.value)}
                  className="nc-input nc-input-date"
                />
              </div>
            </div>
          </div>
          
          <div className="nc-filtro-grupo">
            <div className="nc-filtro-checkbox">
              <input 
                type="checkbox" 
                id="filtroPrazoProximo" 
                checked={filtros.filtroPrazoProximo} 
                onChange={e => atualizarFiltro('filtroPrazoProximo', e.target.checked)}
                className="nc-checkbox"
              />
              <label htmlFor="filtroPrazoProximo" className="nc-checkbox-label">
                Apenas não conformidades próximas do prazo
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar a seção de estatísticas
  const renderEstatisticasSummary = () => {
    if (!mostrarEstatisticas) return null;

    return (
      <div className="nc-stats-section">
        <div className="nc-stats-controls">
          <div className="nc-stats-tabs">
            <button 
              className={`nc-stats-tab ${estatisticaAtiva === 'estado' ? 'active' : ''}`}
              onClick={() => setEstatisticaAtiva('estado')}
            >
              Por Estado
            </button>
            <button 
              className={`nc-stats-tab ${estatisticaAtiva === 'gravidade' ? 'active' : ''}`}
              onClick={() => setEstatisticaAtiva('gravidade')}
            >
              Por Gravidade
            </button>
            <button 
              className={`nc-stats-tab ${estatisticaAtiva === 'projeto' ? 'active' : ''}`}
              onClick={() => setEstatisticaAtiva('projeto')}
            >
              Por Projeto
            </button>
          </div>
          <button 
            className="nc-btn nc-btn-icon" 
            onClick={() => setMostrarEstatisticas(false)}
            title="Fechar estatísticas"
          >
            <X size={18} />
          </button>
        </div>

        <div className="nc-stats-cards-container">
          <div className="nc-stats-summary-cards">
            <div className="nc-stats-card nc-stats-total">
              <div>
                <div className="nc-stats-number">{estatisticas.total}</div>
                <div className="nc-stats-label">Total de Não Conformidades</div>
              </div>
              <FileText size={32} className="nc-stats-icon" />
            </div>
            
            <div className="nc-stats-card nc-stats-warning">
              <div>
                <div className="nc-stats-number">{estatisticas.proximasDoPrazo}</div>
                <div className="nc-stats-label">Próximas do Prazo</div>
              </div>
              <Clock size={32} className="nc-stats-icon" />
            </div>
            
            <div className="nc-stats-card nc-stats-danger">
              <div>
                <div className="nc-stats-number">{estatisticas.emAtraso}</div>
                <div className="nc-stats-label">Em Atraso</div>
              </div>
              <AlertTriangle size={32} className="nc-stats-icon" />
            </div>
          </div>

          <div className="nc-stats-chart">
            {estatisticaAtiva === 'estado' && (
              <div className="nc-stats-progress">
                {estadosDisponiveis.map(estado => {
                  const valor = estatisticas.porEstado[estado] || 0;
                  const porcentagem = estatisticas.total > 0 
                    ? Math.round((valor / estatisticas.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={estado} className="nc-progress-item">
                      <div className="nc-progress-info">
                        <span className={`nc-dot estado-${estado.toLowerCase().replace(/\s+/g, '-')}`}></span>
                        <span className="nc-progress-label">{estado}</span>
                        <span className="nc-progress-value">{valor} ({porcentagem}%)</span>
                      </div>
                      <div className="nc-progress-bar">
                        <div 
                          className={`nc-progress-fill estado-${estado.toLowerCase().replace(/\s+/g, '-')}`} 
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {estatisticaAtiva === 'gravidade' && (
              <div className="nc-stats-progress">
                {gravidadesDisponiveis.map(gravidade => {
                  const valor = estatisticas.porGravidade[gravidade] || 0;
                  const porcentagem = estatisticas.total > 0 
                    ? Math.round((valor / estatisticas.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={gravidade} className="nc-progress-item">
                      <div className="nc-progress-info">
                        <span className={`nc-dot gravidade-${gravidade.toLowerCase()}`}></span>
                        <span className="nc-progress-label">{gravidade}</span>
                        <span className="nc-progress-value">{valor} ({porcentagem}%)</span>
                      </div>
                      <div className="nc-progress-bar">
                        <div 
                          className={`nc-progress-fill gravidade-${gravidade.toLowerCase()}`} 
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {estatisticaAtiva === 'projeto' && (
              <div className="nc-stats-progress nc-stats-progress-projetos">
                {Object.keys(estatisticas.porProjeto).map(projeto => {
                  const valor = estatisticas.porProjeto[projeto] || 0;
                  const porcentagem = estatisticas.total > 0 
                    ? Math.round((valor / estatisticas.total) * 100) 
                    : 0;
                  
                  return (
                    <div key={projeto} className="nc-progress-item">
                      <div className="nc-progress-info">
                        <span className="nc-dot nc-dot-projeto"></span>
                        <span className="nc-progress-label">{projeto}</span>
                        <span className="nc-progress-value">{valor} ({porcentagem}%)</span>
                      </div>
                      <div className="nc-progress-bar">
                        <div 
                          className="nc-progress-fill nc-progress-fill-projeto" 
                          style={{ width: `${porcentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Função para renderizar o cabeçalho da tabela
  const renderCabecalhoTabela = () => (
    <thead>
      <tr>
        <th onClick={() => alterarOrdenacao('id')} className="sortable">
          <div className="nc-th-content">
            <span>ID</span>
            {renderIconeOrdenacao('id')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('titulo')} className="sortable">
          <div className="nc-th-content">
            <span>Título</span>
            {renderIconeOrdenacao('titulo')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('projeto')} className="sortable">
          <div className="nc-th-content">
            <span>Projeto</span>
            {renderIconeOrdenacao('projeto')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('data')} className="sortable">
          <div className="nc-th-content">
            <span>Data</span>
            {renderIconeOrdenacao('data')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('gravidade')} className="sortable">
          <div className="nc-th-content">
            <span>Gravidade</span>
            {renderIconeOrdenacao('gravidade')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('estado')} className="sortable">
          <div className="nc-th-content">
            <span>Estado</span>
            {renderIconeOrdenacao('estado')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('responsavel')} className="sortable">
          <div className="nc-th-content">
            <span>Responsável</span>
            {renderIconeOrdenacao('responsavel')}
          </div>
        </th>
        <th onClick={() => alterarOrdenacao('prazo')} className="sortable">
          <div className="nc-th-content">
            <span>Prazo</span>
            {renderIconeOrdenacao('prazo')}
          </div>
        </th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  // Renderizar corpo da tabela
  const renderCorpoTabela = () => (
    <tbody>
      {dadosPaginados.map(nc => (
        <tr key={nc.id} className={`nc-row gravidade-${nc.gravidade.toLowerCase()}-border`}>
          <td>{nc.id}</td>
          <td className="nc-title" title={nc.titulo}>{nc.titulo}</td>
          <td>{nc.projeto}</td>
          <td>{nc.data}</td>
          <td>
            <span className={`nc-badge gravidade-${nc.gravidade.toLowerCase()}`}>
              {nc.gravidade}
            </span>
          </td>
          <td>
            <span className={`nc-badge estado-${nc.estado.toLowerCase().replace(/\s+/g, '-')}`}>
              {nc.estado}
            </span>
          </td>
          <td>{nc.responsavel}</td>
          <td className={nc.diasRestantes !== undefined && nc.diasRestantes <= 5 && nc.estado !== 'Resolvida' ? 'prazo-alerta' : ''}>
            <div className="nc-prazo-container">
              <span>{nc.prazo}</span>
              {nc.diasRestantes !== undefined && nc.diasRestantes <= 5 && nc.estado !== 'Resolvida' && (
                <span className={`nc-prazo-badge ${nc.diasRestantes < 0 ? 'atrasado' : 'proximidade'}`}>
                  <Clock size={12} />
                  <span>{nc.diasRestantes < 0 
                    ? `${Math.abs(nc.diasRestantes)}d atrasado` 
                    : `${nc.diasRestantes}d restantes`}</span>
                </span>
              )}
            </div>
          </td>
          <td>
            <div className="nc-actions">
              <button 
                className="nc-btn-action nc-view" 
                onClick={() => navigate(`/nao-conformidades/${nc.id}`)}
                title="Ver detalhes"
              >
                <Eye size={16} />
              </button>
              <button 
                className="nc-btn-action nc-edit" 
                onClick={() => navigate(`/nao-conformidades/${nc.id}/editar`)}
                title="Editar"
              >
                <Edit size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  // Renderizar a tabela
  const renderTabela = () => {
    if (carregando) {
      return (
        <div className="nc-loading">
          <div className="nc-spinner"></div>
          <p>A carregar dados...</p>
        </div>
      );
    }

    if (dadosFiltrados.length === 0) {
      return (
        <div className="nc-empty-state">
          <AlertTriangle size={48} />
          <h3>Sem resultados</h3>
          <p>Não foram encontradas não conformidades com os filtros aplicados.</p>
          <button onClick={limparFiltros} className="nc-btn nc-btn-secundario">
            Limpar filtros
          </button>
        </div>
      );
    }

    return (
      <div className="nc-table-responsive">
        <table className="nc-table">
          {renderCabecalhoTabela()}
          {renderCorpoTabela()}
        </table>
      </div>
    );
  };

  // Renderizar a visualização de cards
  const renderCards = () => {
    if (carregando) {
      return (
        <div className="nc-loading">
          <div className="nc-spinner"></div>
          <p>A carregar dados...</p>
        </div>
      );
    }

    if (dadosFiltrados.length === 0) {
      return (
        <div className="nc-empty-state">
          <AlertTriangle size={48} />
          <h3>Sem resultados</h3>
          <p>Não foram encontradas não conformidades com os filtros aplicados.</p>
          <button onClick={limparFiltros} className="nc-btn nc-btn-secundario">
            Limpar filtros
          </button>
        </div>
      );
    }

    return (
      <div className="nc-cards-grid">
        {dadosPaginados.map(nc => (
          <div key={nc.id} className={`nc-card gravidade-${nc.gravidade.toLowerCase()}-border`}>
            <div className="nc-card-header">
              <div className="nc-card-id">{nc.id}</div>
              <span className={`nc-badge gravidade-${nc.gravidade.toLowerCase()}`}>
                {nc.gravidade}
              </span>
            </div>
            
            <h3 className="nc-card-title" title={nc.titulo}>{nc.titulo}</h3>
            
            <div className="nc-card-content">
              <div className="nc-card-info">
                <div className="nc-info-item">
                  <Building size={16} />
                  <span>{nc.projeto}</span>
                </div>
                
                <div className="nc-info-item">
                  <Calendar size={16} />
                  <span>{nc.data}</span>
                </div>
                
                <div className="nc-info-item">
                  <User size={16} />
                  <span>{nc.responsavel}</span>
                </div>
                
                <div className="nc-info-estado">
                  <span className={`nc-badge estado-${nc.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                    {nc.estado}
                  </span>
                </div>
                
                <div className="nc-info-prazo">
                  <div className="nc-prazo-label">
                    <Clock size={16} />
                    <span>Prazo: {nc.prazo}</span>
                  </div>
                  
                  {nc.diasRestantes !== undefined && nc.diasRestantes <= 5 && nc.estado !== 'Resolvida' && (
                    <div className={`nc-prazo-badge ${nc.diasRestantes < 0 ? 'atrasado' : 'proximidade'}`}>
                      {nc.diasRestantes < 0 
                        ? `${Math.abs(nc.diasRestantes)}d atrasado` 
                        : `${nc.diasRestantes}d restantes`}
                    </div>
                  )}
                </div>
              </div>
              
              {nc.descricao && (
                <div className="nc-card-descricao">
                  <p>{nc.descricao.length > 120 ? `${nc.descricao.substring(0, 120)}...` : nc.descricao}</p>
                </div>
              )}
            </div>
            
            <div className="nc-card-actions">
              <button 
                className="nc-btn nc-btn-small nc-btn-ver" 
                onClick={() => navigate(`/nao-conformidades/${nc.id}`)}
              >
                <Eye size={14} />
                <span>Ver detalhes</span>
              </button>
              <button 
                className="nc-btn nc-btn-small nc-btn-editar" 
                onClick={() => navigate(`/nao-conformidades/${nc.id}/editar`)}
              >
                <Edit size={14} />
                <span>Editar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar paginação
  const renderPaginacao = () => {
    if (dadosFiltrados.length === 0) return null;

    return (
      <div className="nc-pagination">
        <div className="nc-pagination-info">
          Mostrando {(paginaAtual - 1) * itemsPorPagina + 1} a {Math.min(paginaAtual * itemsPorPagina, dadosFiltrados.length)} de {dadosFiltrados.length} não conformidades
        </div>
        
        <div className="nc-pagination-controls">
          <select 
            value={itemsPorPagina} 
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value));
              setPaginaAtual(1);
            }}
            className="nc-select nc-select-paginas"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          
          <div className="nc-pagination-buttons">
            <button 
              onClick={() => irParaPagina(1)} 
              disabled={paginaAtual === 1}
              className="nc-pagination-btn"
            >
              &laquo;
            </button>
            <button 
              onClick={() => irParaPagina(paginaAtual - 1)} 
              disabled={paginaAtual === 1}
              className="nc-pagination-btn"
            >
              &lt;
            </button>
            
            {/* Botões de páginas */}
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              let pageNum;
              
              // Lógica para mostrar páginas em torno da página atual
              if (totalPaginas <= 5) {
                pageNum = i + 1;
              } else if (paginaAtual <= 3) {
                pageNum = i + 1;
              } else if (paginaAtual >= totalPaginas - 2) {
                pageNum = totalPaginas - 4 + i;
              } else {
                pageNum = paginaAtual - 2 + i;
              }
              
              return (
                <button 
                  key={i}
                  onClick={() => irParaPagina(pageNum)} 
                  className={`nc-pagination-btn ${pageNum === paginaAtual ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              onClick={() => irParaPagina(paginaAtual + 1)} 
              disabled={paginaAtual === totalPaginas}
              className="nc-pagination-btn"
            >
              &gt;
            </button>
            <button 
              onClick={() => irParaPagina(totalPaginas)} 
              disabled={paginaAtual === totalPaginas}
              className="nc-pagination-btn"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar o componente principal
  return (
    <div className="nc-container">
      <div className="nc-header">
        <h1>Não Conformidades</h1>
        <div className="nc-header-actions">
          <button 
            className="nc-btn nc-btn-icon" 
            onClick={() => setMostrarEstatisticas(!mostrarEstatisticas)}
            title={mostrarEstatisticas ? "Ocultar estatísticas" : "Mostrar estatísticas"}
          >
            <BarChart2 size={18} />
          </button>
          
          <div className="nc-view-toggles">
            <button 
              className={`nc-btn nc-btn-icon ${modoVisualizacao === 'tabela' ? 'active' : ''}`} 
              onClick={() => setModoVisualizacao('tabela')}
              title="Vista de tabela"
            >
              <List size={18} />
            </button>
            <button 
              className={`nc-btn nc-btn-icon ${modoVisualizacao === 'cards' ? 'active' : ''}`} 
              onClick={() => setModoVisualizacao('cards')}
              title="Vista de cartões"
            >
              <Grid size={18} />
            </button>
          </div>
          
          <button className="nc-btn nc-btn-secundario" onClick={exportarCSV}>
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
          
          <Link to="/nao-conformidades/nova" className="nc-btn nc-btn-primario">
            <Plus size={16} />
            <span>Nova Não Conformidade</span>
          </Link>
        </div>
      </div>

      {/* Renderizar estatísticas se estiverem visíveis */}
      {mostrarEstatisticas && renderEstatisticasSummary()}
      
      <div className="nc-content">
        {/* Painel de filtros lateral */}
        <div className={`nc-content-filtros ${painelFiltrosColapsado ? 'colapsado' : ''}`}>
          {renderPainelFiltros()}
        </div>
        
        {/* Conteúdo principal */}
        <div className="nc-content-main">
          {/* Barra de ferramentas */}
          <div className="nc-toolbar">
            <div className="nc-toolbar-info">
              {filtrosAtivos > 0 && (
                <div className="nc-filtros-aplicados">
                  <span>{filtrosAtivos} filtro(s) aplicado(s)</span>
                  <button 
                    className="nc-btn nc-btn-text nc-btn-limpar-filtros" 
                    onClick={limparFiltros}
                  >
                    Limpar todos
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Conteúdo principal (tabela ou cards) */}
          <div className="nc-main-content">
            {modoVisualizacao === 'tabela' ? renderTabela() : renderCards()}
          </div>
          
          {/* Paginação */}
          {renderPaginacao()}
        </div>
      </div>
    </div>
  );
};

export default NaoConformidadesList;