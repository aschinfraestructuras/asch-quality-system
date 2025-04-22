import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faEdit, faDownload, faReply, faHistory,
  faExternalLinkAlt, faQuestionCircle, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faCalendarAlt, faUserAlt, faUserTie,
  faBuilding, faFileAlt, faPaperclip, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Documentos.css';
import { faEye } from '@fortawesome/free-solid-svg-icons';


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
  documentos_relacionados?: Array<{id: number, titulo: string, tipo: string}>;
  resposta?: string;
  respondido_por?: string;
}

// Tipo para documento relacionado
interface DocumentoRelacionado {
  id: number;
  titulo: string;
  tipo: string;
  data: string;
  autor: string;
}

const ViewRFI: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [rfi, setRFI] = useState<RFI | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [documentosRelacionados, setDocumentosRelacionados] = useState<DocumentoRelacionado[]>([]);
  const [activaSeccao, setActivaSeccao] = useState('informacoes');
  
  // Simulação de carregamento do RFI
  useEffect(() => {
    const fetchRFI = async () => {
      setCarregando(true);
      
      try {
        // Em um cenário real, isto seria uma chamada API
        // Simulando tempo de carregamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock de dados
        if (id) {
          const rfiMock: RFI = {
            id: parseInt(id),
            assunto: 'Especificação técnica de armaduras',
            obra: 'Obra Ferroviária Setúbal',
            emissor: 'Ricardo Pereira',
            destinatario: 'Projectista',
            data_emissao: '2025-04-10',
            data_resposta: '2025-04-15',
            status: 'respondido',
            descricao: 'Necessitamos de informação detalhada sobre as armaduras a aplicar nos pilares P12 a P18. Em particular, precisamos de esclarecer os seguintes pontos:\n\n1. Diâmetro e espaçamento dos estribos nas zonas críticas\n2. Detalhes construtivos das amarrações\n3. Classe do aço a utilizar\n4. Recobrimentos mínimos a garantir\n\nO esclarecimento desta informação é crítico para podermos avançar com a produção das armaduras.',
            urgencia: 'alta',
            documentos_relacionados: [
              { id: 1, titulo: 'Plano de Qualidade - Obra Ferroviária Setúbal', tipo: 'Plano' },
              { id: 4, titulo: 'Checklist de Inspeção - Estruturas Metálicas', tipo: 'Checklist' }
            ],
            resposta: 'Em resposta às questões levantadas sobre as armaduras dos pilares P12 a P18, informamos o seguinte:\n\n1. Os estribos nas zonas críticas devem ter diâmetro de 10mm e espaçamento de 10cm\n2. As amarrações devem seguir o detalhe D.123 do projeto de execução\n3. O aço a utilizar deve ser da classe A500NR SD\n4. Os recobrimentos mínimos devem ser de 35mm\n\nEsperamos que estas informações sejam suficientes para dar seguimento aos trabalhos. Caso necessite de esclarecimentos adicionais, não hesite em contactar-nos.',
            respondido_por: 'António Silva'
          };
          
          // Dados de documentos relacionados
          const documentosRelacionadosMock: DocumentoRelacionado[] = [
            {
              id: 1,
              titulo: 'Plano de Qualidade - Obra Ferroviária Setúbal',
              tipo: 'Plano',
              data: '2025-03-10',
              autor: 'João Silva'
            },
            {
              id: 4,
              titulo: 'Checklist de Inspeção - Estruturas Metálicas',
              tipo: 'Checklist',
              data: '2025-02-15',
              autor: 'Carlos Oliveira'
            }
          ];
          
          setRFI(rfiMock);
          setDocumentosRelacionados(documentosRelacionadosMock);
          setCarregando(false);
        } else {
          throw new Error('ID do RFI não fornecido');
        }
      } catch (error) {
        console.error('Erro ao carregar RFI:', error);
        setErro('Não foi possível carregar os detalhes do RFI. Por favor, tente novamente.');
        setCarregando(false);
      }
    };
    
    fetchRFI();
  }, [id]);
  
  // Componente de estado do RFI
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
      <div className="spinner"></div>
      <p>A carregar detalhes do pedido de informação...</p>
    </div>
  );
  
  // Componente de Erro
  const Erro = () => (
    <div className="estado-erro">
      <FontAwesomeIcon icon={faTimesCircle} size="3x" />
      <h3>Erro ao carregar RFI</h3>
      <p>{erro}</p>
      <button className="btn-secundario" onClick={() => navigate('/documentos/rfis')}>
        <FontAwesomeIcon icon={faArrowLeft} /> Voltar para a Lista
      </button>
    </div>
  );
  
  if (carregando) {
    return <Carregando />;
  }
  
  if (erro || !rfi) {
    return <Erro />;
  }
  
  return (
    <div className="rfi-view-container">
      {/* Cabeçalho */}
      <div className="rfi-header">
        <div className="rfi-header-info">
          <div className="caminho-navegacao">
            <Link to="/documentos/rfis" className="link-navegacao">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar para lista
            </Link>
          </div>
          
          <div className="rfi-titulo">
            <div className="titulo-principal">
              <h1><FontAwesomeIcon icon={faQuestionCircle} /> RFI-{rfi.id}</h1>
              <StatusBadge status={rfi.status} />
              {rfi.urgencia === 'alta' && (
                <span className="badge urgencia-alta">
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Urgente
                </span>
              )}
            </div>
            <h2>{rfi.assunto}</h2>
          </div>
          
          <div className="rfi-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Data de Emissão</span>
                <span className="meta-valor">{new Date(rfi.data_emissao).toLocaleDateString('pt-PT')}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faUserAlt} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Emissor</span>
                <span className="meta-valor">{rfi.emissor}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faUserTie} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Destinatário</span>
                <span className="meta-valor">{rfi.destinatario}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <FontAwesomeIcon icon={faBuilding} className="meta-icon" />
              <div className="meta-texto">
                <span className="meta-label">Obra</span>
                <span className="meta-valor">{rfi.obra}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rfi-header-acoes">
          <button className="btn-primario">
            <FontAwesomeIcon icon={faReply} /> Responder
          </button>
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faEdit} /> Editar
          </button>
          <button className="btn-secundario">
            <FontAwesomeIcon icon={faDownload} /> Exportar PDF
          </button>
          <div className="btn-mais-opcoes">
            <button className="btn-icone">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navegação por tabs */}
      <div className="rfi-seccoes-tabs">
        <button 
          className={activaSeccao === 'informacoes' ? 'seccao-tab activa' : 'seccao-tab'}
          onClick={() => setActivaSeccao('informacoes')}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Informações
        </button>
        <button 
          className={activaSeccao === 'documentos' ? 'seccao-tab activa' : 'seccao-tab'}
          onClick={() => setActivaSeccao('documentos')}
        >
          <FontAwesomeIcon icon={faPaperclip} /> Documentos Relacionados
          <span className="contador">{documentosRelacionados.length}</span>
        </button>
        <button 
          className={activaSeccao === 'historico' ? 'seccao-tab activa' : 'seccao-tab'}
          onClick={() => setActivaSeccao('historico')}
        >
          <FontAwesomeIcon icon={faHistory} /> Histórico
        </button>
      </div>
      
      {/* Conteúdo da secção ativa */}
      <div className="rfi-conteudo">
        {activaSeccao === 'informacoes' && (
          <>
            <div className="rfi-card">
              <h3 className="rfi-card-titulo">
                <FontAwesomeIcon icon={faQuestionCircle} /> Pedido de Informação
              </h3>
              <div className="rfi-card-conteudo">
                <p className="rfi-descricao">
                  {rfi.descricao?.split('\n').map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <div className="rfi-card-footer">
                <div className="rfi-card-meta">
                  <span className="rfi-meta-item">
                    <FontAwesomeIcon icon={faUserAlt} /> {rfi.emissor}
                  </span>
                  <span className="rfi-meta-item">
                    <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(rfi.data_emissao).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>
            
            {rfi.status === 'respondido' && (
              <div className="rfi-card resposta">
                <h3 className="rfi-card-titulo">
                  <FontAwesomeIcon icon={faReply} /> Resposta
                </h3>
                <div className="rfi-card-conteudo">
                  <p className="rfi-resposta">
                    {rfi.resposta?.split('\n').map((paragraph, index) => (
                      <React.Fragment key={index}>
                        {paragraph}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
                <div className="rfi-card-footer">
                  <div className="rfi-card-meta">
                    <span className="rfi-meta-item">
                      <FontAwesomeIcon icon={faUserAlt} /> {rfi.respondido_por}
                    </span>
                    <span className="rfi-meta-item">
                      <FontAwesomeIcon icon={faCalendarAlt} /> {rfi.data_resposta && new Date(rfi.data_resposta).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {activaSeccao === 'documentos' && (
          <div className="documentos-relacionados-lista">
            {documentosRelacionados.length === 0 ? (
              <div className="estado-vazio">
                <FontAwesomeIcon icon={faFileAlt} size="3x" />
                <p>Não existem documentos relacionados com este RFI.</p>
                <button className="btn-secundario">
                  <FontAwesomeIcon icon={faPaperclip} /> Anexar Documento
                </button>
              </div>
            ) : (
              <>
                <div className="secao-cabecalho">
                  <h3>Documentos Relacionados</h3>
                  <button className="btn-secundario btn-sm">
                    <FontAwesomeIcon icon={faPaperclip} /> Anexar Documento
                  </button>
                </div>
                
                <div className="docs-lista">
                  {documentosRelacionados.map((doc) => (
                    <div key={doc.id} className="documento-item">
                      <div className="documento-icone">
                        <FontAwesomeIcon icon={faFileAlt} />
                      </div>
                      <div className="documento-info">
                        <Link to={`/documentos/${doc.id}`} className="documento-titulo">
                          {doc.titulo}
                        </Link>
                        <div className="documento-meta">
                          <span className="documento-tipo">{doc.tipo}</span>
                          <span className="documento-data">
                            <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(doc.data).toLocaleDateString('pt-PT')}
                          </span>
                          <span className="documento-autor">
                            <FontAwesomeIcon icon={faUserAlt} /> {doc.autor}
                          </span>
                        </div>
                      </div>
                      <div className="documento-acoes">
                        <button className="btn-icone" title="Ver Documento">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="btn-icone" title="Descarregar">
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {activaSeccao === 'historico' && (
          <div className="historico-lista">
            <div className="secao-cabecalho">
              <h3>Histórico de Atividades</h3>
            </div>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icone">
                  <FontAwesomeIcon icon={faReply} />
                </div>
                <div className="timeline-conteudo">
                  <div className="timeline-cabecalho">
                    <span className="timeline-titulo">Resposta adicionada</span>
                    <span className="timeline-data">{rfi.data_resposta && new Date(rfi.data_resposta).toLocaleDateString('pt-PT')} às 14:32</span>
                  </div>
                  <div className="timeline-corpo">
                    <p>António Silva respondeu ao pedido de informação.</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-icone">
                  <FontAwesomeIcon icon={faPaperclip} />
                </div>
                <div className="timeline-conteudo">
                  <div className="timeline-cabecalho">
                    <span className="timeline-titulo">Documento anexado</span>
                    <span className="timeline-data">{new Date(rfi.data_emissao).toLocaleDateString('pt-PT')} às 11:15</span>
                  </div>
                  <div className="timeline-corpo">
                    <p>Ricardo Pereira anexou o documento <strong>Checklist de Inspeção - Estruturas Metálicas</strong>.</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-icone">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
                <div className="timeline-conteudo">
                  <div className="timeline-cabecalho">
                    <span className="timeline-titulo">RFI criado</span>
                    <span className="timeline-data">{new Date(rfi.data_emissao).toLocaleDateString('pt-PT')} às 09:45</span>
                  </div>
                  <div className="timeline-corpo">
                    <p>Ricardo Pereira criou este pedido de informação.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRFI;