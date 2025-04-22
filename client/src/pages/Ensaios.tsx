import React, { useEffect, useState, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTimes, faChevronLeft, faChevronRight, 
  faEye, faEdit, faFileDownload, faFilter, faSortAmountDown,
  faPlus, faFlask, faCheckCircle, faTimesCircle, faExclamationTriangle,
  faInfoCircle, faSyncAlt, faClipboardCheck, faHistory, 
  faChartLine, faEllipsisV, faSort, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Ensaios.css';

// Definição de tipos para ensaios
interface Ensaio {
  id: number;
  name: string;
  type: string;
  project: string;
  status: string;
  result?: string;
  completion: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  material?: string;
  normReference?: string;
  testDate?: string;
  approvedBy?: string;
  approvedAt?: string;
}

// Interface para as props do Tooltip
interface TooltipProps {
  conteudo: string;
  children: ReactNode;
}

// Componente de Tooltip para informações adicionais
const Tooltip: React.FC<TooltipProps> = ({ conteudo, children }) => (
  <div className="tooltip-container">
    {children}
    <span className="tooltip-texto">{conteudo}</span>
  </div>
);

const ListaEnsaios: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [ensaios, setEnsaios] = useState<Ensaio[]>([]);
  const [ensaiosOriginais, setEnsaiosOriginais] = useState<Ensaio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ensaioMenu, setEnsaioMenu] = useState<number | null>(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroProjeto, setFiltroProjeto] = useState('todos');
  const [filtroMaterial, setFiltroMaterial] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'updatedAt',
    direcao: 'desc'
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  // Mock temporário (substituível por fetch real)
  useEffect(() => {
    // Simulação de carregamento
    setCarregando(true);
    
    setTimeout(() => {
      const mock: Ensaio[] = [
        {
          id: 1,
          name: 'Ensaio de Compressão - Concreto',
          type: 'Compressão',
          project: 'Obra Ferroviária Setúbal',
          status: 'Conforme',
          result: '32 MPa',
          completion: 100,
          createdBy: 'Carlos Santos',
          createdAt: '12/04/2025',
          updatedAt: '16/04/2025',
          material: 'Concreto',
          normReference: 'NBR 5739',
          testDate: '15/04/2025',
          approvedBy: 'Maria Oliveira',
          approvedAt: '16/04/2025'
        },
        {
          id: 2,
          name: 'Análise Granulométrica - Balastro',
          type: 'Granulométrica',
          project: 'Obra Ferroviária Setúbal',
          status: 'Em análise',
          completion: 80,
          createdBy: 'João Silva',
          createdAt: '13/04/2025',
          updatedAt: '15/04/2025',
          material: 'Balastro',
          normReference: 'EN 13450',
          testDate: '14/04/2025'
        },
        {
          id: 3,
          name: 'Ensaio CBR - Subleito',
          type: 'CBR',
          project: 'Ponte Vasco da Gama - Manutenção',
          status: 'Não Conforme',
          result: '4%',
          completion: 100,
          createdBy: 'Ana Pereira',
          createdAt: '10/04/2025',
          updatedAt: '12/04/2025',
          material: 'Solo',
          normReference: 'ASTM D1883',
          testDate: '11/04/2025',
          approvedBy: 'Ricardo Almeida',
          approvedAt: '12/04/2025'
        },
        {
          id: 4,
          name: 'Ensaio de Tração - Aço Estrutural',
          type: 'Tração',
          project: 'Ampliação Terminal Portuário',
          status: 'Pendente de aprovação',
          result: '550 MPa',
          completion: 100,
          createdBy: 'Pedro Martins',
          createdAt: '09/04/2025',
          updatedAt: '14/04/2025',
          material: 'Aço',
          normReference: 'ISO 6892-1',
          testDate: '13/04/2025'
        },
        {
          id: 5,
          name: 'Ensaio de Abatimento - Concreto',
          type: 'Abatimento',
          project: 'Obra Ferroviária Setúbal',
          status: 'Conforme',
          result: '10 cm',
          completion: 100,
          createdBy: 'Sofia Costa',
          createdAt: '14/04/2025',
          updatedAt: '15/04/2025',
          material: 'Concreto',
          normReference: 'NBR NM 67',
          testDate: '14/04/2025',
          approvedBy: 'Carlos Santos',
          approvedAt: '15/04/2025'
        },
        {
          id: 6,
          name: 'Ensaio de Dureza Brinell - Aço',
          type: 'Dureza',
          project: 'Ampliação Terminal Portuário',
          status: 'Conforme',
          result: '210 HB',
          completion: 100,
          createdBy: 'Miguel Sousa',
          createdAt: '08/04/2025',
          updatedAt: '12/04/2025',
          material: 'Aço',
          normReference: 'ISO 6506-1',
          testDate: '11/04/2025',
          approvedBy: 'Maria Oliveira',
          approvedAt: '12/04/2025'
        },
        {
          id: 7,
          name: 'Ensaio de Densidade - Solo Argiloso',
          type: 'Densidade',
          project: 'Ponte Vasco da Gama - Manutenção',
          status: 'Em análise',
          completion: 75,
          createdBy: 'Luísa Mendes',
          createdAt: '13/04/2025',
          updatedAt: '14/04/2025',
          material: 'Solo',
          normReference: 'ASTM D7263',
          testDate: '14/04/2025'
        }
      ];
      
      setEnsaios(mock);
      setEnsaiosOriginais(mock);
      setCarregando(false);
    }, 800);
  }, []);

  // Extrair opções únicas para filtros
  const tipoOptions = ['todos', ...Array.from(new Set(ensaiosOriginais.map(e => e.type)))];
  const statusOptions = ['todos', ...Array.from(new Set(ensaiosOriginais.map(e => e.status)))];
  const projetoOptions = ['todos', ...Array.from(new Set(ensaiosOriginais.map(e => e.project)))];
  const materialOptions = ['todos', ...Array.from(new Set(ensaiosOriginais.map(e => e.material || '').filter(m => m !== '')))];

  // Função para formatar a data
  const formatarData = (dataString: string) => {
    return dataString;
  };

  // Ordenação e Filtragem
  useEffect(() => {
    let ensaiosFiltrados = [...ensaiosOriginais];
    
    // Aplicar filtro de pesquisa
    if (searchTerm) {
      ensaiosFiltrados = ensaiosFiltrados.filter(
        e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
             e.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (e.material && e.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
             String(e.id).includes(searchTerm)
      );
    }
    
    // Aplicar filtros de seleção
    if (filtroTipo !== 'todos') {
      ensaiosFiltrados = ensaiosFiltrados.filter(e => e.type === filtroTipo);
    }
    
    if (filtroStatus !== 'todos') {
      ensaiosFiltrados = ensaiosFiltrados.filter(e => e.status === filtroStatus);
    }
    
    if (filtroProjeto !== 'todos') {
      ensaiosFiltrados = ensaiosFiltrados.filter(e => e.project === filtroProjeto);
    }
    
    if (filtroMaterial !== 'todos') {
      ensaiosFiltrados = ensaiosFiltrados.filter(e => e.material === filtroMaterial);
    }
    
    // Aplicar ordenação
    ensaiosFiltrados.sort((a, b) => {
      let valorA: any, valorB: any;
      
      switch (ordenacao.campo) {
        case 'id':
          valorA = a.id;
          valorB = b.id;
          break;
        case 'name':
          valorA = a.name;
          valorB = b.name;
          break;
        case 'type':
          valorA = a.type;
          valorB = b.type;
          break;
        case 'testDate':
          // Ordenação por data: converter para objetos Date
          valorA = a.testDate ? new Date(a.testDate.split('/').reverse().join('-')) : new Date(0);
          valorB = b.testDate ? new Date(b.testDate.split('/').reverse().join('-')) : new Date(0);
          break;
        case 'updatedAt':
          valorA = a.updatedAt ? new Date(a.updatedAt.split('/').reverse().join('-')) : new Date(0);
          valorB = b.updatedAt ? new Date(b.updatedAt.split('/').reverse().join('-')) : new Date(0);
          break;
        default:
          valorA = a[ordenacao.campo as keyof Ensaio];
          valorB = b[ordenacao.campo as keyof Ensaio];
      }
      
      if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
    
    setEnsaios(ensaiosFiltrados);
    setPaginaAtual(1); // Resetar para primeira página ao filtrar
  }, [filtroTipo, filtroStatus, filtroProjeto, filtroMaterial, searchTerm, ordenacao, ensaiosOriginais]);

  // Paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensPaginaAtual = ensaios.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(ensaios.length / itensPorPagina);

  // Alternar página
  const mudarPagina = (numeroPagina: number) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaAtual(numeroPagina);
    }
  };

  // Gerar array de números de página para navegação
  const gerarNumerosPagina = () => {
    const paginas = [];
    const maxPaginasVisiveis = 3;
    
    let startPage = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
    let endPage = Math.min(totalPaginas, startPage + maxPaginasVisiveis - 1);
    
    // Ajustar se estamos no final da lista
    if (endPage - startPage + 1 < maxPaginasVisiveis) {
      startPage = Math.max(1, endPage - maxPaginasVisiveis + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  // Função para ordenar por coluna
  const ordenarPor = (campo: string) => {
    setOrdenacao(prev => ({
      campo: campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Função para abrir/fechar menu de ações do ensaio
  const toggleMenu = (id: number) => {
    setEnsaioMenu(ensaioMenu === id ? null : id);
  };

  // Limpar todos os filtros
  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroTipo('todos');
    setFiltroStatus('todos');
    setFiltroProjeto('todos');
    setFiltroMaterial('todos');
  };

  // Ícone de status
  interface StatusIconProps {
    status: string;
  }
  
  const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
    switch (status) {
      case 'Conforme':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon conforme" />;
      case 'Não Conforme':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon nao-conforme" />;
      case 'Em análise':
        return <FontAwesomeIcon icon={faSyncAlt} className="status-icon em-analise" spin />;
      case 'Pendente de aprovação':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon pendente" />;
      default:
        return null;
    }
  };

  // Componente de loading
  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <div className="spinner">
        <FontAwesomeIcon icon={faFlask} spin />
      </div>
      <p>A carregar ensaios...</p>
    </div>
  );

  return (
    <div className="ensaios-container">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon={faFlask} className="titulo-icone" />
            Ensaios
          </h1>
          <p className="page-subtitle">Gerencie e analise os ensaios de qualidade dos materiais</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faFileDownload} /> Exportar
          </button>
          <button className="btn-primario" onClick={() => navigate('/ensaios/novo')}>
            <FontAwesomeIcon icon={faPlus} /> Novo Ensaio
          </button>
        </div>
      </div>

      {/* Navegação secundária contextual */}
      <div className="contextual-nav">
        <Link to="/ensaios" className="nav-item active">
          <FontAwesomeIcon icon={faClipboardCheck} /> Lista
        </Link>
        <Link to="/ensaios/dashboard" className="nav-item">
          <FontAwesomeIcon icon={faChartLine} /> Dashboard
        </Link>
        <Link to="/ensaios/relatorios" className="nav-item">
          <FontAwesomeIcon icon={faFileDownload} /> Relatórios
        </Link>
        <Link to="/ensaios/analise-avancada" className="nav-item">
          <FontAwesomeIcon icon={faChartLine} /> Análise Avançada
        </Link>
        <Link to="/ensaios/workflow" className="nav-item">
          <FontAwesomeIcon icon={faHistory} /> Workflow
        </Link>
        <Link to="/ensaios/integracao-lab" className="nav-item">
          <FontAwesomeIcon icon={faFlask} /> Integração Lab
        </Link>
      </div>

      {/* Filtros e pesquisa */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label htmlFor="filtro-tipo">Tipo de Ensaio</label>
          <select
            id="filtro-tipo"
            className="select-control"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            {tipoOptions.filter(opt => opt !== 'todos').map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-status">Estado</label>
          <select
            id="filtro-status"
            className="select-control"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os estados</option>
            {statusOptions.filter(opt => opt !== 'todos').map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-projeto">Projeto</label>
          <select
            id="filtro-projeto"
            className="select-control"
            value={filtroProjeto}
            onChange={(e) => setFiltroProjeto(e.target.value)}
          >
            <option value="todos">Todos os projetos</option>
            {projetoOptions.filter(opt => opt !== 'todos').map(projeto => (
              <option key={projeto} value={projeto}>{projeto}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-material">Material</label>
          <select
            id="filtro-material"
            className="select-control"
            value={filtroMaterial}
            onChange={(e) => setFiltroMaterial(e.target.value)}
          >
            <option value="todos">Todos os materiais</option>
            {materialOptions.filter(opt => opt !== 'todos').map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo ordenacao">
          <label htmlFor="ordenacao">Ordenar por</label>
          <div className="ordenacao-opcoes">
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'updatedAt' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('updatedAt')}
            >
              Data Atualização {ordenacao.campo === 'updatedAt' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'testDate' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('testDate')}
            >
              Data Ensaio {ordenacao.campo === 'testDate' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'status' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('status')}
            >
              Estado {ordenacao.campo === 'status' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
          </div>
        </div>

        <div className="filtro-grupo pesquisa">
          <label htmlFor="pesquisa-ensaio">Pesquisar</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon={faSearch} className="icone-pesquisa" />
            <input
              type="text"
              id="pesquisa-ensaio"
              className="input-control"
              placeholder="ID, nome, tipo ou projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="botao-limpar-pesquisa"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar pesquisa"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de ensaios */}
      <div className="card-container ensaios-tabela">
        {carregando ? (
          <LoadingOverlay />
        ) : (
          <>
            <div className="tabela-header">
              <div className="tabela-info">
                <h3>Lista de Ensaios</h3>
                <span className="contador-resultados">
                  {ensaios.length} ensaios encontrados
                </span>
              </div>
              
              <div className="tabela-acoes">
                <div className="resultados-por-pagina">
                  <span>Mostrar:</span>
                  <select className="select-control select-mini">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                
                <button className="btn-icone" title="Atualizar lista">
                  <FontAwesomeIcon icon={faSyncAlt} />
                </button>
                
                <button 
                  className="btn-icone" 
                  title="Filtros avançados"
                  onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              </div>
            </div>
        
            {ensaios.length === 0 ? (
              <div className="tabela-vazia">
                <FontAwesomeIcon icon={faFlask} size="3x" />
                <p>Nenhum ensaio encontrado com os critérios selecionados.</p>
                <button
                  className="btn-secundario"
                  onClick={limparFiltros}
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="tabela-responsiva">
                  <table className="tabela-dados">
                    <thead>
                      <tr>
                        <th onClick={() => ordenarPor('id')} className="th-ordenavel">
                          ID
                          {ordenacao.campo === 'id' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('name')} className="th-ordenavel">
                          Nome
                          {ordenacao.campo === 'name' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('type')} className="th-ordenavel">
                          Tipo
                          {ordenacao.campo === 'type' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('project')} className="th-ordenavel">
                          Projeto
                          {ordenacao.campo === 'project' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('material')} className="th-ordenavel">
                          Material
                          {ordenacao.campo === 'material' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('testDate')} className="th-ordenavel">
                          Data Ensaio
                          {ordenacao.campo === 'testDate' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('status')} className="th-ordenavel">
                          Estado
                          {ordenacao.campo === 'status' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('updatedAt')} className="th-ordenavel">
                          Última Atualização
                          {ordenacao.campo === 'updatedAt' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th className="th-acoes">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensPaginaAtual.map((ensaio) => (
                        <tr key={ensaio.id}>
                          <td className="td-id">
                            <span className="id-badge">#{ensaio.id}</span>
                          </td>
                          <td className="td-nome">
                            <span className="nome-ensaio">{ensaio.name}</span>
                            {ensaio.result && (
                              <span className="resultado-tag">
                                Resultado: {ensaio.result}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge tipo-${ensaio.type.toLowerCase()}`}>
                              {ensaio.type}
                            </span>
                          </td>
                          <td>{ensaio.project}</td>
                          <td>{ensaio.material || '—'}</td>
                          <td>
                            <span className="data-com-icone">
                              <FontAwesomeIcon icon={faCalendarAlt} className="icone-data" />
                              {ensaio.testDate || '—'}
                            </span>
                          </td>
                          <td>
                            <div className="status-container">
                              <StatusIcon status={ensaio.status} />
                              <span className={`status-badge status-${ensaio.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {ensaio.status}
                              </span>
                            </div>
                          </td>
                          <td>
                            <Tooltip conteudo={`Por: ${ensaio.approvedBy || ensaio.createdBy}`}>
                              {ensaio.updatedAt}
                            </Tooltip>
                          </td>
                          <td className="td-acoes">
                            <div className="acoes-dropdown">
                              <button 
                                className="btn-acao-combinado" 
                                onClick={() => navigate(`/ensaios/${ensaio.id}`)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                                <span>Ver</span>
                                <span className="separador"></span>
                                <FontAwesomeIcon icon={faEllipsisV} onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(ensaio.id);
                                }} />
                              </button>
                              
                              {ensaioMenu === ensaio.id && (
                                <div className="menu-dropdown">
                                  <Link to={`/ensaios/${ensaio.id}/editar`} className="menu-item">
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                  </Link>
                                  <Link to={`/ensaios/${ensaio.id}/relatorio`} className="menu-item">
                                    <FontAwesomeIcon icon={faFileDownload} /> Relatório
                                  </Link>
                                  <Link to={`/ensaios/${ensaio.id}/historico`} className="menu-item">
                                    <FontAwesomeIcon icon={faHistory} /> Histórico
                                  </Link>
                                  <Link to={`/ensaios/${ensaio.id}/analise`} className="menu-item">
                                    <FontAwesomeIcon icon={faChartLine} /> Análise
                                  </Link>
                                  <div className="menu-separador"></div>
                                  {ensaio.status !== 'Conforme' && ensaio.status !== 'Não Conforme' && (
                                    <button className="menu-item texto-sucesso">
                                      <FontAwesomeIcon icon={faCheckCircle} /> Aprovar
                                    </button>
                                  )}
                                  {ensaio.status !== 'Não Conforme' && (
                                    <button className="menu-item texto-atencao">
                                      <FontAwesomeIcon icon={faTimesCircle} /> Rejeitar
                                    </button>
                                  )}
                                  <button className="menu-item texto-perigo">
                                    <FontAwesomeIcon icon={faTimes} /> Cancelar Ensaio
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Paginação */}
                <div className="paginacao">
                  <div className="paginacao-info">
                    Mostrando {indicePrimeiroItem + 1}-{Math.min(indiceUltimoItem, ensaios.length)} de {ensaios.length} ensaios
                  </div>
                  
                  <div className="paginacao-controles">
                    <button 
                      className="btn-paginacao" 
                      onClick={() => mudarPagina(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} /> Anterior
                    </button>
                    
                    <div className="paginas">
                      {paginaAtual > 2 && totalPaginas > 3 && (
                        <>
                          <button 
                            className="pagina" 
                            onClick={() => mudarPagina(1)}
                          >
                            1
                          </button>
                          {paginaAtual > 3 && <span className="pagina-ellipsis">...</span>}
                        </>
                      )}
                      
                      {gerarNumerosPagina().map(numero => (
                        <button
                          key={numero}
                          className={`pagina ${numero === paginaAtual ? 'ativa' : ''}`}
                          onClick={() => mudarPagina(numero)}
                        >
                          {numero}
                        </button>
                      ))}
                      
                      {paginaAtual < totalPaginas - 1 && totalPaginas > 3 && (
                        <>
                          {paginaAtual < totalPaginas - 2 && <span className="pagina-ellipsis">...</span>}
                          <button 
                            className="pagina" 
                            onClick={() => mudarPagina(totalPaginas)}
                          >
                            {totalPaginas}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="btn-paginacao" 
                      onClick={() => mudarPagina(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                    >
                      Próxima <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {/* Modal de Filtros Avançados - aparece quando mostrarFiltrosAvancados é true */}
      {mostrarFiltrosAvancados && (
        <div className="filtros-avancados-overlay">
          <div className="filtros-avancados-modal">
            <div className="filtros-avancados-header">
              <h3>Filtros Avançados</h3>
              <button className="btn-fechar" onClick={() => setMostrarFiltrosAvancados(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="filtros-avancados-body">
              <div className="filtro-secao">
                <h4>Período</h4>
                <div className="filtro-periodo">
                  <div className="filtro-campo">
                    <label>Data Início</label>
                    <input type="date" className="input-control" />
                  </div>
                  <div className="filtro-campo">
                    <label>Data Fim</label>
                    <input type="date" className="input-control" />
                  </div>
                </div>
              </div>
              
              <div className="filtro-secao">
                <h4>Detalhes do Ensaio</h4>
                <div className="filtro-linha">
                  <div className="filtro-campo">
                    <label>Responsável</label>
                    <select className="select-control">
                      <option value="">Todos</option>
                      <option value="Carlos Santos">Carlos Santos</option>
                      <option value="Maria Oliveira">Maria Oliveira</option>
                      <option value="João Silva">João Silva</option>
                    </select>
                  </div>
                  <div className="filtro-campo">
                    <label>Norma Referência</label>
                    <select className="select-control">
                      <option value="">Todas</option>
                      <option value="NBR 5739">NBR 5739</option>
                      <option value="EN 13450">EN 13450</option>
                      <option value="ASTM D1883">ASTM D1883</option>
                      <option value="ISO 6892-1">ISO 6892-1</option>
                    </select>
                  </div>
                </div>
                
                <div className="filtro-linha">
                  <div className="filtro-campo">
                    <label>Conclusão</label>
                    <div className="filtro-range">
                      <input type="range" min="0" max="100" step="10" defaultValue="0" />
                      <span>0% - 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="filtros-avancados-footer">
              <button className="btn-secundario" onClick={() => setMostrarFiltrosAvancados(false)}>
                Cancelar
              </button>
              <button className="btn-primario">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaEnsaios;