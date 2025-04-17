import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ViewNaoConformidade.css';

// Dados de exemplo para simulação
const dadosExemplo = {
  'NC001': {
    id: 'NC001',
    titulo: 'Desvio na espessura do betão',
    projeto: 'Obra Ferroviária Setúbal',
    descricao: 'Durante inspeção da estrutura de betão no ponto P-32 foi identificada espessura inferior à especificada no projeto. Medição indica 28cm quando o projeto especifica mínimo de 32cm.',
    data: '15/04/2025',
    dataIdentificacao: '15/04/2025',
    gravidade: 'Alta',
    estado: 'Aberta',
    responsavel: 'João Silva',
    prazo: '30/04/2025',
    origem: 'Inspeção Visual',
    tipo: 'Estrutural',
    acaoImediata: 'Interrupção da concretagem nas áreas adjacentes para avaliação estrutural.',
    acaoCorretiva: 'Realizar análise estrutural para verificar impacto na segurança. Se necessário, reforçar a estrutura conforme recomendação do engenheiro estrutural.',
    checklist: 'CL-EST-042',
    anexos: [
      { nome: 'foto_estrutura_p32.jpg', tamanho: '2.4 MB', tipo: 'imagem' },
      { nome: 'medicao_espessura.pdf', tamanho: '1.1 MB', tipo: 'documento' },
      { nome: 'especificacao_tecnica.pdf', tamanho: '3.2 MB', tipo: 'documento' }
    ],
    comentarios: [
      { autor: 'João Silva', data: '15/04/2025 14:32', texto: 'NC identificada durante inspeção de rotina. Equipe notificada sobre a paralisação.' },
      { autor: 'Ricardo Pereira', data: '15/04/2025 16:45', texto: 'Primeira análise indica que não há comprometimento estrutural crítico, mas precisamos de uma avaliação completa.' },
      { autor: 'Ana Costa', data: '16/04/2025 09:15', texto: 'Agendada visita do engenheiro estrutural para amanhã, 17/04.' }
    ],
    timeline: [
      { data: '15/04/2025 14:00', evento: 'Não conformidade identificada', responsavel: 'João Silva' },
      { data: '15/04/2025 14:30', evento: 'Registro inicial criado', responsavel: 'João Silva' },
      { data: '15/04/2025 15:45', evento: 'Notificação enviada ao gestor do projeto', responsavel: 'Sistema' },
      { data: '15/04/2025 16:30', evento: 'Análise preliminar iniciada', responsavel: 'Ricardo Pereira' },
      { data: '16/04/2025 09:00', evento: 'Agendamento de inspeção estrutural', responsavel: 'Ana Costa' }
    ]
  },
  'NC002': {
    id: 'NC002',
    titulo: 'Falta de documentação em ensaio',
    projeto: 'Ponte Vasco da Gama - Manutenção',
    descricao: 'Ensaio de tração realizado sem o preenchimento completo da documentação necessária, incluindo ausência de assinaturas dos responsáveis e não indicação dos equipamentos utilizados.',
    data: '14/04/2025',
    dataIdentificacao: '14/04/2025',
    gravidade: 'Média',
    estado: 'Em tratamento',
    responsavel: 'Ana Costa',
    prazo: '28/04/2025',
    origem: 'Auditoria Interna',
    tipo: 'Documental',
    acaoImediata: 'Identificar todos os ensaios afetados e separar os relatórios incompletos.',
    acaoCorretiva: 'Retreinar a equipe sobre o procedimento correto de documentação de ensaios. Implementar lista de verificação antes da finalização dos relatórios.',
    checklist: 'CL-DOC-018',
    anexos: [
      { nome: 'relatorio_ensaio_incompleto.pdf', tamanho: '1.7 MB', tipo: 'documento' },
      { nome: 'procedimento_documentacao.pdf', tamanho: '2.3 MB', tipo: 'documento' }
    ],
    comentarios: [
      { autor: 'Ana Costa', data: '14/04/2025 11:20', texto: 'Verificados 8 relatórios com o mesmo problema. Todos foram segregados para complementação.' },
      { autor: 'Carlos Oliveira', data: '14/04/2025 15:30', texto: 'Agendado treinamento para equipe de laboratório para 18/04.' }
    ],
    timeline: [
      { data: '14/04/2025 10:00', evento: 'Não conformidade identificada', responsavel: 'Marta Santos' },
      { data: '14/04/2025 10:45', evento: 'Registro inicial criado', responsavel: 'Marta Santos' },
      { data: '14/04/2025 11:15', evento: 'Atribuída à Ana Costa', responsavel: 'Sistema' },
      { data: '14/04/2025 14:30', evento: 'Início da análise de impacto', responsavel: 'Ana Costa' },
      { data: '14/04/2025 15:25', evento: 'Planeamento de ação corretiva', responsavel: 'Carlos Oliveira' }
    ]
  }
};

// Interface para tipagem
interface Anexo {
  nome: string;
  tamanho: string;
  tipo: string;
}

interface Comentario {
  autor: string;
  data: string;
  texto: string;
}

interface EventoTimeline {
  data: string;
  evento: string;
  responsavel: string;
}

interface NaoConformidade {
  id: string;
  titulo: string;
  projeto: string;
  descricao: string;
  data: string;
  dataIdentificacao: string;
  gravidade: string;
  estado: string;
  responsavel: string;
  prazo: string;
  origem: string;
  tipo: string;
  acaoImediata: string;
  acaoCorretiva: string;
  checklist: string;
  anexos: Anexo[];
  comentarios: Comentario[];
  timeline: EventoTimeline[];
}

const ViewNaoConformidade: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [naoConformidade, setNaoConformidade] = useState<NaoConformidade | null>(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [activeTab, setActiveTab] = useState('detalhes');

  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, isto seria uma chamada à API
    if (id && dadosExemplo[id]) {
      setNaoConformidade(dadosExemplo[id]);
    }
  }, [id]);

  const handleAddComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim() || !naoConformidade) return;

    const comentario: Comentario = {
      autor: 'Administrador', // Normalmente viria do usuário logado
      data: new Date().toLocaleString('pt-PT'),
      texto: novoComentario
    };

    // Em um ambiente real, isto enviaria o comentário para a API
    setNaoConformidade({
      ...naoConformidade,
      comentarios: [...naoConformidade.comentarios, comentario]
    });

    setNovoComentario('');
  };

  const getEstadoClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aberta': return 'estado-aberta';
      case 'em tratamento': return 'estado-em-tratamento';
      case 'verificação': return 'estado-verificacao';
      case 'resolvida': return 'estado-resolvida';
      default: return '';
    }
  };

  const getGravidadeClass = (gravidade: string) => {
    switch (gravidade.toLowerCase()) {
      case 'alta': return 'gravidade-alta';
      case 'média': return 'gravidade-media';
      case 'baixa': return 'gravidade-baixa';
      default: return '';
    }
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'imagem': return 'far fa-file-image';
      case 'documento': return 'far fa-file-pdf';
      case 'planilha': return 'far fa-file-excel';
      default: return 'far fa-file';
    }
  };

  if (!naoConformidade) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>A carregar dados...</p>
      </div>
    );
  }

  return (
    <div className="view-nao-conformidade">
      <div className="header-container">
        <div className="back-button">
          <Link to="/nao-conformidades">
            <i className="fas fa-arrow-left"></i> Voltar para a Lista
          </Link>
        </div>
        <div className="header-actions">
          <button className="btn-editar">
            <i className="fas fa-edit"></i> Editar
          </button>
          <button className="btn-exportar">
            <i className="fas fa-file-export"></i> Exportar
          </button>
        </div>
      </div>

      <div className="nc-header">
        <div className="nc-title">
          <h2>{naoConformidade.titulo}</h2>
          <span className="nc-id">{naoConformidade.id}</span>
        </div>
        <div className="nc-badges">
          <span className={`badge ${getGravidadeClass(naoConformidade.gravidade)}`}>
            {naoConformidade.gravidade}
          </span>
          <span className={`badge ${getEstadoClass(naoConformidade.estado)}`}>
            {naoConformidade.estado}
          </span>
        </div>
      </div>

      <div className="nc-tabs">
        <button 
          className={`tab-btn ${activeTab === 'detalhes' ? 'active' : ''}`}
          onClick={() => setActiveTab('detalhes')}
        >
          <i className="fas fa-info-circle"></i> Detalhes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'acoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('acoes')}
        >
          <i className="fas fa-tasks"></i> Ações
        </button>
        <button 
          className={`tab-btn ${activeTab === 'anexos' ? 'active' : ''}`}
          onClick={() => setActiveTab('anexos')}
        >
          <i className="fas fa-paperclip"></i> Anexos
          <span className="badge-count">{naoConformidade.anexos.length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comentarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('comentarios')}
        >
          <i className="fas fa-comments"></i> Comentários
          <span className="badge-count">{naoConformidade.comentarios.length}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <i className="fas fa-history"></i> Timeline
        </button>
      </div>

      <div className="nc-content">
        {activeTab === 'detalhes' && (
          <div className="detalhes-content">
            <div className="info-section">
              <div className="info-row">
                <div className="info-group">
                  <label>Projeto</label>
                  <p>{naoConformidade.projeto}</p>
                </div>
                <div className="info-group">
                  <label>Data de Identificação</label>
                  <p>{naoConformidade.dataIdentificacao}</p>
                </div>
                <div className="info-group">
                  <label>Responsável</label>
                  <p>{naoConformidade.responsavel}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group">
                  <label>Origem</label>
                  <p>{naoConformidade.origem}</p>
                </div>
                <div className="info-group">
                  <label>Tipo</label>
                  <p>{naoConformidade.tipo}</p>
                </div>
                <div className="info-group">
                  <label>Prazo</label>
                  <p>{naoConformidade.prazo}</p>
                </div>
              </div>

              <div className="info-row">
                <div className="info-group full-width">
                  <label>Descrição</label>
                  <p className="descricao-text">{naoConformidade.descricao}</p>
                </div>
              </div>

              {naoConformidade.checklist && (
                <div className="info-row">
                  <div className="info-group">
                    <label>Checklist Relacionada</label>
                    <p>
                      <Link to={`/checklists/${naoConformidade.checklist}`}>
                        {naoConformidade.checklist}
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'acoes' && (
          <div className="acoes-content">
            <div className="acao-section">
              <h3>Ação Imediata</h3>
              <p>{naoConformidade.acaoImediata || 'Nenhuma ação imediata registada.'}</p>
            </div>

            <div className="acao-section">
              <h3>Ação Corretiva</h3>
              <p>{naoConformidade.acaoCorretiva || 'Nenhuma ação corretiva registada.'}</p>
            </div>

            <div className="acao-section">
              <h3>Estado de Implementação</h3>
              <div className="progress-bar">
                <div 
                  className={`progress ${getEstadoClass(naoConformidade.estado)}`}
                  style={{ width: naoConformidade.estado === 'Resolvida' ? '100%' : 
                           naoConformidade.estado === 'Verificação' ? '75%' : 
                           naoConformidade.estado === 'Em tratamento' ? '50%' : '25%' }}
                >
                </div>
              </div>
              <div className="progress-labels">
                <span>Aberta</span>
                <span>Em tratamento</span>
                <span>Verificação</span>
                <span>Resolvida</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'anexos' && (
          <div className="anexos-content">
            {naoConformidade.anexos.length === 0 ? (
              <p className="no-data">Nenhum anexo disponível.</p>
            ) : (
              <div className="anexos-grid">
                {naoConformidade.anexos.map((anexo, index) => (
                  <div key={index} className="anexo-card">
                    <div className="anexo-icon">
                      <i className={getFileIcon(anexo.tipo)}></i>
                    </div>
                    <div className="anexo-info">
                      <p className="anexo-nome">{anexo.nome}</p>
                      <p className="anexo-tamanho">{anexo.tamanho}</p>
                    </div>
                    <div className="anexo-actions">
                      <button className="btn-download">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="btn-preview">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="add-anexo">
              <button className="btn-add-anexo">
                <i className="fas fa-plus"></i> Adicionar Anexo
              </button>
            </div>
          </div>
        )}

        {activeTab === 'comentarios' && (
          <div className="comentarios-content">
            <div className="comentarios-list">
              {naoConformidade.comentarios.length === 0 ? (
                <p className="no-data">Nenhum comentário disponível.</p>
              ) : (
                naoConformidade.comentarios.map((comentario, index) => (
                  <div key={index} className="comentario">
                    <div className="comentario-header">
                      <span className="comentario-autor">{comentario.autor}</span>
                      <span className="comentario-data">{comentario.data}</span>
                    </div>
                    <div className="comentario-texto">
                      {comentario.texto}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="novo-comentario">
              <form onSubmit={handleAddComentario}>
                <textarea
                  placeholder="Adicionar um comentário..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  required
                ></textarea>
                <button type="submit" className="btn-comentar">
                  <i className="fas fa-paper-plane"></i> Enviar
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-content">
            <div className="timeline">
              {naoConformidade.timeline.map((evento, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{evento.data}</div>
                    <div className="timeline-evento">{evento.evento}</div>
                    <div className="timeline-responsavel">
                      <span className="responsavel-label">Responsável:</span> {evento.responsavel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNaoConformidade;