import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTimes, faChevronLeft, faChevronRight, faFilter,
  faEye, faEdit, faReply, faQuestionCircle, faFileAlt, 
  faPlus, faFileExport, faDownload, faCheckCircle, faSpinner,
  faExclamationTriangle, faInfoCircle, faSyncAlt, faClipboardCheck,
  faHistory, faChartLine, faCalendarAlt, faUserAlt, faBuilding,
  faUserTie, faExternalLinkAlt, faSortAmountDown, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Documentos.css';

// Tipo para RFI
interface RFI {
  id: number;
  assunto: string;
  obra: string;
  emissor: string;
  destinatario: string;
  data_emissao: string;
  data_resposta?: string;
  status: string;
  descricao?: string;
  urgencia?: string;
  documentos_relacionados?: number[];
}

// Tipo para Obra
interface Obra {
  id: number;
  nome: string;
}

const ListaRFIs: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroObra, setFiltroObra] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroDestinatario, setFiltroDestinatario] = useState<string>('todos');
  const [pesquisa, setPesquisa] = useState<string>('');
  const [obras, setObras] = useState<Obra[]>([]);
  const [destinatarios, setDestinatarios] = useState<string[]>([]);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [rfiMenu, setRfiMenu] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'data_emissao',
    direcao: 'desc'
  });

  // Mock de dados
  useEffect(() => {
    // Simulação de carregamento
    setCarregando(true);
    
    setTimeout(() => {
      // Dados de RFIs
      const rfisMock: RFI[] = [
        {
          id: 101,
          assunto: 'Especificação técnica de armaduras',
          obra: 'Obra Ferroviária Setúbal',
          emissor: 'Ricardo Pereira',
          destinatario: 'Projectista',
          data_emissao: '2025-04-10',
          data_resposta: '2025-04-15',
          status: 'respondido',
          descricao: 'Necessitamos de informação detalhada sobre as armaduras a aplicar nos pilares P12 a P18.',
          urgencia: 'alta',
          documentos_relacionados: [1, 4]
        },
        {
          id: 102,
          assunto: 'Clarificação de método construtivo',
          obra: 'Metro de Lisboa - Expansão',
          emissor: 'João Silva',
          destinatario: 'Direcção de Obra',
          data_emissao: '2025-04-05',
          status: 'pendente',
          descricao: 'Solicitamos clarificação sobre o método construtivo a aplicar na zona de interface com estruturas existentes.',
          urgencia: 'média'
        },
        {
          id: 103,
          assunto: 'Detalhe de ligação de estrutura metálica',
          obra: 'Ampliação Terminal Portuário',
          emissor: 'Carlos Oliveira',
          destinatario: 'Projectista',
          data_emissao: '2025-03-28',
          data_resposta: '2025-04-02',
          status: 'respondido',
          descricao: 'Necessitamos dos detalhes de ligação entre as vigas metálicas VM-12 e os pilares de betão existentes.',
          urgencia: 'baixa',
          documentos_relacionados: [3]
        },
        {
          id: 104,
          assunto: 'Requisitos de impermeabilização',
          obra: 'Reabilitação Urbana Baixa',
          emissor: 'Ana Ferreira',
          destinatario: 'Consultores Externos',
          data_emissao: '2025-04-12',
          status: 'pendente',
          descricao: 'Solicitamos especificações detalhadas para o sistema de impermeabilização a aplicar nas coberturas transitáveis.',
          urgencia: 'alta'
        },
        {
          id: 105,
          assunto: 'Compatibilização de traçados MEP',
          obra: 'Obra Ferroviária Setúbal',
          emissor: 'Miguel Santos',
          destinatario: 'Coordenação de Projecto',
          data_emissao: '2025-04-08',
          status: 'pendente',
          descricao: 'É necessário resolver conflitos entre traçados de AVAC e instalações elétricas no corredor técnico K12.',
          urgencia: 'média'
        },
        {
          id: 106,
          assunto: 'Alternativa para material em rutura de stock',
          obra: 'Metro de Lisboa - Expansão',
          emissor: 'Sofia Costa',
          destinatario: 'Fiscalização',
          data_emissao: '2025-03-15',
          data_resposta: '2025-03-20',
          status: 'respondido',
          descricao: 'Solicitamos aprovação para material alternativo visto que o especificado em projeto se encontra em rutura de stock.',
          urgencia: 'alta'
        },
        {
          id: 107,
          assunto: 'Validação de proposta de alteração',
          obra: 'Ampliação Terminal Portuário',
          emissor: 'Pedro Martins',
          destinatario: 'Dono de Obra',
          data_emissao: '2025-04-01',
          status: 'finalizado',
          data_resposta: '2025-04-10',
          descricao: 'Proposta de alteração ao layout da zona administrativa para otimização de espaço.',
          urgencia: 'média'
        }
      ];
      
      // Dados de obras
      const obrasMock: Obra[] = [
        { id: 1, nome: 'Obra Ferroviária Setúbal' },
        { id: 2, nome: 'Metro de Lisboa - Expansão' },
        { id: 3, nome: 'Ampliação Terminal Portuário' },
        { id: 4, nome: 'Reabilitação Urbana Baixa' }
      ];
      
      // Extrair destinatários únicos
      const destinatariosUnicos = [...new Set(rfisMock.map(rfi => rfi.destinatario))];
      
      // Calcular número total de páginas
      const totalPags = Math.ceil(rfisMock.length / itensPorPagina);
      
      setRFIs(rfisMock);
      setObras(obrasMock);
      setDestinatarios(destinatariosUnicos);
      setTotalPaginas(totalPags);
      setCarregando(false);
    }, 800);
  }, [itensPorPagina]);

  // Filtrar RFIs com base nos critérios
  const rfisFiltrados = rfis.filter(rfi => {
    // Filtro por obra
    if (filtroObra !== 'todas' && rfi.obra !== filtroObra) {
      return false;
    }
    
    // Filtro por status
    if (filtroStatus !== 'todos' && rfi.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por destinatário
    if (filtroDestinatario !== 'todos' && rfi.destinatario !== filtroDestinatario) {
      return false;
    }
    
    // Filtro por termo de pesquisa
    if (pesquisa) {
      const termoPesquisa = pesquisa.toLowerCase();
      return (
        rfi.assunto.toLowerCase().includes(termoPesquisa) ||
        rfi.emissor.toLowerCase().includes(termoPesquisa) ||
        rfi.destinatario.toLowerCase().includes(termoPesquisa) ||
        rfi.id.toString().includes(termoPesquisa)
      );
    }
    
    return true;
  });

  // Ordenar RFIs
  const rfisOrdenados = [...rfisFiltrados].sort((a, b) => {
    let valorA, valorB;
    
    switch (ordenacao.campo) {
      case 'id':
        valorA = a.id;
        valorB = b.id;
        break;
      case 'data_emissao':
        valorA = new Date(a.data_emissao);
        valorB = new Date(b.data_emissao);
        break;
      case 'assunto':
        valorA = a.assunto;
        valorB = b.assunto;
        break;
      case 'status':
        valorA = a.status;
        valorB = b.status;
        break;
      case 'emissor':
        valorA = a.emissor;
        valorB = b.emissor;
        break;
      default:
        valorA = a[ordenacao.campo as keyof RFI];
        valorB = b[ordenacao.campo as keyof RFI];
    }
    
    const safeCompare = (a: any, b: any, asc: boolean) => {
        if (a == null) return 1;
        if (b == null) return -1;
        return asc ? (a > b ? 1 : -1) : (a < b ? 1 : -1);
      };
      
      // E substituir no sort:
      return safeCompare(valorA, valorB, ordenacao.direcao === 'asc');
      
  });

  // Paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const rfisAtuais = rfisOrdenados.slice(indiceInicial, indiceFinal);

  // Limpar filtros
  const limparFiltros = () => {
    setFiltroObra('todas');
    setFiltroStatus('todos');
    setFiltroDestinatario('todos');
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
    setRfiMenu(rfiMenu === id ? null : id);
  };

  // Componente para exibir o status do RFI
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = '';
    let icon;
    let texto = '';
    
    switch (status) {
      case 'pendente':
        badgeClass = 'status-pendente';
        icon = faExclamationTriangle;
        texto = 'Pendente';
        break;
      case 'respondido':
        badgeClass = 'status-respondido';
        icon = faCheckCircle;
        texto = 'Respondido';
        break;
      case 'finalizado':
        badgeClass = 'status-finalizado';
        icon = faCheckCircle;
        texto = 'Finalizado';
        break;
      default:
        badgeClass = 'status-pendente';
        icon = faExclamationTriangle;
        texto = 'Pendente';
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
      <p>A carregar pedidos de informação...</p>
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
    <div className="rfis-container">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon={faQuestionCircle} className="titulo-icone" />
            Pedidos de Informação (RFIs)
          </h1>
          <p className="page-subtitle">Gerencie e acompanhe pedidos de informação relativos a projetos</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faFileExport} /> Exportar
          </button>
          <button className="btn-primario" onClick={() => navigate('/documentos/rfi/novo')}>
            <FontAwesomeIcon icon={faPlus} /> Novo RFI
          </button>
        </div>
      </div>

      {/* Navegação secundária contextual */}
      <div className="tabs-navegacao">
        <Link to="/documentos" className="tab-nav">
          <FontAwesomeIcon icon={faFileAlt} /> Documentos
        </Link>
        <Link to="/documentos/rfis" className="tab-nav active">
          <FontAwesomeIcon icon={faQuestionCircle} /> Pedidos de Informação
          <span className="contador">{rfis.length}</span>
        </Link>
        <Link to="/documentos/procedimentos" className="tab-nav">
          <FontAwesomeIcon icon={faClipboardCheck} /> Procedimentos
        </Link>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label htmlFor="filtro-obra">Obra</label>
          <select
            id="filtro-obra"
            className="select-control"
            value={filtroObra}
            onChange={(e) => setFiltroObra(e.target.value)}
          >
            <option value="todas">Todas as obras</option>
            {obras.map(obra => (
              <option key={obra.id} value={obra.nome}>{obra.nome}</option>
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
            <option value="pendente">Pendentes</option>
            <option value="respondido">Respondidos</option>
            <option value="finalizado">Finalizados</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-destinatario">Destinatário</label>
          <select
            id="filtro-destinatario"
            className="select-control"
            value={filtroDestinatario}
            onChange={(e) => setFiltroDestinatario(e.target.value)}
          >
            <option value="todos">Todos</option>
            {destinatarios.map((destinatario, index) => (
              <option key={index} value={destinatario}>{destinatario}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo ordenacao">
          <label htmlFor="ordenacao">Ordenar por</label>
          <div className="ordenacao-opcoes">
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'data_emissao' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('data_emissao')}
            >
              Data {ordenacao.campo === 'data_emissao' && (
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
          <label htmlFor="pesquisa">Pesquisar</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon={faSearch} className="icone-pesquisa" />
            <input
              type="text"
              id="pesquisa"
              className="input-control"
              placeholder="Assunto, emissor, destinatário..."
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

      {/* Tabela de RFIs */}
      <div className="card-container rfis-tabela">
        {carregando ? (
          <Carregando />
        ) : (
          <>
            <div className="tabela-header">
              <div className="tabela-info">
                <h3>Lista de Pedidos de Informação</h3>
                <span className="contador-resultados">
                  {rfisFiltrados.length} pedidos encontrados
                </span>
              </div>
              
              <div className="tabela-acoes">
                <div className="resultados-por-pagina">
                  <span>Mostrar:</span>
                  <select 
                    className="select-control select-mini"
                    onChange={(e) => {
                      const novoItensPorPagina = parseInt(e.target.value);
                      setTotalPaginas(Math.ceil(rfisFiltrados.length / novoItensPorPagina));
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
        
            {rfisFiltrados.length === 0 ? (
              <div className="tabela-vazia">
                <FontAwesomeIcon icon={faQuestionCircle} size="3x" />
                <p>Nenhum pedido de informação encontrado com os critérios selecionados.</p>
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
                        <th onClick={() => ordenarPor('id')} className="th-ordenavel">
                          RFI #
                          {ordenacao.campo === 'id' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('assunto')} className="th-ordenavel">
                          Assunto
                          {ordenacao.campo === 'assunto' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('obra')} className="th-ordenavel">
                          Obra
                          {ordenacao.campo === 'obra' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('emissor')} className="th-ordenavel">
                          Emissor
                          {ordenacao.campo === 'emissor' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('destinatario')} className="th-ordenavel">
                          Destinatário
                          {ordenacao.campo === 'destinatario' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th onClick={() => ordenarPor('data_emissao')} className="th-ordenavel">
                          Data Emissão
                          {ordenacao.campo === 'data_emissao' && (
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
                      {rfisAtuais.map((rfi) => (
                        <tr key={rfi.id}>
                          <td className="td-id">
                            <span className="id-badge">RFI-{rfi.id}</span>
                          </td>
                          <td className="td-nome">
                            <span className="nome-rfi">{rfi.assunto}</span>
                            {rfi.urgencia && (
                              <span className={`urgencia-tag urgencia-${rfi.urgencia}`}>
                                {rfi.urgencia === 'alta' ? 'Urgente' : 
                                 rfi.urgencia === 'média' ? 'Normal' : 'Baixa'}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="obra-label">
                              <FontAwesomeIcon icon={faBuilding} className="icone-pequeno" />
                              {rfi.obra}
                            </span>
                          </td>
                          <td>
                            <span className="pessoa-label">
                              <FontAwesomeIcon icon={faUserAlt} className="icone-pequeno" />
                              {rfi.emissor}
                            </span>
                          </td>
                          <td>
                            <span className="pessoa-label">
                              <FontAwesomeIcon icon={faUserTie} className="icone-pequeno" />
                              {rfi.destinatario}
                            </span>
                          </td>
                          <td>
                            <span className="data-com-icone">
                              <FontAwesomeIcon icon={faCalendarAlt} className="icone-pequeno" />
                              {new Date(rfi.data_emissao).toLocaleDateString('pt-PT')}
                            </span>
                            {rfi.data_resposta && (
                              <span className="data-resposta">
                                Respondido: {new Date(rfi.data_resposta).toLocaleDateString('pt-PT')}
                              </span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={rfi.status} />
                          </td>
                          <td className="td-acoes">
                            <div className="acoes-dropdown">
                              <button 
                                className="btn-acao-combinado" 
                                onClick={() => navigate(`/documentos/rfi/${rfi.id}`)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                                <span>Ver</span>
                                <span className="separador"></span>
                                <FontAwesomeIcon icon={faEllipsisV} onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(rfi.id);
                                }} />
                              </button>
                              
                              {rfiMenu === rfi.id && (
                                <div className="menu-dropdown">
                                  <Link to={`/documentos/rfi/${rfi.id}/editar`} className="menu-item">
                                    <FontAwesomeIcon icon={faEdit} /> Editar
                                  </Link>
                                  {rfi.status === 'pendente' && (
                                    <Link to={`/documentos/rfi/${rfi.id}/responder`} className="menu-item">
                                      <FontAwesomeIcon icon={faReply} /> Responder
                                    </Link>
                                  )}
                                  <Link to={`/documentos/rfi/${rfi.id}/historico`} className="menu-item">
                                    <FontAwesomeIcon icon={faHistory} /> Histórico
                                  </Link>
                                  <div className="menu-separador"></div>
                                  <button className="menu-item">
                                    <FontAwesomeIcon icon={faDownload} /> Exportar PDF
                                  </button>
                                  <button className="menu-item">
                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Partilhar
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
                    Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, rfisFiltrados.length)} de {rfisFiltrados.length} pedidos
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
                <h4>Urgência</h4>
                <div className="filtro-opcoes">
                  <div className="filtro-opcao">
                    <input type="checkbox" id="urgencia-alta" />
                    <label htmlFor="urgencia-alta">Alta</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="urgencia-media" />
                    <label htmlFor="urgencia-media">Média</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="urgencia-baixa" />
                    <label htmlFor="urgencia-baixa">Baixa</label>
                  </div>
                </div>
              </div>
              
              <div className="filtro-secao">
                <h4>Documentos Relacionados</h4>
                <div className="filtro-opcao">
                  <input type="checkbox" id="com-documentos" />
                  <label htmlFor="com-documentos">Mostrar apenas RFIs com documentos anexados</label>
                </div>
              </div>
              
              <div className="filtro-secao">
                <h4>Outros</h4>
                <div className="filtro-opcoes">
                  <div className="filtro-opcao">
                    <input type="checkbox" id="apenas-meus" />
                    <label htmlFor="apenas-meus">Apenas RFIs que criei</label>
                  </div>
                  <div className="filtro-opcao">
                    <input type="checkbox" id="pendentes-resposta" />
                    <label htmlFor="pendentes-resposta">Pendentes de resposta há mais de 7 dias</label>
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

export default ListaRFIs;