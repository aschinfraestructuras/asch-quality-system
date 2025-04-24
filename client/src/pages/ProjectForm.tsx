import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, createProject, updateProject, Project, getUsers } from '../services/projectsService';
import { supabase } from '../services/supabaseClient';
import '../styles/projects.css';


interface User {
  id: string;
  nome: string;
}

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [project, setProject] = useState<Project>({
    nome: '',
    descricao: '',
    localizacao: '',
    estado: 'em curso',
    data_inicio: new Date().toISOString().split('T')[0],
    id_utilizador_responsavel: '',
    progresso: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await getUsers();
        
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Erro ao buscar utilizadores:', err);
        setError('Não foi possível carregar a lista de utilizadores.');
      }
    };
    
    fetchUsers();
    fetchUsers();
    
    if (isEditMode && id) {
      const fetchProject = async () => {
        setLoading(true);
        
        try {
          const { data, error } = await getProjectById(id);
          
          if (error) throw error;
          
          if (data) {
            setProject({
              ...data,
              data_inicio: data.data_inicio ? new Date(data.data_inicio).toISOString().split('T')[0] : '',
              data_fim: data.data_fim ? new Date(data.data_fim).toISOString().split('T')[0] : ''
            });
          }
        } catch (err) {
          console.error('Erro ao buscar detalhes do projeto:', err);
          setError('Não foi possível carregar os detalhes do projeto.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProject(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      
      if (isEditMode && id) {
        result = await updateProject(id, project);
      } else {
        result = await createProject(project);
      }
      
      if (result.error) throw result.error;
      
      navigate('/projetos');
    } catch (err) {
      console.error('Erro ao salvar projeto:', err);
      setError('Erro ao salvar o projeto. Por favor, verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div className="loading">Carregando detalhes do projeto...</div>;
  }
  
  return (
    <div className="project-form-container">
      <h1>{isEditMode ? 'Editar Projeto' : 'Novo Projeto'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Projeto*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={project.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={project.descricao || ''}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="localizacao">Localização</label>
            <input
              type="text"
              id="localizacao"
              name="localizacao"
              value={project.localizacao || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estado">Estado*</label>
            <select
              id="estado"
              name="estado"
              value={project.estado}
              onChange={handleChange}
              required
            >
              <option value="em curso">Em Curso</option>
              <option value="concluido">Concluído</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data_inicio">Data de Início*</label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={project.data_inicio}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="data_fim">Data de Conclusão</label>
            <input
              type="date"
              id="data_fim"
              name="data_fim"
              value={project.data_fim || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="id_utilizador_responsavel">Responsável*</label>
            <select
              id="id_utilizador_responsavel"
              name="id_utilizador_responsavel"
              value={project.id_utilizador_responsavel}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um responsável</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="progresso">Progresso (%)</label>
            <input
              type="number"
              id="progresso"
              name="progresso"
              min="0"
              max="100"
              value={project.progresso || 0}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/projetos')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Projeto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;