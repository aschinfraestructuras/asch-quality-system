import { useState } from 'react';
import '../styles/ViewChecklist.css';
import EvidenceUploader from '../components/EvidenceUploader';

// Dados de exemplo de um checklist preenchido
const checklistData = {
  id: 1,
  name: 'Recebimento de Aço CA-50',
  project: 'Obra Ferroviária Setúbal',
  type: 'Recebimento de Materiais',
  status: 'Em andamento',
  completion: 60,
  createdBy: 'João Silva',
  createdAt: '12/04/2025',
  updatedAt: '14/04/2025',
  dueDate: '20/04/2025',
  responsible: 'Maria Oliveira',
  approver: 'Pedro Costa',
  location: 'Bloco B - Fundações',
  description: 'Checklist para verificação do recebimento de aço CA-50 para as fundações do Bloco B.',
  groups: [
    {
      id: 1,
      title: 'Verificação de documentação',
      items: [
        { 
          id: 101, 
          text: 'Nota fiscal confere com o pedido de compra',
          required: true,
          status: 'Conforme',
          comments: 'Nota fiscal nº 123456',
          evidence: 'nota-fiscal.jpg'
        },
        { 
          id: 102, 
          text: 'Certificado de qualidade do fabricante',
          required: true,
          status: 'Não conforme',
          comments: 'Certificado não fornecido pelo fornecedor',
          evidence: null
        },
        { 
          id: 103, 
          text: 'Laudo técnico',
          required: false,
          status: 'Não aplicável',
          comments: '',
          evidence: null
        },
      ]
    },
    {
      id: 2,
      title: 'Inspeção visual',
      items: [
        { 
          id: 201, 
          text: 'Material sem danos aparentes',
          required: true,
          status: 'Conforme',
          comments: '',
          evidence: 'inspecao-visual-1.jpg'
        },
        { 
          id: 202, 
          text: 'Sem oxidação excessiva',
          required: true,
          status: 'Conforme',
          comments: 'Leve oxidação superficial dentro do aceitável',
          evidence: 'inspecao-visual-2.jpg'
        },
        { 
          id: 203, 
          text: 'Identificação do material visível',
          required: true,
          status: 'Conforme',
          comments: '',
          evidence: 'identificacao.jpg'
        },
      ]
    },
    {
      id: 3,
      title: 'Verificação de especificações',
      items: [
        { 
          id: 301, 
          text: 'Diâmetro conforme especificado',
          required: true,
          status: 'A verificar',
          comments: '',
          evidence: null
        },
        { 
          id: 302, 
          text: 'Quantidade conforme pedido',
          required: true,
          status: 'A verificar',
          comments: '',
          evidence: null
        },
      ]
    }
  ],
  comments: [
    {
      id: 1,
      user: 'João Silva',
      role: 'Engenheiro de Qualidade',
      date: '13/04/2025 10:45',
      text: 'O fornecedor deve providenciar o certificado de qualidade ausente até o dia 16/04.'
    },
    {
      id: 2,
      user: 'Maria Oliveira',
      role: 'Supervisora de Obras',
      date: '14/04/2025 08:30',
      text: 'Contactei o fornecedor sobre o certificado de qualidade. Eles enviarão hoje por e-mail.'
    }
  ]
};

const ViewChecklist = () => {
  // Estado para controlar a exibição de comentários
  const [showAllComments, setShowAllComments] = useState(false);
  
  // Calcular estatísticas do checklist
  const totalItems = checklistData.groups.reduce(
    (acc, group) => acc + group.items.length, 0
  );
  
  const completedItems = checklistData.groups.reduce(
    (acc, group) => acc + group.items.filter(
      item => item.status === 'Conforme' || item.status === 'Não conforme' || item.status === 'Não aplicável'
    ).length, 0
  );
  
  const conformItems = checklistData.groups.reduce(
    (acc, group) => acc + group.items.filter(
      item => item.status === 'Conforme'
    ).length, 0
  );
  
  const nonConformItems = checklistData.groups.reduce(
    (acc, group) => acc + group.items.filter(
      item => item.status === 'Não conforme'
    ).length, 0
  );

  // Função para obter a classe CSS baseada no status
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Conforme':
        return 'status-conform';
      case 'Não conforme':
        return 'status-nonconform';
      case 'Não aplicável':
        return 'status-na';
      case 'A verificar':
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="view-checklist-page">
      <div className="checklist-header">
        <div className="header-title">
          <h1>{checklistData.name}</h1>
          <span className={`status-badge status-${checklistData.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {checklistData.status}
          </span>
        </div>
        
        <div className="header-actions">
          <button className="btn-primary">Editar</button>
          <button className="btn-outline-primary">Exportar PDF</button>
          <div className="dropdown">
            <button className="btn-outline-primary">Mais Ações ▼</button>
            <div className="dropdown-content">
              <a href="#">Duplicar Checklist</a>
              <a href="#">Compartilhar</a>
              <a href="#">Arquivar</a>
              <a href="#" className="text-danger">Excluir</a>
            </div>
          </div>
        </div>
      </div>

      <div className="checklist-info-grid">
        <div className="info-card">
          <div className="info-label">Projeto</div>
          <div className="info-value">{checklistData.project}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Tipo</div>
          <div className="info-value">{checklistData.type}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Responsável</div>
          <div className="info-value">{checklistData.responsible}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Aprovador</div>
          <div className="info-value">{checklistData.approver}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Localização</div>
          <div className="info-value">{checklistData.location}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Data de Criação</div>
          <div className="info-value">{checklistData.createdAt}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Última Atualização</div>
          <div className="info-value">{checklistData.updatedAt}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Data Limite</div>
          <div className="info-value">{checklistData.dueDate}</div>
        </div>
      </div>

      {checklistData.description && (
        <div className="checklist-description">
          <h3>Descrição</h3>
          <p>{checklistData.description}</p>
        </div>
      )}

      <div className="checklist-stats">
        <div className="stat-card">
          <div className="stat-value">{completedItems}/{totalItems}</div>
          <div className="stat-label">Itens Verificados</div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(completedItems/totalItems)*100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{conformItems}</div>
          <div className="stat-label">Conformes</div>
          <div className="stat-icon conform">✓</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{nonConformItems}</div>
          <div className="stat-label">Não Conformes</div>
          <div className="stat-icon nonconform">✗</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{totalItems - completedItems}</div>
          <div className="stat-label">Pendentes</div>
          <div className="stat-icon pending">!</div>
        </div>
      </div>

      <div className="checklist-content">
        {checklistData.groups.map(group => (
          <div key={group.id} className="checklist-group">
            <div className="group-header">
              <h3>{group.title}</h3>
            </div>
            
            <div className="group-items">
              {group.items.map(item => (
                <div key={item.id} className="checklist-item">
                  <div className="item-header">
                    <div className="item-text">
                      {item.text}
                      {item.required && <span className="required-tag">Obrigatório</span>}
                    </div>
                    <div className={`item-status ${getStatusClass(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                  
                  {(item.comments || item.evidence) && (
                    <div className="item-details">
                      {item.comments && (
                        <div className="item-comments">
                          <span className="details-label">Comentários:</span>
                          <span className="details-value">{item.comments}</span>
                        </div>
                      )}
                      
                      {item.evidence && (
  <div className="item-evidence">
    <span className="details-label">Evidência:</span>
    <div className="evidence-thumbnail">
      <span className="thumbnail-placeholder">📷</span>
      <span className="evidence-filename">{item.evidence}</span>
    </div>

    {/* Área de upload para novas evidências */}
    <div className="item-evidence-upload">
      <span className="details-label">Adicionar Evidência:</span>
      <EvidenceUploader 
        onUpload={(fileData) => {
          console.log("Arquivo enviado:", fileData);
          // Em um cenário real, aqui você salvaria a evidência
          alert(`Evidência "${fileData.name}" adicionada com sucesso!`);
        }} 
      />
    </div>
  </div>
)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-comments">
        <h3>Comentários</h3>
        
        <div className="comments-list">
          {(showAllComments ? checklistData.comments : checklistData.comments.slice(0, 2)).map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <div className="user-avatar">{comment.user.charAt(0)}</div>
                  <div className="user-info">
                    <div className="user-name">{comment.user}</div>
                    <div className="user-role">{comment.role}</div>
                  </div>
                </div>
                <div className="comment-date">{comment.date}</div>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </div>
        
        {checklistData.comments.length > 2 && (
          <button 
            className="btn-link show-more" 
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Mostrar menos' : `Ver todos os ${checklistData.comments.length} comentários`}
          </button>
        )}
        
        <div className="add-comment">
          <textarea 
            placeholder="Adicionar um comentário..." 
            rows={3}
            className="comment-input"
          ></textarea>
          <button className="btn-primary add-comment-btn">Comentar</button>
        </div>
      </div>

      <div className="checklist-activity">
        <h3>Atividade</h3>
        
        <div className="activity-timeline">
          <div className="timeline-item">
            <div className="timeline-icon">✏️</div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-user">Maria Oliveira atualizou este checklist</div>
                <div className="timeline-date">14/04/2025 08:30</div>
              </div>
              <div className="timeline-details">Status alterado para "Em andamento"</div>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-icon">📝</div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-user">João Silva criou este checklist</div>
                <div className="timeline-date">12/04/2025 15:20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="checklist-actions">
        <button className="btn-outline-danger">Rejeitar</button>
        <button className="btn-success">Aprovar</button>
      </div>
    </div>
  );
};

export default ViewChecklist;