import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import '../styles/ViewDocumento.css';

// Interfaces para tipagem
interface Documento {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  tipo: string;
  versao: string;
  estado: string;
  data_criacao: string;
  data_modificacao: string;
  responsavel: string;
  obra_id: number;
  obra_nome: string;
  categoria: string;
  tags: string[];
  url_arquivo?: string;
}

interface RFI {
  id: number;
  codigo: string;
  titulo: string;
  descricao: string;
  estado: string;
  data_criacao: string;
  solicitante: string;
  responsavel: string;
  respostas_count: number;
}

// Dados de exemplo para um documento específico
const documentoExemplo: Documento = {
  id: 1,
  codigo: 'ESP-001-2025',
  titulo: 'Especificação Técnica - Betão C30/37',
  descricao: 'Especificação completa para betão estrutural C30/37 XC4 a ser utilizado nas fundações e estruturas dos blocos A e B. Inclui requisitos de resistência, durabilidade, composição e procedimentos de controle de qualidade.',
  tipo: 'especificacao',
  versao: '1.2',
  estado: 'Aprovado',
  data_criacao: '10/01/2025',
  data_modificacao: '15/03/2025',
  responsavel: 'Carlos Oliveira',
  obra_id: 1,
  obra_nome: 'Obra Ferroviária Setúbal',
  categoria: 'Especificações Técnicas',
  tags: ['betão', 'estrutural', 'C30/37', 'XC4']
};

// RFIs relacionados de exemplo
const rfisRelacionadosExemplo: RFI[] = [
  {
    id: 1,
    codigo: 'RFI-001-2025',
    titulo: 'Clarificação sobre especificação de betão',
    descricao: 'Precisamos de esclarecimento sobre a resistência do betão a ser utilizado nas fundações profundas.',
    estado: 'Aberto',
    data_criacao: '12/04/2025',
    solicitante: 'João Silva',
    responsavel: 'Carlos Oliveira',
    respostas_count: 1
  },
  {
    id: 2,
    codigo: 'RFI-005-2025',
    titulo: 'Dúvida sobre especificação de cura do betão',
    descricao: 'Solicito informação detalhada sobre o processo de cura do betão conforme a especificação.',
    estado: 'Respondido',
    data_criacao: '14/04/2025',
    solicitante: 'Ana Costa',
    responsavel: 'Carlos Oliveira',
    respostas_count: 2
  }
];

// Histórico de versões de exemplo
const historicoVersoes = [
  {
    versao: '1.2',
    data: '15/03/2025',
    autor: 'Carlos Oliveira',
    descricao: 'Atualização dos requisitos de durabilidade conforme nova norma europeia.'
  },
  {
    versao: '1.1',
    data: '25/02/2025',
    autor: 'Carlos Oliveira',
    descricao: 'Correção na especificação da relação água/cimento.'
  },
  {
    versao: '1.0',
    data: '10/01/2025',
    autor: 'Ana Costa',
    descricao: 'Versão inicial do documento.'
  }
];

const ViewDocumento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [rfisRelacionados, setRFIsRelacionados] = useState<RFI[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [carregando, setCarregando] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const carregarDocumento = async () => {
      setCarregando(true);
      try {
        if (id) {
          // Tentar carregar do Supabase primeiro
          const { data, error } = await supabase
            .from('documentos')
            .select('*')
            .eq('id', parseInt(id))
            .single();
            
          if (error) {
            console.error('Erro ao carregar documento do Supabase:', error.message);
            // Fallback para API simulada
            setDocumento(documentoExemplo);
          } else if (data) {
            setDocumento(data);
          } else {
            // Tentar dados simulados se não encontrado
            setDocumento(documentoExemplo);
          }
          
          // Carregar RFIs relacionados ao documento
          const { data: rfisData, error: rfisError } = await supabase
            .from('rfis')
            .select('*, respostas(count)')
            .eq('documento_id', parseInt(id));
            
          if (rfisError) {
            console.error('Erro ao carregar RFIs relacionados:', rfisError.message);
            // Fallback para dados simulados
            setRFIsRelacionados(rfisRelacionadosExemplo);
          } else {
            // Mapear dados para incluir contagem de respostas
            const rfisFormatados = rfisData?.map(rfi => ({
              ...rfi,
              respostas_count: rfi.respostas?.[0]?.count || 0
            }));
            
            setRFIsRelacionados(rfisFormatados || rfisRelacionadosExemplo);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes do documento:', error);
        // Usar dados simulados como fallback
        setDocumento(documentoExemplo);
        setRFIsRelacionados(rfisRelacionadosExemplo);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDocumento();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        const { error } = await supabase
          .from('documentos')
          .delete()
          .eq('id', parseInt(id));
          
        if (error) {
          throw error;
        }
        
        // Redirecionar para a lista de documentos
        navigate('/documentos');
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      alert('Não foi possível excluir o documento. Verifique se não existem RFIs ou outras referências associadas.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const criarRFI = () => {
    navigate(`/documentos/rfi/novo?documento_id=${id}`);
  };

  const visualizarRFI = (rfiId: number) => {
    navigate(`/documentos/rfi/${rfiId}`);
  };
  
  if (carregando) {
    return <div className="loading-container">A carregar detalhes do documento...</div>;
  }
  
  if (!documento) {
    return (
      <div className="not-found-container">
        <h2>Documento não encontrado</h2>
        <p>O documento solicitado não existe ou foi removido.</p>
        <Link to="/documentos" className="back-link">Voltar para lista de documentos</Link>
      </div>
    );
  }

  // Função para obter a classe de status
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'status-aprovado';
      case 'em revisão':
        return 'status-em-revisao';
      case 'ativo':
        return 'status-ativo';
      case 'finalizado':
        return 'status-finalizado';
      default:
        return '';
    }
  };

  // Função para obter a classe de status RFI
  const getRFIStatusClass = (status: string) => {
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

  return (
    <div className="view-documento-container">
      <div className="view-documento-header">
        <div className="back-button-container">
          <button 
            onClick={() => navigate('/documentos')}
            className="back-button"
          >
            ← Voltar
          </button>
        </div>
        
        <div className="documento-title-container">
          <h1>{documento.titulo}</h1>
          <div className="documento-subtitle">
            <span className="documento-codigo">{documento.codigo}</span>
            <span className={`status-badge ${getStatusClass(documento.estado)}`}>
              {documento.estado}
            </span>
          </div>
        </div>
        
        <div className="actions-container">
          <Link to={`/documentos/${id}/editar`} className="edit-btn">
            <i className="fas fa-edit"></i> Editar
          </Link>
          
          <button className="download-btn">
            <i className="fas fa-download"></i> Download
          </button>
          
          <button 
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="fas fa-trash-alt"></i> Excluir
          </button>
        </div>
      </div>

      <div className="documento-content">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <i className="fas fa-info-circle"></i> Informações
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            <i className="fas fa-history"></i> Histórico de Versões
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rfis' ? 'active' : ''}`}
            onClick={() => setActiveTab('rfis')}
          >
            <i className="fas fa-question-circle"></i> RFIs Relacionados
          </button>
          <button 
            className={`tab-btn ${activeTab === 'referencias' ? 'active' : ''}`}
            onClick={() => setActiveTab('referencias')}
          >
            <i className="fas fa-link"></i> Referências
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'info' && (
            <div className="info-tab">
              <div className="documento-grid">
                <div className="documento-details">
                  <h2>Detalhes do Documento</h2>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Tipo:</span>
                      <span>{documento.tipo}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Categoria:</span>
                      <span>{documento.categoria}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Versão:</span>
                      <span>{documento.versao}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Obra:</span>
                      <span>{documento.obra_nome}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Responsável:</span>
                      <span>{documento.responsavel}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Data de Criação:</span>
                      <span>{documento.data_criacao}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Última Modificação:</span>
                      <span>{documento.data_modificacao}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Estado:</span>
                      <span className={`status-badge ${getStatusClass(documento.estado)}`}>
                        {documento.estado}
                      </span>
                    </div>
                  </div>
                  
                  <div className="tags-container">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {documento.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="description-container">
                    <h3>Descrição</h3>
                    <p className="documento-descricao">{documento.descricao}</p>
                  </div>
                </div>
                
                <div className="documento-preview">
                  <h2>Pré-visualização</h2>
                  <div className="preview-container">
                    {documento.url_arquivo ? (
                      <iframe 
                        src={documento.url_arquivo} 
                        className="documento-iframe"
                        title={documento.titulo}
                      ></iframe>
                    ) : (
                      <div className="preview-placeholder">
                        <i className="fas fa-file-pdf"></i>
                        <p>Pré-visualização não disponível</p>
                        <button className="upload-btn">
                          <i className="fas fa-upload"></i> Carregar Documento
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'historico' && (
            <div className="historico-tab">
              <h2>Histórico de Versões</h2>
              
              <div className="versoes-timeline">
                {historicoVersoes.map((versao, index) => (
                  <div key={index} className="versao-item">
                    <div className="versao-header">
                      <div className="versao-info">
                        <span className="versao-numero">Versão {versao.versao}</span>
                        {index === 0 && (
                          <span className="versao-atual-badge">Atual</span>
                        )}
                      </div>
                      <span className="versao-data">{versao.data}</span>
                    </div>
                    
                    <div className="versao-content">
                      <div className="versao-autor">
                        <i className="fas fa-user"></i> {versao.autor}
                      </div>
                      <div className="versao-descricao">
                        {versao.descricao}
                      </div>
                    </div>
                    
                    <div className="versao-actions">
                      <button className="versao-view-btn">
                        <i className="fas fa-eye"></i> Visualizar
                      </button>
                      {index > 0 && (
                        <button className="versao-compare-btn">
                          <i className="fas fa-exchange-alt"></i> Comparar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'rfis' && (
            <div className="rfis-tab">
              <div className="rfis-header">
                <h2>RFIs Relacionados</h2>
                <button 
                  className="add-rfi-btn"
                  onClick={criarRFI}
                >
                  <i className="fas fa-plus"></i> Novo RFI
                </button>
              </div>
              
              {rfisRelacionados.length > 0 ? (
                <div className="rfis-list">
                  {rfisRelacionados.map(rfi => (
                    <div 
                      key={rfi.id} 
                      className="rfi-item"
                      onClick={() => visualizarRFI(rfi.id)}
                    >
                      <div className="rfi-item-header">
                        <span className="rfi-item-codigo">{rfi.codigo}</span>
                        <span className={`status-badge ${getRFIStatusClass(rfi.estado)}`}>
                          {rfi.estado}
                        </span>
                      </div>
                      
                      <h3 className="rfi-item-titulo">{rfi.titulo}</h3>
                      
                      <div className="rfi-item-meta">
                        <span className="rfi-item-data">
                          <i className="far fa-calendar-alt"></i> {rfi.data_criacao}
                        </span>
                        <span className="rfi-item-solicitante">
                          <i className="fas fa-user"></i> De: {rfi.solicitante}
                        </span>
                        <span className="rfi-item-responsavel">
                          <i className="fas fa-user-check"></i> Para: {rfi.responsavel}
                        </span>
                        <span className="rfi-item-respostas">
                          <i className="fas fa-comments"></i> {rfi.respostas_count} respostas
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-question-circle empty-icon"></i>
                  <p>Não existem RFIs associados a este documento.</p>
                  <button className="primary-button" onClick={criarRFI}>
                    <i className="fas fa-plus"></i> Criar RFI
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'referencias' && (
            <div className="referencias-tab">
              <h2>Referências</h2>
              
              <div className="referencias-list-container">
                {/* Esta seria uma implementação real com dados do backend */}
                <div className="empty-state">
                  <i className="fas fa-link empty-icon"></i>
                  <p>Este documento não possui referências externas.</p>
                  <button className="primary-button">
                    <i className="fas fa-plus"></i> Adicionar Referência
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o documento <strong>"{documento.codigo} - {documento.titulo}"</strong>?</p>
            <p className="delete-warning">Esta ação não pode ser desfeita.</p>
            
            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={handleDelete}
              >
                Excluir Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDocumento;