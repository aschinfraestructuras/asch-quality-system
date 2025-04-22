
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faTimes, faChevronLeft, faChevronRight, 
  faEye, faStar, faEllipsisV, faEnvelope, faPhone,
  faPlus, faFileDownload, faFilter, faSortAmountDown,
  faInfoCircle, faEdit, faHistory, faChartLine, faHeart,
  faTrashAlt, faBan , faHandshake, faSync, faInbox, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Fornecedores.css';
import Tooltip from '../components/common/Tooltip';

// Tipagem para os fornecedores
interface Fornecedor {
  id: number;
  nome: string;
  tipo: string;
  classificacao: number;
  email: string;
  telefone: string;
  ultimo_pedido: string;
  status: string;
  endereco?: string;
  nif?: string;
  materiais_fornecidos?: string[];
  responsavel?: string;
  contrato_validade?: string;
  notas?: string;
}

const ListaFornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [fornecedorMenu, setFornecedorMenu] = useState<number | null>(null);
  const [ordenacao, setOrdenacao] = useState<{campo: string, direcao: 'asc' | 'desc'}>({
    campo: 'nome',
    direcao: 'asc'
  });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);
  const [carregando, setCarregando] = useState(true);

  // 🔧 MOCK TEMPORÁRIO (substituível por fetch futuramente)
  useEffect(() => {
    // Simulação de carregamento
    setCarregando(true);
    
    setTimeout(() => {
      const mock: Fornecedor[] = [
        {
          id: 1,
          nome: 'Betonilha Express',
          tipo: 'Material',
          classificacao: 4.3,
          email: 'betonilha@exemplo.com',
          telefone: '912 345 678',
          ultimo_pedido: '2025-03-12',
          status: 'ativo',
          endereco: 'Rua dos Construtores, 45, Lisboa',
          nif: '507123456',
          materiais_fornecidos: ['Cimento', 'Betão', 'Areia'],
          responsavel: 'Manuel Silva',
          contrato_validade: '2026-12-31',
          notas: 'Fornecedor preferencial para projetos de grande escala.'
        },
        {
          id: 2,
          nome: 'Ferragens Lisboa',
          tipo: 'Equipamento',
          classificacao: 3.7,
          email: 'ferragens@lisboa.pt',
          telefone: '934 567 890',
          ultimo_pedido: '2025-01-05',
          status: 'inativo',
          endereco: 'Av. da Liberdade, 120, Lisboa',
          nif: '508234567',
          materiais_fornecidos: ['Ferramentas Elétricas', 'Material de Segurança', 'Ferramentas Manuais'],
          responsavel: 'Ana Rodrigues',
          contrato_validade: '2025-06-30',
          notas: 'Contrato em processo de renovação.'
        },
        {
          id: 3,
          nome: 'Madeiras do Norte',
          tipo: 'Material',
          classificacao: 4.8,
          email: 'info@madeirasnorte.pt',
          telefone: '252 789 123',
          ultimo_pedido: '2025-02-28',
          status: 'ativo',
          endereco: 'Zona Industrial, Lote 7, Braga',
          nif: '505678901',
          materiais_fornecidos: ['Madeira Tratada', 'Placas MDF', 'Contraplacados'],
          responsavel: 'João Pereira',
          contrato_validade: '2027-01-15',
          notas: 'Excelente qualidade de materiais, entrega sempre pontual.'
        },
        {
          id: 4,
          nome: 'Alumínios & Vidros Modernos',
          tipo: 'Material',
          classificacao: 4.1,
          email: 'comercial@avm.pt',
          telefone: '919 876 543',
          ultimo_pedido: '2025-03-20',
          status: 'ativo',
          endereco: 'Rua Industrial, 78, Setúbal',
          nif: '506543210',
          materiais_fornecidos: ['Alumínio', 'Vidro Temperado', 'Espelhos'],
          responsavel: 'Sofia Costa',
          contrato_validade: '2026-08-22',
          notas: 'Especialista em soluções personalizadas.'
        },
        {
          id: 5,
          nome: 'TechConstrução',
          tipo: 'Equipamento',
          classificacao: 3.9,
          email: 'vendas@techconstrucao.pt',
          telefone: '939 123 456',
          ultimo_pedido: '2024-12-15',
          status: 'ativo',
          endereco: 'Parque Empresarial, Bloco D, Porto',
          nif: '509876543',
          materiais_fornecidos: ['Equipamentos de Medição', 'Sistemas de Segurança', 'Automação'],
          responsavel: 'Ricardo Mendes',
          contrato_validade: '2026-03-10',
          notas: 'Fornecedor de produtos tecnológicos inovadores para construção.'
        },
        {
          id: 6,
          nome: 'Cerâmicas do Sul',
          tipo: 'Material',
          classificacao: 4.5,
          email: 'info@ceramicassul.pt',
          telefone: '289 654 321',
          ultimo_pedido: '2025-02-10',
          status: 'ativo',
          endereco: 'Estrada Nacional 125, Km 20, Faro',
          nif: '504321987',
          materiais_fornecidos: ['Azulejos', 'Mosaicos', 'Porcelanatos'],
          responsavel: 'Marta Santos',
          contrato_validade: '2026-11-30',
          notas: 'Produtos de alta qualidade com design exclusivo.'
        },
        {
          id: 7,
          nome: 'Aluguer de Máquinas RPT',
          tipo: 'Equipamento',
          classificacao: 3.4,
          email: 'reservas@rpt.pt',
          telefone: '226 789 012',
          ultimo_pedido: '2024-10-30',
          status: 'inativo',
          endereco: 'Zona Industrial, Lote 12, Maia',
          nif: '507654321',
          materiais_fornecidos: ['Retroescavadoras', 'Gruas', 'Plataformas Elevatórias'],
          responsavel: 'Paulo Torres',
          contrato_validade: '2025-04-15',
          notas: 'Serviço irregular, atrasos frequentes nas entregas.'
        }
      ];
      
      setFornecedores(mock);
      setCarregando(false);
    }, 800);
  }, []);

  // 🔎 Ordenação e Filtragem
  const fornecedoresProcessados = [...fornecedores]
    .sort((a, b) => {
      if (ordenacao.campo === 'nome') {
        return ordenacao.direcao === 'asc' 
          ? a.nome.localeCompare(b.nome) 
          : b.nome.localeCompare(a.nome);
      } else if (ordenacao.campo === 'classificacao') {
        return ordenacao.direcao === 'asc' 
          ? a.classificacao - b.classificacao 
          : b.classificacao - a.classificacao;
      } else if (ordenacao.campo === 'ultimo_pedido') {
        return ordenacao.direcao === 'asc' 
          ? new Date(a.ultimo_pedido).getTime() - new Date(b.ultimo_pedido).getTime() 
          : new Date(b.ultimo_pedido).getTime() - new Date(a.ultimo_pedido).getTime();
      }
      return 0;
    })
    .filter((f) => {
      const tipoOK = filtroTipo === 'todos' || f.tipo === filtroTipo;
      const statusOK = filtroStatus === 'todos' || f.status === filtroStatus;
      const pesquisaOK =
        termoPesquisa === '' || 
        f.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        f.email.toLowerCase().includes(termoPesquisa.toLowerCase());

      return tipoOK && statusOK && pesquisaOK;
    });

  // Paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensPaginaAtual = fornecedoresProcessados.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(fornecedoresProcessados.length / itensPorPagina);

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

  // Função para abrir/fechar menu de ações do fornecedor
  const toggleMenu = (id: number) => {
    setFornecedorMenu(fornecedorMenu === id ? null : id);
  };

  // Componente de loading
  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <div className="spinner">
        <FontAwesomeIcon icon={faFilter} spin />
      </div>
      <p>A carregar fornecedores...</p>
    </div>
  );

  // Componente de estrelas para classificação
  const Estrelas = ({ valor }: { valor: number }) => {
    return (
      <div className="estrelas-container">
        {[1, 2, 3, 4, 5].map(estrela => (
          <span key={estrela} className="estrela">
            {valor >= estrela ? (
              <FontAwesomeIcon icon={faStar} className="estrela-preenchida" />
            ) : valor >= estrela - 0.5 ? (
              <FontAwesomeIcon icon={faStar} className="estrela-meia" />
            ) : (
              <FontAwesomeIcon icon={faStar} className="estrela-vazia" />
            )}
          </span>
        ))}
        <span className="classificacao-valor">{valor.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="fornecedores-container">
      {/* Cabeçalho da página */}
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon={faHandshake} className="titulo-icone" />
            Fornecedores
          </h1>
          <p className="page-subtitle">Gerencie e avalie os fornecedores da sua empresa</p>
        </div>
        
        <div className="page-actions">
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faFileDownload} /> Exportar
          </button>
          <button className="btn-primario">
            <FontAwesomeIcon icon={faPlus} /> Novo Fornecedor
          </button>
        </div>
      </div>

      {/* Filtros e pesquisa */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label htmlFor="filtro-tipo">Tipo</label>
          <select
            id="filtro-tipo"
            className="select-control"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os tipos</option>
            <option value="Material">Material</option>
            <option value="Equipamento">Equipamento</option>
            <option value="Serviço">Serviço</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtro-status">Status</label>
          <select
            id="filtro-status"
            className="select-control"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <div className="filtro-grupo ordenacao">
          <label htmlFor="ordenacao">Ordenar por</label>
          <div className="ordenacao-opcoes">
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'nome' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('nome')}
            >
              Nome {ordenacao.campo === 'nome' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'classificacao' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('classificacao')}
            >
              Classificação {ordenacao.campo === 'classificacao' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
            <button 
              className={`btn-ordenacao ${ordenacao.campo === 'ultimo_pedido' ? 'ativo' : ''}`}
              onClick={() => ordenarPor('ultimo_pedido')}
            >
              Data {ordenacao.campo === 'ultimo_pedido' && (
                <FontAwesomeIcon icon={faSortAmountDown} 
                  className={ordenacao.direcao === 'desc' ? 'invertido' : ''} 
                />
              )}
            </button>
          </div>
        </div>

        <div className="filtro-grupo pesquisa">
          <label htmlFor="pesquisa-fornecedor">Pesquisar</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon={faSearch} className="icone-pesquisa" />
            <input
              type="text"
              id="pesquisa-fornecedor"
              className="input-control"
              placeholder="Nome, email ou informação..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            {termoPesquisa && (
              <button
                className="botao-limpar-pesquisa"
                onClick={() => setTermoPesquisa('')}
                aria-label="Limpar pesquisa"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de fornecedores */}
      <div className="card-container fornecedores-tabela">
        {carregando ? (
          <LoadingOverlay />
        ) : (
          <>
            <div className="tabela-header">
              <div className="tabela-info">
                <h3>Lista de Fornecedores</h3>
                <span className="contador-resultados">
                  {fornecedoresProcessados.length} fornecedores encontrados
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
                  <FontAwesomeIcon icon={faSync} />
                </button>
                
                <button className="btn-icone" title="Filtros avançados">
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              </div>
            </div>
        
            {fornecedoresProcessados.length === 0 ? (
              <div className="tabela-vazia">
                <FontAwesomeIcon icon={faInbox} size="3x" />
                <p>Nenhum fornecedor encontrado com os critérios selecionados.</p>
                <button
                  className="btn-secundario"
                  onClick={() => {
                    setFiltroTipo('todos');
                    setFiltroStatus('todos');
                    setTermoPesquisa('');
                  }}
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
                        <th onClick={() => ordenarPor('nome')} className="th-ordenavel">
                          Nome
                          {ordenacao.campo === 'nome' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th>Tipo</th>
                        <th onClick={() => ordenarPor('classificacao')} className="th-ordenavel">
                          Classificação
                          {ordenacao.campo === 'classificacao' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                          <Tooltip conteudo="Classificação baseada em critérios de qualidade, cumprimento de prazos e preço">
                            <FontAwesomeIcon icon={faInfoCircle} className="icone-info" />
                          </Tooltip>
                        </th>
                        <th>Contacto</th>
                        <th onClick={() => ordenarPor('ultimo_pedido')} className="th-ordenavel">
                          Último Pedido
                          {ordenacao.campo === 'ultimo_pedido' && (
                            <FontAwesomeIcon 
                              icon={faSortAmountDown} 
                              className={`icone-ordenacao ${ordenacao.direcao === 'desc' ? 'invertido' : ''}`} 
                            />
                          )}
                        </th>
                        <th>Status</th>
                        <th className="th-acoes">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensPaginaAtual.map((fornecedor) => (
                        <tr key={fornecedor.id} className={fornecedor.status === 'inativo' ? 'linha-inativa' : ''}>
                          <td className="td-nome">
                            <span className="nome-fornecedor">{fornecedor.nome}</span>
                            {fornecedor.materiais_fornecidos && (
                              <div className="materiais-tags">
                                {fornecedor.materiais_fornecidos.slice(0, 2).map((material, idx) => (
                                  <span key={idx} className="material-tag">{material}</span>
                                ))}
                                {fornecedor.materiais_fornecidos.length > 2 && (
                                  <span className="material-tag mais">+{fornecedor.materiais_fornecidos.length - 2}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge tipo-${fornecedor.tipo.toLowerCase()}`}>
                              {fornecedor.tipo}
                            </span>
                          </td>
                          <td>
                            <Estrelas valor={fornecedor.classificacao} />
                          </td>
                          <td>
                            <div className="contacto-info">
                              <span className="email">
                                <FontAwesomeIcon icon={faEnvelope} /> {fornecedor.email}
                              </span>
                              <span className="telefone">
                                <FontAwesomeIcon icon={faPhone} /> {fornecedor.telefone}
                              </span>
                            </div>
                          </td>
                          <td>
                            {new Date(fornecedor.ultimo_pedido).toLocaleDateString('pt-PT')}
                          </td>
                          <td>
                            <span className={`badge status-${fornecedor.status}`}>
                              {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="td-acoes">
                            <div className="acoes-dropdown">
                              <Link to={`/fornecedores/${fornecedor.id}`} className="btn-acao" title="Ver detalhes">
                                <FontAwesomeIcon icon={faEye} />
                              </Link>
                              <Link to={`/fornecedores/${fornecedor.id}/avaliacao`} className="btn-acao" title="Avaliar fornecedor">
                                <FontAwesomeIcon icon={faStar} />
                              </Link>
                              <div className="menu-dropdown-container">
                                <button 
                                  className="btn-acao btn-menu" 
                                  onClick={() => toggleMenu(fornecedor.id)}
                                  title="Mais opções"
                                >
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                
                                {fornecedorMenu === fornecedor.id && (
                                  <div className="menu-dropdown">
                                    <Link to={`/fornecedores/${fornecedor.id}/editar`} className="menu-item">
                                      <FontAwesomeIcon icon={faEdit} /> Editar
                                    </Link>
                                    <Link to={`/fornecedores/${fornecedor.id}/historico`} className="menu-item">
                                      <FontAwesomeIcon icon={faHistory} /> Histórico
                                    </Link>
                                    <Link to={`/fornecedores/${fornecedor.id}/estatisticas`} className="menu-item">
                                      <FontAwesomeIcon icon={faChartLine} /> Estatísticas
                                    </Link>
                                    <button className="menu-item">
                                      <FontAwesomeIcon icon={faHeart} /> Favoritar
                                    </button>
                                    <div className="menu-separador"></div>
                                    {fornecedor.status === 'ativo' ? (
                                      <button className="menu-item texto-atencao">
                                        <FontAwesomeIcon icon={faBan} /> Desativar
                                      </button>
                                    ) : (
                                      <button className="menu-item texto-sucesso">
                                        <FontAwesomeIcon icon={faCheckCircle} /> Ativar
                                      </button>
                                    )}
                                    <button className="menu-item texto-perigo">
                                      <FontAwesomeIcon icon={faTrashAlt} /> Remover
                                    </button>
                                  </div>
                                )}
                              </div>
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
                    Mostrando {indicePrimeiroItem + 1}-{Math.min(indiceUltimoItem, fornecedoresProcessados.length)} de {fornecedoresProcessados.length} fornecedores
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
    </div>
  );
};

export default ListaFornecedores;
