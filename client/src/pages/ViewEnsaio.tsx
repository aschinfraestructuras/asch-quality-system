import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/ViewEnsaio.css';

// Definição de tipos
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
  description?: string;
  equipment: string[];
  samples: Sample[];
  results: Result[];
}

interface Sample {
  id: string;
  code: string;
  description: string;
  collectionDate: string;
  collectionLocation: string;
}

interface Result {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  minValue?: string;
  maxValue?: string;
  isConform?: boolean;
}

// Dados de exemplo para um ensaio específico
const ensaioExample: Ensaio = {
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
  approvedAt: '16/04/2025',
  description: 'Ensaio de compressão em corpos de prova cilíndricos de concreto retirados da estrutura do pilar P12 do Bloco B. Realizado conforme especificações da norma NBR 5739.',
  equipment: [
    'Prensa Hidráulica 200t',
    'Moldes Cilíndricos 15x30cm',
    'Retífica de Corpos de Prova'
  ],
  samples: [
    {
      id: '1',
      code: 'CP-001',
      description: 'Corpo de prova cilíndrico 15x30cm, extraído do pilar P12 do Bloco B.',
      collectionDate: '10/04/2025',
      collectionLocation: 'Pilar P12, Bloco B'
    },
    {
      id: '2',
      code: 'CP-002',
      description: 'Corpo de prova cilíndrico 15x30cm, extraído do pilar P12 do Bloco B.',
      collectionDate: '10/04/2025',
      collectionLocation: 'Pilar P12, Bloco B'
    },
    {
      id: '3',
      code: 'CP-003',
      description: 'Corpo de prova cilíndrico 15x30cm, extraído do pilar P12 do Bloco B.',
      collectionDate: '10/04/2025',
      collectionLocation: 'Pilar P12, Bloco B'
    }
  ],
  results: [
    {
      id: 'result-1',
      parameter: 'Resistência à Compressão',
      value: '32',
      unit: 'MPa',
      minValue: '25',
      maxValue: '40',
      isConform: true
    },
    {
      id: 'result-2',
      parameter: 'Diâmetro do Corpo de Prova',
      value: '150',
      unit: 'mm',
      isConform: true
    },
    {
      id: 'result-3',
      parameter: 'Altura do Corpo de Prova',
      value: '300',
      unit: 'mm',
      isConform: true
    },
    {
      id: 'result-4',
      parameter: 'Idade',
      value: '28',
      unit: 'dias',
      isConform: true
    }
  ]
};

// Histórico de atividades de exemplo
const activityHistory = [
  {
    id: 1,
    action: 'Ensaio criado',
    user: 'Carlos Santos',
    date: '12/04/2025 09:32',
    details: 'Ensaio registado no sistema'
  },
  {
    id: 2,
    action: 'Amostras adicionadas',
    user: 'Carlos Santos',
    date: '13/04/2025 14:15',
    details: 'Adicionadas 3 amostras do tipo cilindro 15x30cm'
  },
  {
    id: 3,
    action: 'Ensaio realizado',
    user: 'Carlos Santos',
    date: '15/04/2025 10:45',
    details: 'Teste realizado com prensa hidráulica 200t'
  },
  {
    id: 4,
    action: 'Resultados registados',
    user: 'Carlos Santos',
    date: '15/04/2025 11:30',
    details: 'Resultado principal: 32 MPa'
  },
  {
    id: 5,
    action: 'Ensaio aprovado',
    user: 'Maria Oliveira',
    date: '16/04/2025 09:15',
    details: 'Ensaio verificado e aprovado'
  }
];

const ViewEnsaioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ensaio, setEnsaio] = useState<Ensaio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resultados');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    // Simulação de chamada à API
    setTimeout(() => {
      setEnsaio(ensaioExample);
      setLoading(false);
    }, 500);
  }, [id]);

  // Função para apresentar o resultado do ensaio
  const getResultSummary = () => {
    if (!ensaio) return '';
    
    const mainResult = ensaio.results.find(r => r.parameter.includes('Resistência') || r.parameter.includes('Valor'));
    if (mainResult) {
      return `${mainResult.value} ${mainResult.unit}`;
    }
    return 'N/A';
  };

  // Função para obter a classe de status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Conforme':
        return 'status-conforme';
      case 'Não Conforme':
        return 'status-nao-conforme';
      case 'Em análise':
        return 'status-em-analise';
      case 'Pendente de aprovação':
        return 'status-pendente';
      default:
        return '';
    }
  };

  // Função para aprovar ensaio
  const handleApproval = (approved: boolean) => {
    // Simulação de chamada à API para aprovação
    console.log(`Ensaio ${approved ? 'aprovado' : 'rejeitado'}: ${approvalComment}`);
    
    // Atualizar estado local
    if (ensaio) {
      setEnsaio({
        ...ensaio,
        status: approved ? 'Conforme' : 'Não Conforme',
        approvedBy: 'Utilizador Atual',
        approvedAt: new Date().toLocaleDateString('pt-PT')
      });
    }
    
    setShowApprovalModal(false);
    setApprovalComment('');
  };

  if (loading) {
    return <div className="loading-container">A carregar detalhes do ensaio...</div>;
  }

  if (!ensaio) {
    return (
      <div className="not-found-container">
        <h2>Ensaio não encontrado</h2>
        <p>O ensaio com ID {id} não existe ou foi removido.</p>
        <Link to="/ensaios" className="back-link">Voltar para lista de ensaios</Link>
      </div>
    );
  }

  return (
    <div className="view-ensaio-container">
      <div className="view-ensaio-header">
        <div className="back-button-container">
          <button 
            onClick={() => navigate('/ensaios')}
            className="back-button"
          >
            ← Voltar
          </button>
        </div>
        
        <div className="ensaio-title-container">
          <h1>{ensaio.name}</h1>
          <div className="ensaio-subtitle">
            <span className="ensaio-id">ID: {ensaio.id}</span>
            <span className={`status-badge ${getStatusClass(ensaio.status)}`}>
              {ensaio.status}
            </span>
          </div>
        </div>
        
        <div className="actions-container">
          <Link to={`/ensaios/${id}/editar`} className="edit-btn">
            Editar
          </Link>
          
          {ensaio.status === 'Pendente de aprovação' && (
            <button 
              className="approve-btn"
              onClick={() => setShowApprovalModal(true)}
            >
              Aprovar/Rejeitar
            </button>
          )}
          
          <button className="print-btn">
            Imprimir
          </button>
        </div>
      </div>

      <div className="ensaio-info-container">
        <div className="ensaio-overview">
          <div className="info-panel">
            <h2>Informações Gerais</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tipo:</span>
                <span>{ensaio.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Projeto:</span>
                <span>{ensaio.project}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Material:</span>
                <span>{ensaio.material}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Norma:</span>
                <span>{ensaio.normReference}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Data do Ensaio:</span>
                <span>{ensaio.testDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Técnico:</span>
                <span>{ensaio.createdBy}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Resultado:</span>
                <span className="result-value">{getResultSummary()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Aprovação:</span>
                <span>{ensaio.approvedBy ? `${ensaio.approvedBy} em ${ensaio.approvedAt}` : 'Pendente'}</span>
              </div>
            </div>
            
            {ensaio.description && (
              <div className="description-panel">
                <h3>Descrição</h3>
                <p>{ensaio.description}</p>
              </div>
            )}
            
            {ensaio.equipment && ensaio.equipment.length > 0 && (
              <div className="equipment-panel">
                <h3>Equipamentos Utilizados</h3>
                <ul className="equipment-list">
                  {ensaio.equipment.map((equipment, index) => (
                    <li key={index}>{equipment}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'resultados' ? 'active' : ''}`}
            onClick={() => setActiveTab('resultados')}
          >
            Resultados
          </button>
          <button 
            className={`tab-btn ${activeTab === 'amostras' ? 'active' : ''}`}
            onClick={() => setActiveTab('amostras')}
          >
            Amostras
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            Histórico
          </button>
          <button 
            className={`tab-btn ${activeTab === 'anexos' ? 'active' : ''}`}
            onClick={() => setActiveTab('anexos')}
          >
            Anexos
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'resultados' && (
            <div className="results-tab">
              <h2>Resultados do Ensaio</h2>
              
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Parâmetro</th>
                    <th>Valor</th>
                    <th>Unidade</th>
                    <th>Critério</th>
                    <th>Conformidade</th>
                  </tr>
                </thead>
                <tbody>
                  {ensaio.results.map(result => (
                    <tr key={result.id}>
                      <td>{result.parameter}</td>
                      <td className="value-cell">{result.value}</td>
                      <td>{result.unit}</td>
                      <td>
                        {result.minValue && result.maxValue 
                          ? `${result.minValue} - ${result.maxValue} ${result.unit}`
                          : result.minValue 
                            ? `≥ ${result.minValue} ${result.unit}`
                            : result.maxValue 
                              ? `≤ ${result.maxValue} ${result.unit}`
                              : 'N/A'
                        }
                      </td>
                      <td className="conformity-cell">
                        {result.isConform !== undefined ? (
                          <span className={`conformity-badge ${
                            result.isConform 
                              ? 'conform' 
                              : 'non-conform'
                          }`}>
                            {result.isConform 
                              ? 'Conforme' 
                              : 'Não Conforme'}
                          </span>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="results-chart">
                <h3>Representação Gráfica</h3>
                <div className="chart-placeholder">
                  {/* Aqui seria colocado o gráfico com biblioteca como Recharts */}
                  <div className="placeholder-text">Gráfico de resultados</div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'amostras' && (
            <div className="samples-tab">
              <h2>Amostras</h2>
              
              <div className="samples-grid">
                {ensaio.samples.map(sample => (
                  <div key={sample.id} className="sample-card">
                    <div className="sample-header">
                      <h3>{sample.code}</h3>
                    </div>
                    <div className="sample-details">
                      <div className="sample-detail">
                        <span className="detail-label">Data de Coleta:</span>
                        <span>{sample.collectionDate}</span>
                      </div>
                      <div className="sample-detail">
                        <span className="detail-label">Local de Coleta:</span>
                        <span>{sample.collectionLocation}</span>
                      </div>
                      <div className="sample-detail">
                        <span className="detail-label">Descrição:</span>
                        <span>{sample.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'historico' && (
            <div className="history-tab">
              <h2>Histórico de Atividades</h2>
              
              <div className="timeline">
                {activityHistory.map(activity => (
                  <div key={activity.id} className="timeline-item">
                    <div className="timeline-point"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="activity-action">{activity.action}</span>
                        <span className="activity-date">{activity.date}</span>
                      </div>
                      <div className="activity-user">{activity.user}</div>
                      <div className="activity-details">{activity.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'anexos' && (
            <div className="attachments-tab">
              <h2>Anexos</h2>
              
              <div className="attachments-tools">
                <button className="add-attachment-btn">
                  + Adicionar Anexo
                </button>
              </div>
              
              <div className="attachments-list">
                <div className="attachment-item">
                  <div className="attachment-icon">PDF</div>
                  <div className="attachment-info">
                    <div className="attachment-name">Relatório_Compressão_CP001.pdf</div>
                    <div className="attachment-meta">
                      <span>Adicionado por Carlos Santos em 15/04/2025</span>
                      <span>2.4 MB</span>
                    </div>
                  </div>
                  <div className="attachment-actions">
                    <button className="download-btn">Baixar</button>
                    <button className="delete-btn">Remover</button>
                  </div>
                </div>
                
                <div className="attachment-item">
                  <div className="attachment-icon">IMG</div>
                  <div className="attachment-info">
                    <div className="attachment-name">Foto_Corpo_Prova.jpg</div>
                    <div className="attachment-meta">
                      <span>Adicionado por Carlos Santos em 15/04/2025</span>
                      <span>1.8 MB</span>
                    </div>
                  </div>
                  <div className="attachment-actions">
                    <button className="download-btn">Baixar</button>
                    <button className="delete-btn">Remover</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showApprovalModal && (
        <div className="modal-overlay">
          <div className="approval-modal">
            <h2>Aprovar/Rejeitar Ensaio</h2>
            
            <div className="approval-form">
              <div className="form-group">
                <label htmlFor="approvalComment">Comentários</label>
                <textarea
                  id="approvalComment"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Insira observações ou comentários (opcional)"
                  rows={4}
                />
              </div>
              
              <div className="approval-buttons">
                <button 
                  className="reject-btn"
                  onClick={() => handleApproval(false)}
                >
                  Rejeitar
                </button>
                <button 
                  className="approve-btn"
                  onClick={() => handleApproval(true)}
                >
                  Aprovar
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEnsaioPage;