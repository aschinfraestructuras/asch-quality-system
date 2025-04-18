import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import '../styles/DocumentosList.css';

// Interfaces para tipagem
interface Documento {
  id: number;
  codigo: string;
  titulo: string;
  tipo: string;
  versao: string;
  estado: string;
  data_modificacao: string;
  responsavel: string;
  obra_id: number;
  obra_nome: string;
  categoria: string;
  tags: string[];
}

interface RFI {
  id: number;
  codigo: string;
  titulo: string;
  estado: string;
  prioridade: string;
  data_criacao: string;
  prazo_resposta: string;
  solicitante: string;
  responsavel: string;
  obra_id: number;
  obra_nome: string;
  respostas_count: number;
}

interface Obra {
  id: number;
  nome: string;
}

// API simulada para desenvolvimento
const apiSimulada = {
  obterObras: () => [
    { id: 1, nome: 'Obra Ferroviária Setúbal' },
    { id: 2, nome: 'Ponte Vasco da Gama - Manutenção' },
    { id: 3, nome: 'Ampliação Terminal Portuário' },
    { id: 4, nome: 'Reabilitação Urbana Baixa' }
  ],
  
  obterCategorias: () => [
    'Especificações Técnicas',
    'Desenhos',
    'Atas',
    'Manuais',
    'Certificados',
    'Contratos',
    'Relatórios',
    'Licenças',
    'Normas',
    'Outros'
  ],
  
  obterDocumentos: (obraId?: number, categoria?: string, termo?: string) => {
    const documentos = [
      {
        id: 1,
        codigo: 'ESP-001-2025',
        titulo: 'Especificação Técnica - Betão C30/37',
        tipo: 'especificacao',
        versao: '1.2',
        estado: 'Aprovado',
        data_modificacao: '15/03/2025',
        responsavel: 'Carlos Oliveira',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        categoria: 'Especificações Técnicas',
        tags: ['betão', 'estrutural', 'C30/37', 'XC4']
      },
      {
        id: 2,
        codigo: 'DES-042-2025',
        titulo: 'Planta Estrutural - Fundações',
        tipo: 'desenho',
        versao: '2.1',
        estado: 'Em revisão',
        data_modificacao: '08/04/2025',
        responsavel: 'Ana Costa',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        categoria: 'Desenhos',
        tags: ['fundações', 'estrutural', 'planta']
      },
      {
        id: 3,
        codigo: 'ATA-007-2025',
        titulo: 'Ata de Reunião - Progresso Mensal',
        tipo: 'ata',
        versao: '1.0',
        estado: 'Finalizado',
        data_modificacao: '26/03/2025',
        responsavel: 'João Silva',
        obra_id: 2,
        obra_nome: 'Ponte Vasco da Gama - Manutenção',
        categoria: 'Atas',
        tags: ['reunião', 'progresso', 'mensal']
      },
      {
        id: 4,
        codigo: 'CERT-031-2025',
        titulo: 'Certificado de Qualidade - Aço A500',
        tipo: 'certificado',
        versao: '1.0',
        estado: 'Aprovado',
        data_modificacao: '20/03/2025',
        responsavel: 'Ricardo Pereira',
        obra_id: 3,
        obra_nome: 'Ampliação Terminal Portuário',
        categoria: 'Certificados',
        tags: ['aço', 'qualidade', 'A500', 'certificação']
      },
      {
        id: 5,
        codigo: 'CNT-012-2025',
        titulo: 'Contrato de Fornecimento - Agregados',
        tipo: 'contrato',
        versao: '1.1',
        estado: 'Ativo',
        data_modificacao: '02/04/2025',
        responsavel: 'Sofia Mendes',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        categoria: 'Contratos',
        tags: ['contrato', 'fornecimento', 'agregados']
      }
    ];
    
    // Filtrar por obra
    let resultado = documentos;
    if (obraId) {
      resultado = resultado.filter(doc => doc.obra_id === obraId);
    }
    
    // Filtrar por categoria
    if (categoria && categoria !== 'Todos') {
      resultado = resultado.filter(doc => doc.categoria === categoria);
    }
    
    // Filtrar por termo de busca
    if (termo && termo.trim() !== '') {
      const termoLower = termo.toLowerCase();
      resultado = resultado.filter(doc => 
        doc.titulo.toLowerCase().includes(termoLower) || 
        doc.codigo.toLowerCase().includes(termoLower) || 
        doc.tags.some(tag => tag.toLowerCase().includes(termoLower))
      );
    }
    
    return resultado;
  },
  
  obterRFIs: (obraId?: number, estado?: string, termo?: string) => {
    const rfis = [
      {
        id: 1,
        codigo: 'RFI-001-2025',
        titulo: 'Clarificação sobre especificação de betão',
        estado: 'Aberto',
        prioridade: 'Alta',
        data_criacao: '12/04/2025',
        prazo_resposta: '19/04/2025',
        solicitante: 'João Silva',
        responsavel: 'Carlos Oliveira',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        respostas_count: 1
      },
      {
        id: 2,
        codigo: 'RFI-002-2025',
        titulo: 'Dúvida sobre dimensões de estacas',
        estado: 'Aberto',
        prioridade: 'Média',
        data_criacao: '10/04/2025',
        prazo_resposta: '17/04/2025',
        solicitante: 'Ana Costa',
        responsavel: 'Ricardo Pereira',
        obra_id: 1,
        obra_nome: 'Obra Ferroviária Setúbal',
        respostas_count: 0
      },
      {
        id: 3,
        codigo: 'RFI-003-2025',
        titulo: 'Esclarecimento sobre juntas de dilatação',
        estado: 'Respondido',
        prioridade: 'Alta',
        data_criacao: '05/04/2025',
        prazo_resposta: '12/04/2025',
        solicitante: 'Ricardo Pereira',
        responsavel: 'Carlos Oliveira',
        obra_id: 2,
        obra_nome: 'Ponte Vasco da Gama - Manutenção',
        respostas_count: 2
      },
      {
        id: 4,
        codigo: 'RFI-004-2025',
        titulo: 'Dúvida sobre material alternativo',
        estado: 'Fechado',
        prioridade: 'Baixa',
        data_criacao: '01/04/2025',
        prazo_resposta: '08/04/2025',
        solicitante: 'Sofia Mendes',
        responsavel: 'Ricardo Pereira',
        obra_id: 3,
        obra_nome: 'Ampliação Terminal Portuário',
        respostas_count: 1
      }
    ];
    
    // Filtrar por obra
    let resultado = rfis;
    if (obraId) {
      resultado = resultado.filter(rfi => rfi.obra_id === obraId);
    }
    
    // Filtrar por estado
    if (estado && estado !== 'Todos') {
      resultado = resultado.filter(rfi => rfi.estado === estado);
    }
    
    // Filtrar por termo de busca
    if (termo && termo.trim() !== '') {
      const termoLower = termo.toLowerCase();
      resultado = resultado.filter(rfi => 
        rfi.titulo.toLowerCase().includes(termoLower) || 
        rfi.codigo.toLowerCase().includes(termoLower)
      );
    }
    
    return resultado;
  }
};

const DocumentosList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'documentos' | 'rfis'>('documentos');
  const [obraAtiva, setObraAtiva] = useState<number | undefined>(undefined);
  const [obras, setObras] = useState<Obra[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | undefined>(undefined);
  const [estadoRFI, setEstadoRFI] = useState<string | undefined>(undefined);
  const [termoBusca, setTermoBusca] = useState<string>('');
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Efeito para carregar obras e categorias
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        // Tentar obter dados do Supabase
        const { data: obrasData, error: obrasError } = await supabase
          .from('obras')
          .select('*')
          .order('nome', { ascending: true });
          
        if (obrasError) {
          console.error('Erro ao carregar obras do Supabase:', obrasError.message);
          // Fallback para dados simulados
          console.log('Utilizando dados simulados como fallback para obras');
          setObras(apiSimulada.obterObras());
        } else {
          // Usar dados do Supabase se estiverem disponíveis
          if (obrasData && obrasData.length > 0) {
            setObras(obrasData);
          } else {
            console.log('Nenhum dado de obras encontrado no Supabase, utilizando dados simulados');
            setObras(apiSimulada.obterObras());
          }
        }
        
        // Carregar categorias (poderia vir do Supabase também)
        setCategorias(['Todos', ...apiSimulada.obterCategorias()]);
        
        // Verificar localStorage
        const obraSalva = localStorage.getItem('documentos-obraAtiva');
        if (obraSalva) {
          setObraAtiva(parseInt(obraSalva));
        }
        
        const categoriaSalva = localStorage.getItem('documentos-categoriaAtiva');
        if (categoriaSalva) {
          setCategoriaAtiva(categoriaSalva);
        }
        
        const tabSalva = localStorage.getItem('documentos-activeTab');
        if (tabSalva && (tabSalva === 'documentos' || tabSalva === 'rfis')) {
          setActiveTab(tabSalva);
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        // Fallback para dados simulados em caso de exceção
        setObras(apiSimulada.obterObras());
        setCategorias(['Todos', ...apiSimulada.obterCategorias()]);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDadosIniciais();
  }, []);

  // Efeito para carregar documentos ou RFIs quando os filtros mudam
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Salvar escolhas no localStorage
        if (obraAtiva) {
          localStorage.setItem('documentos-obraAtiva', obraAtiva.toString());
        } else {
          localStorage.removeItem('documentos-obraAtiva');
        }
        
        if (categoriaAtiva) {
          localStorage.setItem('documentos-categoriaAtiva', categoriaAtiva);
        } else {
          localStorage.removeItem('documentos-categoriaAtiva');
        }
        
        localStorage.setItem('documentos-activeTab', activeTab);
        
        // Carregar dados conforme a aba ativa
        if (activeTab === 'documentos') {
          // Tentar obter do Supabase
          let query = supabase.from('documentos').select('*');
          
          // Aplicar filtros
          if (obraAtiva) {
            query = query.eq('obra_id', obraAtiva);
          }
          
          if (categoriaAtiva && categoriaAtiva !== 'Todos') {
            query = query.eq('categoria', categoriaAtiva);
          }
          
          if (termoBusca && termoBusca.trim() !== '') {
            query = query.or(`titulo.ilike.%${termoBusca}%,codigo.ilike.%${termoBusca}%`);
          }
          
          const { data, error } = await query.order('data_modificacao', { ascending: false });
          
          if (error) {
            console.error('Erro ao carregar documentos do Supabase:', error.message);
            // Fallback para dados simulados
            const docsSimulados = apiSimulada.obterDocumentos(obraAtiva, categoriaAtiva, termoBusca);
            setDocumentos(docsSimulados);
          } else {
            setDocumentos(data || []);
          }
        } else {
          // RFIs - Tentar obter do Supabase
          let query = supabase.from('rfis').select('*, respostas(count)');
          
          // Aplicar filtros
          if (obraAtiva) {
            query = query.eq('obra_id', obraAtiva);
          }
          
          if (estadoRFI && estadoRFI !== 'Todos') {
            query = query.eq('estado', estadoRFI);
          }
          
          if (termoBusca && termoBusca.trim() !== '') {
            query = query.or(`titulo.ilike.%${termoBusca}%,codigo.ilike.%${termoBusca}%`);
          }
          
          const { data, error } = await query.order('data_criacao', { ascending: false });
          
          if (error) {
            console.error('Erro ao carregar RFIs do Supabase:', error.message);
            // Fallback para dados simulados
            const rfisSimulados = apiSimulada.obterRFIs(obraAtiva, estadoRFI, termoBusca);
            setRFIs(rfisSimulados);
          } else {
            // Mapear dados para incluir contagem de respostas
            const rfisFormatados = data?.map(rfi => ({
              ...rfi,
              respostas_count: rfi.respostas?.[0]?.count || 0
            }));
            
            setRFIs(rfisFormatados || []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        // Fallback para dados simulados em caso de exceção
        if (activeTab === 'documentos') {
          setDocumentos(apiSimulada.obterDocumentos(obraAtiva, categoriaAtiva, termoBusca));
        } else {
          setRFIs(apiSimulada.obterRFIs(obraAtiva, estadoRFI, termoBusca));
        }
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [obraAtiva, categoriaAtiva, termoBusca, activeTab, estadoRFI]);

  // Handler para mudança de obra
  const handleMudancaObra = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setObraAtiva(valor === 'todas' ? undefined : parseInt(valor));
  };

  // Handler para mudança de categoria
  const handleMudancaCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setCategoriaAtiva(valor === 'Todos' ? undefined : valor);
  };

  // Handler para mudança de estado RFI
  const handleMudancaEstadoRFI = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value;
    setEstadoRFI(valor === 'Todos' ? undefined : valor);
  };

  // Handler para busca
  const handleBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(e.target.value);
  };

  // Renderizar ícone de estado de documento
  const renderizarIconeEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprovado':
        return <i className="fas fa-check-circle estado-aprovado"></i>;
      case 'em revisão':
        return <i className="fas fa-sync estado-em-revisao"></i>;
      case 'ativo':
        return <i className="fas fa-play-circle estado-ativo"></i>;
      case 'finalizado':
        return <i className="fas fa-flag-checkered estado-finalizado"></i>;
      default:
        return <i className="fas fa-question-circle estado-desconhecido"></i>;
    }
  };

  // Obter classe de status para RFI
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aberto':
        return 'status-aberto';
      case 'respondido':
        return 'status-respondido';
      case 'fechado':
        return 'status-fechado';
      default:
        return '';
    }
  };
  
  // Obter classe de prioridade para RFI
  const getPrioridadeClass = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'baixa':
        return 'prioridade-baixa';
      case 'média':
        return 'prioridade-media';
      case 'alta':
        return 'prioridade-alta';
      case 'urgente':
        return 'prioridade-urgente';
      default:
        return '';
    }
  };

  if (carregando && documentos.length === 0 && rfis.length === 0) {
    return <div className="loading-container">A carregar dados...</div>;
  }

  return (
    <div className="documentos-container">
      {/* Cabeçalho e filtros */}
      <div className="page-header">
        <h1>Gestão Documental</h1>
        <div className="header-actions">
          <div className="obra-filter">
            <label htmlFor="obra-select">Obra:</label>
            <select 
              id="obra-select"
              value={obraAtiva?.toString() || 'todas'} 
              onChange={handleMudancaObra}
              className="filter-select"
            >
              <option value="todas">Todas as Obras</option>
              {obras.map(obra => (
                <option key={obra.id} value={obra.id.toString()}>
                  {obra.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar..."
              value={termoBusca}
              onChange={handleBusca}
              className="search-input"
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Abas para alternar entre documentos e RFIs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'documentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('documentos')}
          >
            <i className="fas fa-file-alt"></i> Documentos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rfis' ? 'active' : ''}`}
            onClick={() => setActiveTab('rfis')}
          >
            <i className="fas fa-question-circle"></i> RFIs (Pedidos de Informação)
          </button>
        </div>
        
        <div className="tab-content">
          {/* Conteúdo da aba de Documentos */}
          {activeTab === 'documentos' && (
            <div className="documentos-tab">
              <div className="toolbar">
                <div className="filters">
                  <select 
                    value={categoriaAtiva || 'Todos'} 
                    onChange={handleMudancaCategoria}
                    className="filter-select"
                  >
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Link to="/documentos/novo" className="add-button">
                  <i className="fas fa-plus"></i> Novo Documento
                </Link>
              </div>
              
              {documentos.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th className="col-wide">Título</th>
                        <th>Tipo</th>
                        <th>Versão</th>
                        <th>Estado</th>
                        <th>Data</th>
                        <th>Responsável</th>
                        <th>Obra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentos.map(doc => (
                        <tr 
                          key={doc.id} 
                          onClick={() => navigate(`/documentos/${doc.id}`)}
                          className="table-row-clickable"
                        >
                          <td>{doc.codigo}</td>
                          <td>
                            <div className="documento-titulo">
                              {doc.titulo}
                              {doc.tags && doc.tags.length > 0 && (
                                <div className="documento-tags">
                                  {doc.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>{doc.tipo}</td>
                          <td>{doc.versao}</td>
                          <td>
                            <span className={`status-badge ${doc.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                              {renderizarIconeEstado(doc.estado)} {doc.estado}
                            </span>
                          </td>
                          <td>{doc.data_modificacao}</td>
                          <td>{doc.responsavel}</td>
                          <td>{doc.obra_nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-folder-open empty-icon"></i>
                  <p>Não foram encontrados documentos com os filtros atuais</p>
                  <Link to="/documentos/novo" className="primary-button">
                    <i className="fas fa-plus"></i> Criar Documento
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Conteúdo da aba de RFIs */}
          {activeTab === 'rfis' && (
            <div className="rfis-tab">
              <div className="toolbar">
                <div className="filters">
                  <select 
                    value={estadoRFI || 'Todos'} 
                    onChange={handleMudancaEstadoRFI}
                    className="filter-select"
                  >
                    <option value="Todos">Todos os Estados</option>
                    <option value="Aberto">Aberto</option>
                    <option value="Respondido">Respondido</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>
                
                <Link to="/documentos/rfi/novo" className="add-button">
                  <i className="fas fa-plus"></i> Novo RFI
                </Link>
              </div>
              
              {rfis.length > 0 ? (
                <div className="cards-grid">
                  {rfis.map(rfi => (
                    <div 
                      key={rfi.id} 
                      className="rfi-card"
                      onClick={() => navigate(`/documentos/rfi/${rfi.id}`)}
                    >
                      <div className="rfi-card-header">
                        <span className="rfi-codigo">{rfi.codigo}</span>
                        <span className={`status-badge ${getStatusClass(rfi.estado)}`}>
                          {rfi.estado}
                        </span>
                      </div>
                      
                      <h3 className="rfi-titulo">{rfi.titulo}</h3>
                      
                      <div className="rfi-meta">
                        <div className="rfi-meta-item">
                          <i className="fas fa-building"></i> {rfi.obra_nome}
                        </div>
                        <div className="rfi-meta-item">
                          <i className="far fa-calendar-alt"></i> Criado: {rfi.data_criacao}
                        </div>
                        <div className="rfi-meta-item">
                          <i className="fas fa-hourglass-half"></i> Prazo: {rfi.prazo_resposta}
                        </div>
                      </div>
                      
                      <div className="rfi-footer">
                        <div className="rfi-pessoas">
                          <span className="rfi-pessoa-item">
                            <i className="fas fa-user"></i> De: {rfi.solicitante}
                          </span>
                          <span className="rfi-pessoa-item">
                            <i className="fas fa-user-check"></i> Para: {rfi.responsavel}
                          </span>
                        </div>
                        <span className={`prioridade-badge ${getPrioridadeClass(rfi.prioridade)}`}>
                          {rfi.prioridade}
                        </span>
                      </div>
                      
                      <div className="rfi-info-respostas">
                        <i className="fas fa-comments"></i> {rfi.respostas_count} {rfi.respostas_count === 1 ? 'resposta' : 'respostas'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-question-circle empty-icon"></i>
                  <p>Não foram encontrados pedidos de informação (RFIs) com os filtros atuais</p>
                  <Link to="/documentos/rfi/novo" className="primary-button">
                    <i className="fas fa-plus"></i> Criar RFI
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentosList;