import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, deleteProject } from '../services/projectsService';
import '../styles/projects.css';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await getProjectById(id);
        
        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Erro ao carregar detalhes do projeto:', err);
        setError('Não foi possível carregar os detalhes do projeto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      const { success, error } = await deleteProject(id);
      
      if (!success) throw error;
      
      navigate('/projetos');
    } catch (err) {
      console.error('Erro ao excluir projeto:', err);
      setError('Não foi possível excluir o projeto.');
    }
  };

  if (loading) {
    return <div className="loading">Carregando detalhes do projeto...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div className="not-found">Projeto não encontrado.</div>;
  }

  return (
    <div className="project-details-container">
      <div className="page-header">
        <h1>{project.nome}</h1>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate('/projetos')}
          >
            Voltar
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate(`/projetos/editar/${id}`)}
          >
            Editar
          </button>
          <button 
            className="btn-danger"
            onClick={handleDelete}
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="project-details-card">
        <div className="project-status">
          <span className={`status-badge ${project.estado}`}>
            {project.estado === 'em curso' ? 'Em Curso' : 
             project.estado === 'concluido' ? 'Concluído' : 'Suspenso'}
          </span>
          {project.progresso !== undefined && (
            <div className="progress-container">
              <div className="progress-label">Progresso: {project.progresso}%</div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{width: `${project.progresso}%`}}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Descrição</div>
            <div className="detail-value">{project.descricao || 'Nenhuma descrição disponível'}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Localização</div>
            <div className="detail-value">{project.localizacao || 'Não especificada'}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Data de Início</div>
            <div className="detail-value">
              {project.data_inicio ? new Date(project.data_inicio).toLocaleDateString() : 'Não definida'}
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Data de Conclusão</div>
            <div className="detail-value">
              {project.data_fim ? new Date(project.data_fim).toLocaleDateString() : 'Não definida'}
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Responsável</div>
            <div className="detail-value">{project.utilizadores?.nome || 'Não definido'}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Criado em</div>
            <div className="detail-value">
              {project.created_at ? new Date(project.created_at).toLocaleString() : 'Não disponível'}
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-label">Última atualização</div>
            <div className="detail-value">
              {project.updated_at ? new Date(project.updated_at).toLocaleString() : 'Não disponível'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Aqui você pode adicionar mais seções relacionadas ao projeto */}
      {/* Por exemplo: Documentos, Tarefas, Histórico de alterações, etc. */}
    </div>
  );
};

export default ProjectDetails;