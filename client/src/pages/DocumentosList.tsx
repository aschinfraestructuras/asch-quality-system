// DocumentosList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '../services/supabaseClient';
import '../styles/Documentos.css';

// Tipos
interface Documento {
  id: number;
  titulo: string;
  tipo: string;
  obra: string;
  autor: string;
  data_criacao: string;
  ultima_atualizacao: string;
  versao: string;
  status: string;
  ficheiro_url?: string;
}

interface RFI {
  id: number;
  assunto: string;
  obra: string;
  emissor: string;
  destinatario: string;
  data_emissao: string;
  data_resposta?: string;
  status: string;
}

const DocumentosList: React.FC = () => {
  // Estados
  const [activeTab, setActiveTab] = useState<'documentos' | 'rfis'>('documentos');
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroObra, setFiltroObra] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const [obras, setObras] = useState<{id: number, nome: string}[]>([]);
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setIsLoading(true);
        
        // Carregar obras para o filtro
        const { data: obrasData, error: obrasError } = await supabase
          .from('obras')
          .select('id, nome')
          .order('nome');
          
        if (obrasError) throw obrasError;
        setObras(obrasData || []);
        
        // Carregar documentos
        // Na versão real, isto seria uma chamada ao Supabase
        // Dados simulados para demonstração
        const documentosSimulados: Documento[] = [
          {
            id: 1,
            titulo: 'Plano de Qualidade - Obra Ferroviária Setúbal',
            tipo: 'Plano',
            obra: 'Obra Ferroviária Setúbal',
            autor: 'João Silva',
            data_criacao: '2025-03-10',
            ultima_atualizacao: '2025-04-05',
            versao: 'v1.3',
            status: 'aprovado'
          },
          {
            id: 2,
            titulo: 'Procedimento de Ensaio - Betão',
            tipo: 'Procedimento',
            obra: 'Todos',
            autor: 'António Costa',
            data_criacao: '2024-11-05',
            ultima_atualizacao: '2025-01-20',
            versao: 'v2.0',
            status: 'aprovado'
          },
          {
            id: 3,
            titulo: 'Relatório Mensal de Qualidade - Março 2025',
            tipo: 'Relatório',
            obra: 'Metro de Lisboa - Expansão',
            autor: 'Ana Ferreira',
            data_criacao: '2025-04-02',
            ultima_atualizacao: '2025-04-02',
            versao: 'v1.0',
            status: 'em_revisao'
          },
          {
            id: 4,
            titulo: 'Checklist de Inspeção - Estruturas Metálicas',
            tipo: 'Checklist',
            obra: 'Ampliação Terminal Portuário',
            autor: 'Carlos Oliveira',
            data_criacao: '2025-02-15',
            ultima_atualizacao: '2025-03-10',
            versao: 'v1.2',
            status: 'aprovado'
          },
          {
            id: 5,
            titulo: 'Plano de Inspeção e Ensaio - Fundações',
            tipo: 'Plano',
            obra: 'Reabilitação Urbana Baixa',
            autor: 'Ricardo Pereira',
            data_criacao: '2025-03-28',
            ultima_atualizacao: '2025-03-28',
            versao: 'v1.0',
            status: 'em_elaboracao'
          }
        ];
        
        // RFIs simulados
        const rfisSimulados: RFI[] = [
          {
            id: 101,
            assunto: 'Especificação técnica de armaduras',
            obra: 'Obra Ferroviária Setúbal',
            emissor: 'Ricardo Pereira',
            destinatario: 'Projectista',
            data_emissao: '2025-04-10',
            data_resposta: '2025-04-15',
            status: 'respondido'
          },
          {
            id: 102,
            assunto: 'Clarificação de método construtivo',
            obra: 'Metro de Lisboa - Expansão',
            emissor: 'João Silva',
            destinatario: 'Direcção de Obra',
            data_emissao: '2025-04-05',
            status: 'pendente'
          },
          {
            id: 103,
            assunto: 'Detalhe de ligação de estrutura metálica',
            obra: 'Ampliação Terminal Portuário',
            emissor: 'Carlos Oliveira',
            destinatario: 'Projectista',
            data_emissao: '2025-03-28',
            data_resposta: '2025-04-02',
            status: 'respondido'
          },
          {
            id: 104,
            assunto: 'Requisitos de impermeabilização',
            obra: 'Reabilitação Urbana Baixa',
            emissor: 'Ana Ferreira',
            destinatario: 'Consultores Externos',
            data_emissao: '2025-04-12',
            status: 'pendente'
          }
        ];
        
        setDocumentos(documentosSimulados);
        setRFIs(rfisSimulados);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar documentos:', err);
        setError('Não foi possível carregar os documentos. Por favor, tente novamente.');
        setIsLoading(false);
      }
    };
    
    fetchDados();
  }, []);
  
  // Filtragem de documentos
  const documentosFiltrados = documentos.filter(doc => {
    // Filtro por tipo
    if (filtroTipo !== 'todos' && doc.tipo !== filtroTipo) {
      return false;
    }
    
    // Filtro por obra
    if (filtroObra !== 'todas' && doc.obra !== filtroObra) {
      return false;
    }
    
    // Filtro por status
    if (filtroStatus !== 'todos' && doc.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por termo de pesquisa
    if (termoPesquisa && !doc.titulo.toLowerCase().includes(termoPesquisa.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Filtragem de RFIs
  const rfisFiltrados = rfis.filter(rfi => {
    // Filtro por obra
    if (filtroObra !== 'todas' && rfi.obra !== filtroObra) {
      return false;
    }
    
    // Filtro por status
    if (filtroStatus !== 'todos' && rfi.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por termo de pesquisa
    if (termoPesquisa && !rfi.assunto.toLowerCase().includes(termoPesquisa.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Renderização de estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="documentos-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>A carregar documentos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="documentos-container">
        <div className="error-state">
          <FontAwesomeIcon icon="exclamation-circle" size="3x" />
          <h3>Erro ao carregar documentos</h3>
          <p>{error}</p>
          <button 
            className="botao-primario"
            onClick={() => window.location.reload()}
          >
            <FontAwesomeIcon icon="sync" /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="documentos-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <FontAwesomeIcon icon="file" /> Gestão Documental
          </h1>
          <p className="page-subtitle">
            Gerencie documentos, procedimentos e pedidos de informação
          </p>
        </div>
        
        <div className="page-actions">
          {activeTab === 'documentos' ? (
            <Link to="/documentos/novo" className="botao-primario">
              <FontAwesomeIcon icon="plus" /> Novo Documento
            </Link>
          ) : (
            <Link to="/documentos/rfi/novo" className="botao-primario">
              <FontAwesomeIcon icon="plus" /> Novo RFI
            </Link>
          )}
          
          <button className="botao-secundario">
            <FontAwesomeIcon icon="file-export" /> Exportar
          </button>
        </div>
      </div>
      
      <div className="documentos-tabs">
        <button 
          className={activeTab === 'documentos' ? 'tab-ativa' : ''}
          onClick={() => setActiveTab('documentos')}
        >
          <FontAwesomeIcon icon="file" /> Documentos
        </button>
        <button 
          className={activeTab === 'rfis' ? 'tab-ativa' : ''}
          onClick={() => setActiveTab('rfis')}
        >
          <FontAwesomeIcon icon="question-circle" /> RFIs (Pedidos de Informação)
        </button>
      </div>
      
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label htmlFor="filtro-obra">Obra:</label>
          <select 
            id="filtro-obra" 
            className="select-estilizado" 
            value={filtroObra}
            onChange={(e) => setFiltroObra(e.target.value)}
          >
            <option value="todas">Todas as Obras</option>
            {obras.map(obra => (
              <option key={obra.id} value={obra.nome}>{obra.nome}</option>
            ))}
          </select>
        </div>
        
        {activeTab === 'documentos' && (
          <div className="filtro-grupo">
            <label htmlFor="filtro-tipo">Tipo:</label>
            <select 
              id="filtro-tipo" 
              className="select-estilizado" 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos os Tipos</option>
              <option value="Plano">Planos</option>
              <option value="Procedimento">Procedimentos</option>
              <option value="Relatório">Relatórios</option>
              <option value="Checklist">Checklists</option>
              <option value="Manual">Manuais</option>
              <option value="Certificado">Certificados</option>
            </select>
          </div>
        )}
        
        <div className="filtro-grupo">
          <label htmlFor="filtro-status">Status:</label>
          <select 
            id="filtro-status" 
            className="select-estilizado" 
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            {activeTab === 'documentos' ? (
              <>
                <option value="em_elaboracao">Em Elaboração</option>
                <option value="em_revisao">Em Revisão</option>
                <option value="aprovado">Aprovado</option>
                <option value="obsoleto">Obsoleto</option>
              </>
            ) : (
              <>
                <option value="pendente">Pendente</option>
                <option value="respondido">Respondido</option>
                <option value="finalizado">Finalizado</option>
              </>
            )}
          </select>
        </div>
        
        <div className="filtro-grupo pesquisa">
          <label htmlFor="pesquisa">Pesquisar:</label>
          <div className="campo-pesquisa">
            <FontAwesomeIcon icon="search" className="icone-pesquisa" />
            <input 
              type="text" 
              id="pesquisa" 
              placeholder={activeTab === 'documentos' ? "Pesquisar documentos..." : "Pesquisar RFIs..."}
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            {termoPesquisa && (
              <button 
                className="botao-limpar-pesquisa"
                onClick={() => setTermoPesquisa('')}
              >
                <FontAwesomeIcon icon="times" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {activeTab === 'documentos' ? (
        <div className="documentos-lista">
          {documentosFiltrados.length === 0 ? (
            <div className="estado-vazio">
              <FontAwesomeIcon icon="file" />
              <h3>Nenhum documento encontrado</h3>
              <p>Não foram encontrados documentos com os critérios selecionados.</p>
              <button 
                className="botao-secundario"
                onClick={() => {
                  setFiltroTipo('todos');
                  setFiltroObra('todas');
                  setFiltroStatus('todos');
                  setTermoPesquisa('');
                }}
              >
                <FontAwesomeIcon icon="sync" /> Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="tabela-documentos">
              <div className="tabela-cabecalho">
                <div className="coluna">Título</div>
                <div className="coluna">Tipo</div>
                <div className="coluna">Obra</div>
                <div className="coluna">Versão</div>
                <div className="coluna">Data</div>
                <div className="coluna">Status</div>
                <div className="coluna">Ações</div>
              </div>
              
              {documentosFiltrados.map(documento => (
                <div key={documento.id} className="tabela-linha">
                  <div className="coluna coluna-titulo">{documento.titulo}</div>
                  <div className="coluna">{documento.tipo}</div>
                  <div className="coluna">{documento.obra}</div>
                  <div className="coluna">{documento.versao}</div>
                  <div className="coluna">{new Date(documento.ultima_atualizacao).toLocaleDateString('pt-PT')}</div>
                  <div className="coluna">
                    <span className={`badge status-${documento.status}`}>
                      {documento.status === 'aprovado' ? 'Aprovado' : 
                       documento.status === 'em_elaboracao' ? 'Em Elaboração' : 
                       documento.status === 'em_revisao' ? 'Em Revisão' : 'Obsoleto'}
                    </span>
                  </div>
                  <div className="coluna acoes">
                    <Link to={`/documentos/${documento.id}`} className="botao-mini">
                      <FontAwesomeIcon icon="eye" />
                    </Link>
                    <Link to={`/documentos/${documento.id}/editar`} className="botao-mini">
                      <FontAwesomeIcon icon="pencil-alt" />
                    </Link>
                    <button className="botao-mini">
                      <FontAwesomeIcon icon="download" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rfis-lista">
          {rfisFiltrados.length === 0 ? (
            <div className="estado-vazio">
              <FontAwesomeIcon icon="question-circle" />
              <h3>Nenhum RFI encontrado</h3>
              <p>Não foram encontrados pedidos de informação com os critérios selecionados.</p>
              <button 
                className="botao-secundario"
                onClick={() => {
                  setFiltroObra('todas');
                  setFiltroStatus('todos');
                  setTermoPesquisa('');
                }}
              >
                <FontAwesomeIcon icon="sync" /> Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="tabela-rfis">
              <div className="tabela-cabecalho">
                <div className="coluna">Assunto</div>
                <div className="coluna">Obra</div>
                <div className="coluna">Emissor</div>
                <div className="coluna">Destinatário</div>
                <div className="coluna">Data Emissão</div>
                <div className="coluna">Status</div>
                <div className="coluna">Ações</div>
              </div>
              
              {rfisFiltrados.map(rfi => (
                <div key={rfi.id} className="tabela-linha">
                  <div className="coluna coluna-titulo">{rfi.assunto}</div>
                  <div className="coluna">{rfi.obra}</div>
                  <div className="coluna">{rfi.emissor}</div>
                  <div className="coluna">{rfi.destinatario}</div>
                  <div className="coluna">{new Date(rfi.data_emissao).toLocaleDateString('pt-PT')}</div>
                  <div className="coluna">
                    <span className={`badge status-rfi-${rfi.status}`}>
                      {rfi.status === 'pendente' ? 'Pendente' : 
                       rfi.status === 'respondido' ? 'Respondido' : 'Finalizado'}
                    </span>
                  </div>
                  <div className="coluna acoes">
                    <Link to={`/documentos/rfi/${rfi.id}`} className="botao-mini">
                      <FontAwesomeIcon icon="eye" />
                    </Link>
                    <Link to={`/documentos/rfi/${rfi.id}/editar`} className="botao-mini">
                      <FontAwesomeIcon icon="pencil-alt" />
                    </Link>
                    <button className="botao-mini">
                      <FontAwesomeIcon icon="reply" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="paginacao">
        <button className="botao-paginacao" disabled>
          <FontAwesomeIcon icon="chevron-left" /> Anterior
        </button>
        <div className="paginas">
          <button className="pagina ativa">1</button>
          <button className="pagina">2</button>
          <button className="pagina">3</button>
        </div>
        <button className="botao-paginacao">
          Próxima <FontAwesomeIcon icon="chevron-right" />
        </button>
      </div>
    </div>
  );
};

export default DocumentosList;