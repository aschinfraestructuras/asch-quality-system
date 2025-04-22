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
  Check, 
  Eye, 
  Edit, 
  BarChart2 
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

// Interface para estatísticas
interface Estatisticas {
  total: number;
  porEstado: Record<string, number>;
  porGravidade: Record<string, number>;
  porProjeto: Record<string, number>;
  proximasDoPrazo: number;
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

// Opções de estados e gravidades para filtros
const estadosDisponiveis = ['Aberta', 'Em tratamento', 'Verificação', 'Resolvida'];
const gravidadesDisponiveis = ['Alta', 'Média', 'Baixa'];
const projetosDisponiveis = ['Obra Ferroviária Setúbal', 'Ponte Vasco da Gama - Manutenção', 'Ampliação Terminal Portuário'];
const responsaveisDisponiveis = ['João Silva', 'Ana Costa', 'Manuel Gomes', 'Sofia Martins', 'Carlos Oliveira'];

const NaoConformidadesList: React.FC = () => {
  const navigate = useNavigate();
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
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'tabela' | 'cards'>('tabela');
  const [sortConfig, setSortConfig] = useState<{ key: keyof NaoConformidadeItem; direction: 'ascending' | 'descending' } | null>(null);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  
  // Estado para simulação de carregamento
  const [carregando, setCarregando] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFiltros(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFiltros(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Reset para a primeira página ao filtrar
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

  // Função para ordenar os dados
  const requestSort = (key: keyof NaoConformidadeItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Cálculo das estatísticas das não conformidades
  const estatisticas: Estatisticas = useMemo(() => {
    const stats = {
      total: dadosExemplo.length,
      porEstado: {} as Record<string, number>,
      porGravidade: {} as Record<string, number>,
      porProjeto: {} as Record<string, number>,
      proximasDoPrazo: 0
    };

    dadosExemplo.forEach(nc => {
      // Contagem por estado
      if (stats.porEstado[nc.estado]) {
        stats.porEstado[nc.estado]++;
      } else {
        stats.porEstado[nc.estado] = 1;
      }

      // Contagem por gravidade
      if (stats.porGravidade[nc.gravidade]) {
        stats.porGravidade[nc.gravidade]++;
      } else {
        stats.porGravidade[nc.gravidade] = 1;
      }

      // Contagem por projeto
      if (stats.porProjeto[nc.projeto]) {
        stats.porProjeto[nc.projeto]++;
      } else {
        stats.porProjeto[nc.projeto] = 1;
      }

      // Contagem de NCs próximas do prazo (5 dias ou menos)
      if (nc.diasRestantes !== undefined && nc.diasRestantes >= 0 && nc.diasRestantes <= 5 && nc.estado !== 'Resolvida') {
        stats.proximasDoPrazo++;
      }
    });

    return stats;
  }, [dadosExemplo]);

  // Filtrar não conformidades com base nos filtros
  const naoConformidadesFiltradas = useMemo(() => {
    return dadosExemplo.filter(nc => {
      // Filtro de texto
      const matchTexto = filtros.texto === '' || 
        nc.titulo.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.id.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.projeto.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        nc.responsavel.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        (nc.descricao && nc.descricao.toLowerCase().includes(filtros.texto.toLowerCase()));
      
      // Filtros específicos
      const matchEstado = filtros.estado === '' || nc.estado === filtros.estado;
      const matchGravidade = filtros.gravidade === '' || nc.gravidade === filtros.gravidade;
      const matchProjeto = filtros.projeto === '' || nc.projeto === filtros.projeto;
      const matchResponsavel = filtros.responsavel === '' || nc.responsavel === filtros.responsavel;
      
      // Filtro de prazo
      let matchPrazo = true;
      if (filtros.prazoInicio !== '' || filtros.prazoFim !== '') {
        const dataPrazo = new Date(nc.prazo.split('/').reverse().join('-'));
        
        if (filtros.prazoInicio !== '') {
          const dataInicio = new Date(filtros.prazoInicio);
          matchPrazo = matchPrazo && dataPrazo >= dataInicio;
        }
        
        if (filtros.prazoFim !== '') {
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

  // Ordenar e paginar as não conformidades filtradas
  const naoConformidadesOrdenadas = useMemo(() => {
    let sortableItems = [...naoConformidadesFiltradas];
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if ((a?.[sortConfig.key] ?? '') < (b?.[sortConfig.key] ?? '')) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if ((a?.[sortConfig.key] ?? '') > (b?.[sortConfig.key] ?? '')) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [naoConformidadesFiltradas, sortConfig]);

  // Paginar os dados
  const naoConformidadesPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itemsPorPagina;
    const fim = inicio + itemsPorPagina;
    return naoConformidadesOrdenadas.slice(inicio, fim);
  }, [naoConformidadesOrdenadas, paginaAtual, itemsPorPagina]);

  // Calcular o número total de páginas
  const totalPaginas = Math.ceil(naoConformidadesOrdenadas.length / itemsPorPagina);

  // Navegar entre páginas
  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  // Exportar dados para CSV
  const exportarCSV = () => {
    // Cabeçalhos das colunas
    const headers = ['ID', 'Título', 'Projeto', 'Data', 'Gravidade', 'Estado', 'Responsável', 'Prazo'];
    
    // Transformar dados para formato CSV
    const csvRows = [
      headers.join(','),
      ...naoConformidadesOrdenadas.map(nc => [
        nc.id,
        `"${nc.titulo.replace(/"/g, '""')}"`, // Escapa aspas duplas
        `"${nc.projeto.replace(/"/g, '""')}"`,
        nc.data,
        nc.gravidade,
        nc.estado,
        nc.responsavel,
        nc.prazo
      ].join(','))
    ];
    
    // Criar blob e fazer download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nao-conformidades-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para renderizar o cabeçalho da tabela com capacidade de ordenação
  const renderCabecalhoTabela = () => {
    const getSortIcon = (key: keyof NaoConformidadeItem) => {
      if (!sortConfig || sortConfig.key !== key) {
        return <ChevronDown size={14} />;
      }
      return sortConfig.direction === 'ascending' ? 
        <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
      <thead>
        <tr>
          <th onClick={() => requestSort('id')} className="sortable">
            ID {getSortIcon('id')}
          </th>
          <th onClick={() => requestSort('titulo')} className="sortable">
            Título {getSortIcon('titulo')}
          </th>
          <th onClick={() => requestSort('projeto')} className="sortable">
            Projeto {getSortIcon('projeto')}
          </th>
          <th onClick={() => requestSort('data')} className="sortable">
            Data {getSortIcon('data')}
          </th>
          <th onClick={() => requestSort('gravidade')} className="sortable">
            Gravidade {getSortIcon('gravidade')}
          </th>
          <th onClick={() => requestSort('estado')} className="sortable">
            Estado {getSortIcon('estado')}
          </th>
          <th onClick={() => requestSort('responsavel')} className="sortable">
            Responsável {getSortIcon('responsavel')}
          </th>
          <th onClick={() => requestSort('prazo')} className="sortable">
            Prazo {getSortIcon('prazo')}
          </th>
          <th>Ações</th>
        </tr>
      </thead>
    );
  };

  // Função para renderizar a visualização de tabela
  const renderTabela = () => {
    if (carregando) {
      return (
        <div className="nc-loading">
          <div className="nc-spinner"></div>
          <p>A carregar dados...</p>
        </div>
      );
    }

    if (naoConformidadesOrdenadas.length === 0) {
      return (
        <div className="nc-empty-state">
          <AlertTriangle size={48} />
          <h3>Sem resultados</h3>
          <p>Não foram encontradas não conformidades com os filtros selecionados.</p>
          <button onClick={limparFiltros} className="btn-secondary">
            Limpar filtros
          </button>
        </div>
      );
    }

    return (
      <div className="nc-table-container">
        <table className="nc-table">
          {renderCabecalhoTabela()}
          <tbody>
            {naoConformidadesPaginadas.map(nc => (
              <tr key={nc.id} className={`gravidade-${nc.gravidade.toLowerCase()}`}>
                <td>{nc.id}</td>
                <td className="nc-title">{nc.titulo}</td>
                <td>{nc.projeto}</td>
                <td>{nc.data}</td>
                <td>
                  <span className={`nc-badge gravidade-${nc.gravidade.toLowerCase()}`}>
                    {nc.gravidade}
                  </span>
                </td>
                <td>
                  <span className={`nc-badge estado-${nc.estado.toLowerCase().replace(' ', '-')}`}>
                    {nc.estado}
                  </span>
                </td>
                <td>{nc.responsavel}</td>
                <td className={nc.diasRestantes !== undefined && nc.diasRestantes <= 3 && nc.estado !== 'Resolvida' ? 'prazo-proximo' : ''}>
                  <div className="prazo-info">
                    {nc.prazo}
                    {nc.diasRestantes !== undefined && nc.diasRestantes <= 3 && nc.estado !== 'Resolvida' && (
                      <span className="prazo-alerta" title={`${nc.diasRestantes < 0 ? 'Atrasada' : 'Próxima do prazo'}`}>
                        <Clock size={14} />
                        {nc.diasRestantes < 0 ? `${Math.abs(nc.diasRestantes)}d atrasada` : `${nc.diasRestantes}d restantes`}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="nc-actions">
                    <button 
                      className="nc-btn-action nc-btn-view" 
                      onClick={() => navigate(`/nao-conformidades/${nc.id}`)}
                      title="Visualizar detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="nc-btn-action nc-btn-edit" 
                      onClick={() => navigate(`/nao-conformidades/editar/${nc.id}`)}
                      title="Editar não conformidade"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Função para renderizar a visualização de cards
  const renderCards = () => {
    if (carregando) {
      return (
        <div className="nc-loading">
          <div className="nc-spinner"></div>
          <p>A carregar dados...</p>
        </div>
      );
    }

    if (naoConformidadesOrdenadas.length === 0) {
      return (
        <div className="nc-empty-state">
          <AlertTriangle size={48} />
          <h3>Sem resultados</h3>
          <p>Não foram encontradas não conformidades com os filtros selecionados.</p>
          <button onClick={limparFiltros} className="btn-secondary">
            Limpar filtros
          </button>
        </div>
      );
    }

    return (
      <div className="nc-cards-container">
        {naoConformidadesPaginadas.map(nc => (
          <div key={nc.id} className={`nc-card gravidade-${nc.gravidade.toLowerCase()}-border`}>
            <div className="nc-card-header">
              <div className="nc-card-id">{nc.id}</div>
              <span className={`nc-badge gravidade-${nc.gravidade.toLowerCase()}`}>
                {nc.gravidade}
              </span>
            </div>
            
            <h3 className="nc-card-title">{nc.titulo}</h3>
            
            <div className="nc-card-project">
              <strong>Projeto:</strong> {nc.projeto}
            </div>
            
            <div className="nc-card-info">
              <div className="nc-card-info-item">
                <strong>Data:</strong> {nc.data}
              </div>
              <div className="nc-card-info-item">
                <strong>Responsável:</strong> {nc.responsavel}
              </div>
            </div>
            
            <div className="nc-card-status">
              <span className={`nc-badge estado-${nc.estado.toLowerCase().replace(' ', '-')}`}>
                {nc.estado}
              </span>
              
              <div className={`nc-prazo ${nc.diasRestantes !== undefined && nc.diasRestantes <= 3 && nc.estado !== 'Resolvida' ? 'prazo-proximo' : ''}`}>
                <strong>Prazo:</strong> {nc.prazo}
                {nc.diasRestantes !== undefined && nc.diasRestantes <= 3 && nc.estado !== 'Resolvida' && (
                  <span className="prazo-alerta-card">
                    <Clock size={14} />
                    {nc.diasRestantes < 0 ? `${Math.abs(nc.diasRestantes)}d atrasada` : `${nc.diasRestantes}d restantes`}
                  </span>
                )}
              </div>
            </div>
            
            {nc.descricao && (
              <div className="nc-card-description">
                <p>{nc.descricao.substring(0, 120)}{nc.descricao.length > 120 ? '...' : ''}</p>
              </div>
            )}
            
            <div className="nc-card-actions">
              <button 
                className="nc-btn nc-btn-view" 
                onClick={() => navigate(`/nao-conformidades/${nc.id}`)}
              >
                <Eye size={16} /> Visualizar
              </button>
              <button 
                className="nc-btn nc-btn-edit" 
                onClick={() => navigate(`/nao-conformidades/editar/${nc.id}`)}
              >
                <Edit size={16} /> Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Função para renderizar o painel de estatísticas
  const renderEstatisticas = () => {
    if (!mostrarEstatisticas) return null;

    return (
      <div className="nc-statistics">
        <div className="nc-statistics-header">
          <h3>Estatísticas</h3>
          <button 
            className="nc-btn-icon" 
            onClick={() => setMostrarEstatisticas(false)}
            title="Fechar estatísticas"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="nc-statistics-grid">
          <div className="nc-stat-card nc-stat-total">
            <div className="nc-stat-value">{estatisticas.total}</div>
            <div className="nc-stat-label">Total de Não Conformidades</div>
          </div>
          
          <div className="nc-stat-card nc-stat-by-estado">
            <div className="nc-stat-title">Por Estado</div>
            <div className="nc-stat-items">
              {estadosDisponiveis.map(estado => (
                <div key={estado} className="nc-stat-item">
                  <div className="nc-stat-item-label">
                    <span className={`nc-mini-badge estado-${estado.toLowerCase().replace(' ', '-')}`}></span>
                    {estado}:
                  </div>
                  <div className="nc-stat-item-value">
                    {estatisticas.porEstado[estado] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="nc-stat-card nc-stat-by-gravidade">
            <div className="nc-stat-title">Por Gravidade</div>
            <div className="nc-stat-items">
              {gravidadesDisponiveis.map(gravidade => (
                <div key={gravidade} className="nc-stat-item">
                  <div className="nc-stat-item-label">
                    <span className={`nc-mini-badge gravidade-${gravidade.toLowerCase()}`}></span>
                    {gravidade}:
                  </div>
                  <div className="nc-stat-item-value">
                    {estatisticas.porGravidade[gravidade] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="nc-stat-card nc-stat-prazos">
            <div className="nc-stat-title">Prazos</div>
            <div className="nc-stat-value">
              {estatisticas.proximasDoPrazo}
              <span className="nc-stat-sublabel">NCs próximas do prazo</span>
            </div>
            {estatisticas.proximasDoPrazo > 0 && (
              <button 
                className="nc-btn-filter-prazos"
                onClick={() => {
                  setFiltros(prev => ({ ...prev, filtroPrazoProximo: true }));
                  setPaginaAtual(1);
                }}
              >
                <Clock size={14} /> Filtrar próximas do prazo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Função para renderizar a paginação
  const renderPaginacao = () => {
    if (naoConformidadesOrdenadas.length === 0) return null;

    const geraPaginas = () => {
      const paginas = [];
      // Se tivermos poucas páginas, mostrar todas
      if (totalPaginas <= 7) {
        for (let i = 1; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        // Mostrar sempre a primeira página
        paginas.push(1);
        
        // Mostrar páginas ao redor da página atual
        let inicio = Math.max(2, paginaAtual - 1);
        let fim = Math.min(totalPaginas - 1, paginaAtual + 1);
        
        // Adicionar elipses se necessário
        if (inicio > 2) {
          paginas.push('...');
        }
        
        // Adicionar páginas
        for (let i = inicio; i <= fim; i++) {
          paginas.push(i);
        }
        
        // Adicionar elipses se necessário
        if (fim < totalPaginas - 1) {
          paginas.push('...');
        }
        
        // Mostrar sempre a última página
        paginas.push(totalPaginas);
      }
      
      return paginas;
    };

    return (
      <div className="nc-pagination">
        <div className="nc-pagination-info">
          Mostrando {(paginaAtual - 1) * itemsPorPagina + 1} a {Math.min(paginaAtual * itemsPorPagina, naoConformidadesOrdenadas.length)} de {naoConformidadesOrdenadas.length} não conformidades
        </div>
        
        <div className="nc-pagination-controls">
          <select 
            value={itemsPorPagina} 
            onChange={(e) => {
              setItemsPorPagina(Number(e.target.value));
              setPaginaAtual(1);
            }}
            className="nc-items-per-page"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          
          <div className="nc-pagination-buttons">
            <button 
              className="nc-pagination-btn" 
              onClick={() => irParaPagina(1)}
              disabled={paginaAtual === 1}
            >
              &laquo;
            </button>
            <button 
              className="nc-pagination-btn" 
              onClick={() => irParaPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              &lt;
            </button>
            
            {geraPaginas().map((pagina, index) => (
              typeof pagina === 'number' ? (
                <button 
                  key={index}
                  className={`nc-pagination-btn ${pagina === paginaAtual ? 'active' : ''}`}
                  onClick={() => irParaPagina(pagina)}
                >
                  {pagina}
                </button>
              ) : (
                <span key={index} className="nc-pagination-ellipsis">{pagina}</span>
              )
            ))}
            
            <button 
              className="nc-pagination-btn" 
              onClick={() => irParaPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              &gt;
            </button>
            <button 
              className="nc-pagination-btn" 
              onClick={() => irParaPagina(totalPaginas)}
              disabled={paginaAtual === totalPaginas}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderização principal do componente
  return (
    <div className="nc-container">
      <div className="nc-header">
        <div className="nc-title-section">
          <h2>Não Conformidades</h2>
          <div className="nc-header-buttons">
            <button
              className="nc-btn nc-btn-stats"
              onClick={() => setMostrarEstatisticas(!mostrarEstatisticas)}
              title={mostrarEstatisticas ? "Ocultar estatísticas" : "Mostrar estatísticas"}
            >
              <BarChart2 size={16} /> 
              {mostrarEstatisticas ? "Ocultar estatísticas" : "Mostrar estatísticas"}
            </button>
            <button
              className="nc-btn nc-btn-export"
              onClick={exportarCSV}
              title="Exportar lista para CSV"
            >
              <Download size={16} /> Exportar CSV
            </button>
            <Link to="/nao-conformidades/nova" className="nc-btn nc-btn-primary">
              <span className="nc-btn-text">Nova Não Conformidade</span>
            </Link>
          </div>
        </div>
        
        <div className="nc-toolbar">
          <div className="nc-search-box">
            <input
              type="text"
              placeholder="Pesquisar por ID, título, projeto ou responsável..."
              value={filtros.texto}
              onChange={(e) => handleFiltroChange({ target: { name: 'texto', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
            />
            <Search size={18} className="nc-search-icon" />
          </div>
          
          <div className="nc-toolbar-actions">
            <div className="nc-toolbar-filters">
              <select 
                name="estado" 
                value={filtros.estado} 
                onChange={handleFiltroChange}
                className="nc-filter-select"
              >
                <option value="">Todos os Estados</option>
                {estadosDisponiveis.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
              
              <select 
                name="gravidade" 
                value={filtros.gravidade} 
                onChange={handleFiltroChange}
                className="nc-filter-select"
              >
                <option value="">Todas as Gravidades</option>
                {gravidadesDisponiveis.map(gravidade => (
                  <option key={gravidade} value={gravidade}>{gravidade}</option>
                ))}
              </select>
              
              <button 
                className={`nc-btn-filter ${mostrarFiltrosAvancados ? 'active' : ''}`}
                onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
              >
                <Filter size={16} /> 
                {mostrarFiltrosAvancados ? 'Ocultar Filtros' : 'Mais Filtros'}
              </button>
            </div>
            
            <div className="nc-toolbar-view-options">
              <button 
                className={`nc-btn-view-mode ${modoVisualizacao === 'tabela' ? 'active' : ''}`}
                onClick={() => setModoVisualizacao('tabela')}
                title="Ver em tabela"
              >
                <i className="fas fa-table"></i>
              </button>
              <button 
                className={`nc-btn-view-mode ${modoVisualizacao === 'cards' ? 'active' : ''}`}
                onClick={() => setModoVisualizacao('cards')}
                title="Ver em cards"
              >
                <i className="fas fa-th-large"></i>
              </button>
            </div>
          </div>
        </div>
        
        {mostrarFiltrosAvancados && (
          <div className="nc-advanced-filters">
            <div className="nc-filter-group">
              <label className="nc-filter-label">Projeto</label>
              <select 
                name="projeto" 
                value={filtros.projeto} 
                onChange={handleFiltroChange}
                className="nc-filter-input"
              >
                <option value="">Todos os Projetos</option>
                {projetosDisponiveis.map((projeto, index) => (
                  <option key={index} value={projeto}>{projeto}</option>
                ))}
              </select>
            </div>
            
            <div className="nc-filter-group">
              <label className="nc-filter-label">Responsável</label>
              <select 
                name="responsavel" 
                value={filtros.responsavel} 
                onChange={handleFiltroChange}
                className="nc-filter-input"
              >
                <option value="">Todos os Responsáveis</option>
                {responsaveisDisponiveis.map((responsavel, index) => (
                  <option key={index} value={responsavel}>{responsavel}</option>
                ))}
              </select>
            </div>
            
            <div className="nc-filter-group">
              <label className="nc-filter-label">Prazo de</label>
              <input 
                type="date" 
                name="prazoInicio" 
                value={filtros.prazoInicio}
                onChange={handleFiltroChange}
                className="nc-filter-input nc-filter-date"
              />
            </div>
            
            <div className="nc-filter-group">
              <label className="nc-filter-label">até</label>
              <input 
                type="date" 
                name="prazoFim" 
                value={filtros.prazoFim}
                onChange={handleFiltroChange}
                className="nc-filter-input nc-filter-date"
              />
            </div>
            
            <div className="nc-filter-group nc-filter-checkbox">
              <input 
                type="checkbox" 
                id="filtroPrazoProximo"
                name="filtroPrazoProximo" 
                checked={filtros.filtroPrazoProximo}
                onChange={(e) => handleFiltroChange({ 
                  target: { 
                    name: 'filtroPrazoProximo', 
                    value: e.target.checked ? 'true' : '', 
                    type: 'checkbox',
                    checked: e.target.checked 
                  } 
                } as React.ChangeEvent<HTMLInputElement>)}
              />
              <label htmlFor="filtroPrazoProximo" className="nc-filter-checkbox-label">
                <Clock size={14} /> Apenas próximas do prazo (≤ 5 dias)
              </label>
            </div>
            
            <button 
              className="nc-btn nc-btn-clear-filters" 
              onClick={limparFiltros}
            >
              <X size={14} /> Limpar Filtros
            </button>
          </div>
        )}
        
        {Object.values(filtros).some(valor => 
          typeof valor === 'string' ? valor !== '' : valor === true
        ) && (
          <div className="nc-active-filters">
            <div className="nc-active-filters-title">Filtros ativos:</div>
            <div className="nc-active-filters-list">
              {filtros.texto && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Texto:</span>
                  <span className="nc-active-filter-value">{filtros.texto}</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, texto: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {filtros.estado && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Estado:</span>
                  <span className="nc-active-filter-value">{filtros.estado}</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, estado: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {filtros.gravidade && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Gravidade:</span>
                  <span className="nc-active-filter-value">{filtros.gravidade}</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, gravidade: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {filtros.projeto && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Projeto:</span>
                  <span className="nc-active-filter-value">{filtros.projeto}</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, projeto: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {filtros.responsavel && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Responsável:</span>
                  <span className="nc-active-filter-value">{filtros.responsavel}</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, responsavel: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {(filtros.prazoInicio || filtros.prazoFim) && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Prazo:</span>
                  <span className="nc-active-filter-value">
                    {filtros.prazoInicio ? new Date(filtros.prazoInicio).toLocaleDateString('pt-PT') : 'Início'} 
                    {' - '} 
                    {filtros.prazoFim ? new Date(filtros.prazoFim).toLocaleDateString('pt-PT') : 'Fim'}
                  </span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, prazoInicio: '', prazoFim: '' }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {filtros.filtroPrazoProximo && (
                <div className="nc-active-filter">
                  <span className="nc-active-filter-label">Apenas próximas do prazo</span>
                  <button 
                    className="nc-active-filter-remove" 
                    onClick={() => setFiltros(prev => ({ ...prev, filtroPrazoProximo: false }))}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            
            <button className="nc-btn-clear-all-filters" onClick={limparFiltros}>
              Limpar todos
            </button>
          </div>
        )}

        {/* Painel de estatísticas */}
        {renderEstatisticas()}
      </div>
      
      <div className="nc-content">
        {/* Conteúdo principal baseado no modo de visualização */}
        {modoVisualizacao === 'tabela' ? renderTabela() : renderCards()}
        
        {/* Paginação */}
        {renderPaginacao()}
      </div>

      {/* Modal de ajuda - pode ser ativado por um botão de ajuda */}
      {mostrarAjuda && (
        <div className="nc-help-modal">
          <div className="nc-help-content">
            <div className="nc-help-header">
              <h3>Ajuda - Não Conformidades</h3>
              <button className="nc-btn-close" onClick={() => setMostrarAjuda(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="nc-help-body">
              <h4>Filtragem de dados</h4>
              <p>
                Utilize os filtros para encontrar rapidamente não conformidades específicas.
                Pode combinar vários filtros para refinar a sua pesquisa.
              </p>
              
              <h4>Ordenação</h4>
              <p>
                Clique nos cabeçalhos das colunas na vista de tabela para ordenar os dados.
                Clique novamente para alternar entre ordem crescente e decrescente.
              </p>
              
              <h4>Modos de visualização</h4>
              <p>
                Alterne entre a vista de tabela e a vista de cards utilizando os botões na barra de ferramentas.
              </p>
              
              <h4>Estatísticas</h4>
              <p>
                O painel de estatísticas mostra um resumo das não conformidades por estado, gravidade,
                e destaca as que estão próximas do prazo (5 dias ou menos).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante de ajuda */}
      <button className="nc-help-button" onClick={() => setMostrarAjuda(true)}>
        <span className="nc-help-icon">?</span>
      </button>
    </div>
  );
};

export default NaoConformidadesList;