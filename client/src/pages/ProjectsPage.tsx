import { useState, useEffect } from 'react';
import { getProjects, deleteProject, Project } from '../services/projectsService';
import { ChangeEvent } from 'react';

// Estenda a interface Project para incluir o campo utilizadores
interface ProjectWithUser extends Project {
  utilizadores?: {
    nome: string;
  };
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    estado: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getProjects(filters);
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError('Não foi possível carregar os projetos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return;
    
    try {
      const { success, error } = await deleteProject(id);
      
      if (!success) throw error;
      
      // Atualizar a lista após exclusão
      fetchProjects();
    } catch (err) {
      console.error('Erro ao excluir projeto:', err);
      setError('Não foi possível excluir o projeto. Por favor, tente novamente.');
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="projects-page">
      <h1>Gestão de Projetos</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            <option value="em curso">Em Curso</option>
            <option value="concluido">Concluídos</option>
            <option value="suspenso">Suspensos</option>
          </select>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/projetos/novo'}
        >
          Novo Projeto
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Carregando projetos...</div>
      ) : (
        <div className="projects-list">
          {projects.length === 0 ? (
            <div className="empty-state">
              Nenhum projeto encontrado. 
              <button onClick={() => window.location.href = '/projetos/novo'}>Criar um projeto</button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Localização</th>
                  <th>Estado</th>
                  <th>Data de Início</th>
                  <th>Responsável</th>
                  <th>Progresso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.nome}</td>
                    <td>{project.localizacao || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${project.estado}`}>
                        {project.estado === 'em curso' ? 'Em Curso' : 
                         project.estado === 'concluido' ? 'Concluído' : 'Suspenso'}
                      </span>
                    </td>
                    <td>{new Date(project.data_inicio).toLocaleDateString()}</td>
                    <td>{project.utilizadores?.nome || 'N/A'}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{width: `${project.progresso || 0}%`}}
                        />
                        <span>{project.progresso || 0}%</span>
                      </div>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-icon"
                        onClick={() => window.location.href = `/projetos/${project.id || ''}`}
                        title="Ver detalhes"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => window.location.href = `/projetos/editar/${project.id || ''}`}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => project.id && handleDelete(project.id)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;