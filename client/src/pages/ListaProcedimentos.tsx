import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTimes, faChevronLeft, faChevronRight, faFilter,
  faEye, faEdit, faDownload, faQuestionCircle, faFileAlt, 
  faPlus, faFileExport, faCheckCircle, faSpinner, faClipboardCheck,
  faExclamationTriangle, faInfoCircle, faSyncAlt, 
  faHistory, faChartLine, faCalendarAlt, faUserAlt, faBuilding,
  faSortAmountDown, faEllipsisV, faCog, faBookOpen, faCopy
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Documentos.css';

// Tipo para Procedimento
interface Procedimento {
  id: number;
  codigo: string;
  titulo: string;
  categoria: string;
  departamento: string;
  data_criacao: string;
  data_atualizacao: string;
  status: string;
  version: string;
  author: string;
  description?: string;
}

// Tipo para Obra
interface Obra {
  id: number;
  nome: string;
}

const ListaProcedimentos: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroDepartamento, setFiltroDepartamento] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pesquisa, setPesquisa] = useState<string>('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [procedimentoMenu, setProcedimentoMenu] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'data_atualizacao',
    direcao: 'desc'
  });

  // Mock de dados
  useEffect(() => {
    // Simulação de carregamento
    setCarregando(true);
    
    setTimeout(() => {
      // Dados de Procedimentos
      const procedimentosMock: Procedimento[] = [
        {
          id: 1,
          codigo: 'PROC-QUA-001',
          titulo: 'Controlo de Qualidade de Betão',
          categoria: 'Qualidade',
          departamento: 'Controlo de Qualidade',
          data_criacao: '2024-09-15',
          data_atualizacao: '2025-01-20',
          status: 'ativo',
          version: 'v2.1',
          author: 'António Costa',
          description: 'Procedimento para controlo de qualidade de betão em obra'
        },
        {
          id: 2,
          codigo: 'PROC-SEG-010',
          titulo: 'Trabalhos em Altura',
          categoria: 'Segurança',
          departamento: 'Segurança e Saúde',
          data_criacao: '2024-08-22',
          data_atualizacao: '2025-02-05',
          status: 'ativo',
          version: 'v1.3',
          author: 'Sofia Rodrigues',
          description: 'Procedimento de segurança para trabalhos em altura'
        },
        {
          id: 3,
          codigo: 'PROC-AMB-005',
          titulo: 'Gestão de Resíduos de Construção',
          categoria: 'Ambiente',
          departamento: 'Gestão Ambiental',
          data_criacao: '2024-11-10',
          data_atualizacao: '2025-03-01',
          status: 'ativo',
          version: 'v1.1',
          author: 'Paulo Matos',
          description: 'Procedimento para gestão e encaminhamento de resíduos de construção'
        },
        {
          id: 4,
          codigo: 'PROC-QUA-015',
          titulo: 'Ensaios de Compactação de Solos',
          categoria: 'Qualidade',
          departamento: 'Laboratório',
          data_criacao: '2025-01-05',
          data_atualizacao: '2025-04-10',
          status: 'em_revisao',
          version: 'v1.2',
          author: 'Luísa Silva',
          description: 'Procedimento para realização de ensaios de compactação de solos'
        },
        {
          id: 5,
          codigo: 'PROC-SEG-022',
          titulo: 'Espaços Confinados',
          categoria: 'Segurança',
          departamento: 'Segurança e Saúde',
          data_criacao: '2024-12-18',
          data_atualizacao: '2025-04-02',
          status: 'ativo',
          version: 'v2.0',
          author: 'Ricardo Santos',
          description: 'Procedimento de segurança para trabalhos em espaços confinados'
        },
        {
          id: 6,
          codigo: 'PROC-PROD-008',
          titulo: 'Execução de Estruturas Metálicas',
          categoria: 'Produção',
          departamento: 'Produção',
          data_criacao: '2024-10-30',
          data_atualizacao: '2025-02-22',
          status: 'ativo',
          version: 'v1.0',
          author: 'Carlos Pereira',
          description: 'Procedimento para execução de estruturas metálicas'
        },
        {
          id: 7,
          codigo: 'PROC-QUA-020',
          titulo: 'Controlo de Soldaduras',
          categoria: 'Qualidade',
          departamento: 'Controlo de Qualidade',
          data_criacao: '2025-02-10',
          data_atualizacao: '2025-03-15',
          status: 'em_aprovacao',
          version: 'v1.0',
          author: 'Miguel Oliveira',
          description: 'Procedimento para controlo e inspeção de soldaduras'
        },
        {
          id: 8,
          codigo: 'PROC-AMB-012',
          titulo: 'Prevenção de Derrames',
          categoria: 'Ambiente',
          departamento: 'Gestão Ambiental',
          data_criacao: '2024-11-20',
          data_atualizacao: '2025-01-10',
          status: 'obsoleto',
          version: 'v1.4',
          author: 'Ana Ferreira',
          description: 'Procedimento para prevenção e mitigação de derrames de substâncias perigosas'
        }
      ];
      
      // Extrair categorias e departamentos únicos
      const categoriasUnicas = [...new Set(procedimentosMock.map(p => p.categoria))];
      const departamentosUnicos = [...new Set(procedimentosMock.map(p => p.departamento))];
      
      // Calcular número total de páginas
      const totalPags = Math.ceil(procedimentosMock.length / itensPorPagina);
      
      setProcedimentos(procedimentosMock);
      setCategorias(categoriasUnicas);
      setDepartamentos(departamentosUnicos);
      setTotalPaginas(totalPags);
      setCarregando(false);
    }, 800);
  }, [itensPorPagina]);

  // Filtrar Procedimentos com base nos critérios
  const procedimentosFiltrados = procedimentos.filter(proc => {
    // Filtro por categoria
    if (filtroCategoria !== 'todas' && proc.categoria !== filtroCategoria) {
      return false;
    }
    
    // Filtro por departamento
    if (filtroDepartamento !== 'todos' && proc.departamento !== filtroDepartamento) {
      return false;
    }
    
    // Filtro por status
    if (filtroStatus !== 'todos' && proc.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por termo de pesquisa
    if (pesquisa) {
      const termoPesquisa = pesquisa.toLowerCase();
      return (
        proc.titulo.toLowerCase().includes(termoPesquisa) ||
        proc.codigo.toLowerCase().includes(termoPesquisa) ||
        proc.author.toLowerCase().includes(termoPesquisa) ||
        proc.description?.toLowerCase().includes(termoPesquisa)
      );
    }
    
    return true;
  });

  // Ordenar Procedimentos
  const procedimentosOrdenados = [...procedimentosFiltrados].sort((a, b) => {
    let valorA, valorB;
    
    switch (ordenacao.campo) {
      case 'codigo':
        valorA = a.codigo;
        valorB = b.codigo;
        break;
      case 'titulo':
        valorA = a.titulo;
        valorB = b.titulo;
        break;
      case 'data_atualizacao':
        valorA = new Date(a.data_atualizacao);
        valorB = new Date(b.data_atualizacao);
        break;
      case 'status':
        valorA = a.status;
        valorB = b.status;
        break;
      default:
        valorA = a[ordenacao.campo as keyof Procedimento];
        valorB = b[ordenacao.campo as keyof Procedimento];
    }
    
    if (ordenacao.direcao === 'asc') {
      return (valorA ?? '') > (valorB ?? '') ? 1 : -1;
    } else {
      return (valorA ?? '') < (valorB ?? '') ? 1 : -1;
    }
  });

  // Paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const procedimentosAtuais = procedimentosOrdenados.slice(indiceInicial, indiceFinal);

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroCategoria('todas');
    setFiltroDepartamento('todos');
    setFiltroStatus('todos');
    setPesquisa('');
  };

  // Mudar ordenação
  const ordenarPor = (campo: string) => {
    setOrdenacao(prev => ({
      campo: campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Função para abrir/fechar menu de ações
  const toggleMenu = (id: number) => {
    setProcedimentoMenu(procedimentoMenu === id ? null : id);
  };

  // Componente para exibir o status do Procedimento
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = '';
    let icon;
    let texto = '';
    
    switch (status) {
      case 'ativo':
        badgeClass = 'status-ativo';
        icon = faCheckCircle;
        texto = 'Ativo';
        break;
      case 'em_revisao':
        badgeClass = 'status-em-revisao';
        icon = faSpinner;
        texto = 'Em Revisão';
        break;
      case 'em_aprovacao':
        badgeClass = 'status-em-aprovacao';
        icon = faExclamationTriangle;
        texto = 'Em Aprovação';
        break;
      case 'obsoleto':
        badgeClass = 'status-obsoleto';
        icon = faTimes;
        texto = 'Obsoleto';
        break;
      default:
        badgeClass = 'status-ativo';
        icon = faCheckCircle;
        texto = 'Ativo';
    }
    
    return (
      <span className={`badge ${badgeClass}`}>
        <FontAwesomeIcon icon={icon} className="mr-1" />
        {texto}
      </span>
    );
  };

  // Componente de Carregamento
  const Carregando = () => (
    <div className="estado-carregando">
      <div className="spinner">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
      <p>A carregar procedimentos...</p>
    </div>
  );

  // Gerar números das páginas
  const gerarNumerosPagina = () => {
    const paginas = [];
    const maxPaginasVisiveis = 3;
    
    let startPage = Math.max(1, paginaAtual - Math.floor(maxPaginasVisiveis / 2));
    let endPage = Math.min(totalPaginas, startPage + maxPaginasVisiveis - 1);
    
    if (endPage - startPage + 1 < maxPaginasVisiveis) {
      startPage = Math.max(1, endPage - maxPaginasVisiveis + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  return (
    <div className="procedimentos-container">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon={faClipboardCheck} className="titulo-icone" />
            Procedimentos
          </h1>
          <p className="page-subtitle">Gerencie procedimentos operacionais e documentos técnicos</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faFileExport} /> Exportar
          </button>
          <button className="btn-primario" onClick={() => navigate('/documentos/procedimentos/novo')}>
            <FontAwesomeIcon icon={faPlus} /> Novo Procedimento
          </button>
        </div>
      </div>

      {/* Navegação secundária contextual */}
      <div className="tabs-navegacao">
        <Link to="/documentos" className="tab-nav">
          <FontAwesomeIcon icon={faFileAlt} /> Documentos
        </Link>
        <Link to="/documentos/rfis" className="tab-nav">
          <FontAwesomeIcon icon={faQuestionCircle} /> Pedidos de Informação
        </Link>
        <Link to="/documentos/procedimentos" className="tab-nav active">
          <FontAwesomeIcon icon={faClipboardCheck} /> Procedimentos
          <span className="contador">{procedimentos.length}</span>
        </Link>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label htmlFor="filtro-categoria">Categoria</label>
          <select
            id="filtro-categoria"
            className="select-control"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas as categorias</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-departamento">Departamento</label>
          <select
            id="filtro-departamento"
            className="select-control"
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
          >
            <option value="todos">Todos os departamentos</option>
            {departamentos.map((departamento, index) => (
              <option key={index} value={departamento}>{departamento}</option>
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
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="em_revisao">Em Revisão</option>
            <option value="em_aprovacao">Em Aprovação</option>
            <option value="obsoleto">Obsoletos</option>
          </select>
        </div>

        <div className="filtro-grupo ordenacao">
          <label htmlFor="ordenacao">Ordenar por</label>
          <div className="ordenacao-opcoes">
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'data_atualizacao' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('data_atualizacao')}
            >
              Data {ordenacao.campo === 'data_atualizacao' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'codigo' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('codigo')}
            >
              Código {ordenacao.campo === 'codigo' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
          </div>
        </div>

        <div className="filtro-grupo pesquisa">
          <label htmlFor="pesquisa">Pesquisar</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon={faSearch} className="icone-pesquisa" />
            <input
              type="text"
              id="pesquisa"
              className="input-control"
              placeholder="Código, título, autor..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            {pesquisa && (
              <button
                className="botao-limpar-pesquisa"
                onClick={() => setPesquisa('')}
                aria-label="Limpar pesquisa"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Procedimentos */}
      <div className="card-container procedimentos-tabela">
        {carregando ? (
          <Carregando />
        ) : (
          <>
            <div className="tabela-header">
              <div className="tabela-info">
                <h3>Lista de Procedimentos</h3>
                <span className="contador-resultados">
                  {procedimentosFiltrados.length} procedimentos encontrados
                </span>
              </div>
              
              <div className="tabela-acoes">
                <div className="resultados-por-pagina">
                  <span>Mostrar:</span>
                  <select 
                    className="select-control select-mini"
                    onChange={(e) => {
                      const novoItensPorPagina = parseInt(e.target.value);
                      setTotalPaginas(Math.ceil(procedimentosFiltrados.length / novoItensPorPagina));
                      setPaginaAtual(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
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
        
            {procedimentosFiltrados.length === 0 ? (
              <div className="tabela-vazia">
                <FontAwesomeIcon icon={faClipboardCheck} size="3x" />
                <p>Nenhum procedimento encontrado com os critérios selecionados.</p>
                <button
                  className="btn-secundario"
                  onClick={limparFiltros}
                >
                  <FontAwesomeIcon icon={faSyncAlt} /> Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="tabela-responsiva">
                  <table className="tabela-dados">
                    <thead>
                      <tr>
                        <th onClick={() => ordenarPor('codigo')} className="th-ordenavel">
                          Código
                          {ordenacao.campo === 'codigo' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('titulo')} className="th-ordenavel">
                          Título
                          {ordenacao.campo === 'titulo' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('categoria')} className="th-ordenavel">
                          Categoria
                          {ordenacao.campo === 'categoria' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('departamento')} className="th-ordenavel">
                          Departamento
                          {ordenacao.campo === 'departamento' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('version')} className="th-ordenavel">
                          Versão
                          {ordenacao.campo === 'version' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('data_atualizacao')} className="th-ordenavel">
                          Última Atualização
                          {ordenacao.campo === 'data_atualizacao' && (
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
                        <th className="th-acoes">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procedimentosAtuais.map((proc) => (
                        <tr key={proc.id}>
                          <td className="td-codigo">
                            <span className="codigo-badge">{proc.codigo}</span>
                          </td>
                          <td className="td-nome">
                            <span className="nome-procedimento">{proc.titulo}</span>
                            {proc.author && (
                              <span className="autor-tag">
                                <FontAwesomeIcon icon={faUserAlt} /> {proc.author}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="categoria-badge">
                              {proc.categoria}
                            </span>
                          </td>
                          <td>
                            <span className="departamento-label">
                              <FontAwesomeIcon icon={faBuilding} className="icone-pequeno" />
                              {proc.departamento}
                            </span>
                          </td>
                          <td>
                            <span className="versao-badge">{proc.version}</span>
                          </td>
                          <td>
                            <span className="data-com-icone">
                              <FontAwesomeIcon icon={faCalendarAlt} className="icone-pequeno" />
                              {new Date(proc.data_atualizacao).toLocaleDateString('pt-PT')}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={proc.status} />
                          </td>
                          <td className="td-acoes">
                            <div className="acoes-dropdown">
                              <button 
                                className="btn-acao-combinado" 
                                onClick={() => navigate(`/documentos/procedimentos/${proc.id}`)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                                <span>Ver</span>
                                <span className="separador"></span>
                                <FontAwesomeIcon icon={faEllipsisV} onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(proc.id);
                                }} />
                              </button>
                              
                              {procedimentoMenu === proc.id && (
                                <div className="menu-dropdown">
                                  <Link to={`/documentos/procedimentos/${proc.id}/editar`} className="menu-item">
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                  </Link>
                                  <Link to={`/documentos/procedimentos/${proc.id}/historico`} className="menu-item">
                                    <FontAwesomeIcon icon={faHistory} /> Histórico de Versões
                                  </Link>
                                  <button className="menu-item">
                                    <FontAwesomeIcon icon={faDownload} /> Descarregar PDF
                                  </button>
                                  <div className="menu-separador"></div>
                                  <button className="menu-item">
                                    <FontAwesomeIcon icon={faCopy} /> Duplicar
                                  </button>
                                  {proc.status === 'ativo' && (
                                    <button className="menu-item">
                                      <FontAwesomeIcon icon={faCog} /> Iniciar Revisão
                                    </button>
                                  )}
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
                    Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, procedimentosFiltrados.length)} de {procedimentosFiltrados.length} procedimentos
                  </div>
                  
                  <div className="paginacao-controles">
                    <button 
                      className="btn-paginacao" 
                      onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                      disabled={paginaAtual === 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} /> Anterior
                    </button>
                    
                    <div className="paginas">
                      {paginaAtual > 2 && totalPaginas > 3 && (
                        <>
                          <button 
                            className="pagina" 
                            onClick={() => setPaginaAtual(1)}
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
                          onClick={() => setPaginaAtual(numero)}
                        >
                          {numero}
                        </button>
                      ))}
                      
                      {paginaAtual < totalPaginas - 1 && totalPaginas > 3 && (
                        <>
                          {paginaAtual < totalPaginas - 2 && <span className="pagina-ellipsis">...</span>}
                          <button 
                            className="pagina" 
                            onClick={() => setPaginaAtual(totalPaginas)}
                          >
                            {totalPaginas}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button 
                      className="btn-paginacao" 
                      onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
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
      
      {/* Modal de Filtros Avançados */}
      {mostrarFiltrosAvancados && (
        <div className="filtros-avancados-overlay">
          <div className="filtros-avancados-modal">
            <div className="filtros-avancados-header">
              <h3><FontAwesomeIcon icon={faFilter} /> Filtros Avançados</h3>
              <button 
                className="btn-fechar" 
                onClick={() => setMostrarFiltrosAvancados(false)}
              >
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
                <h4>Versão</h4>
                <div className="filtro-opcoes">
                  <div className="filtro-opcao">
                    <input type="checkbox" id="versao-1" />
                    <label htmlFor="versao-1">Versão 1.x</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="versao-2" />
                    <label htmlFor="versao-2">Versão 2.x</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="versao-3" />
                    <label htmlFor="versao-3">Versão 3.x e superior</label>
                  </div>
                </div>
              </div>
              
              <div className="filtro-secao">
                <h4>Autor</h4>
                <div className="filtro-campo">
                  <input type="text" className="input-control" placeholder="Filtrar por autor..." />
                </div>
              </div>
              
              <div className="filtro-secao">
                <h4>Outros</h4>
                <div className="filtro-opcoes">
                  <div className="filtro-opcao">
                    <input type="checkbox" id="apenas-ultimas-versoes" />
                    <label htmlFor="apenas-ultimas-versoes">Mostrar apenas últimas versões</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="inclui-obsoletos" />
                    <label htmlFor="inclui-obsoletos">Incluir procedimentos obsoletos</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="filtros-avancados-footer">
              <button 
                className="btn-secundario" 
                onClick={() => setMostrarFiltrosAvancados(false)}
              >
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

export default ListaProcedimentos;