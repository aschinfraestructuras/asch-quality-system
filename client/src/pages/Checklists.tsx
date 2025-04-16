import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Checklists.css';
import { Routes, Route } from 'react-router-dom';
import NewChecklist from './NewChecklist';
import ViewChecklist from './ViewChecklist';


// Dados de exemplo para checklists
const checklistsData = [
  {
    id: 1,
    name: 'Recebimento de Aço CA-50',
    type: 'Recebimento de Materiais',
    project: 'Obra Ferroviária Setúbal',
    status: 'Completo',
    completion: 100,
    createdBy: 'João Silva',
    createdAt: '12/04/2025',
    updatedAt: '14/04/2025'
  },
  {
    id: 2,
    name: 'Inspeção de Formas para Concretagem',
    type: 'Inspeção de Execução',
    project: 'Ponte Vasco da Gama - Manutenção',
    status: 'Em andamento',
    completion: 60,
    createdBy: 'Maria Oliveira',
    createdAt: '13/04/2025',
    updatedAt: '15/04/2025'
  },
  {
    id: 3,
    name: 'Verificação de Qualidade do Balastro',
    type: 'Controle de Materiais',
    project: 'Obra Ferroviária Setúbal',
    status: 'Pendente de aprovação',
    completion: 100,
    createdBy: 'Carlos Santos',
    createdAt: '10/04/2025',
    updatedAt: '14/04/2025'
  },
  {
    id: 4,
    name: 'Inspeção de Soldas',
    type: 'Inspeção de Execução',
    project: 'Ampliação Terminal Portuário',
    status: 'Não conforme',
    completion: 100,
    createdBy: 'Ana Pereira',
    createdAt: '11/04/2025',
    updatedAt: '14/04/2025'
  },
  {
    id: 5,
    name: 'Verificação de EPI em Canteiro',
    type: 'Segurança do Trabalho',
    project: 'Ponte Vasco da Gama - Manutenção',
    status: 'Completo',
    completion: 100,
    createdBy: 'Pedro Costa',
    createdAt: '09/04/2025',
    updatedAt: '10/04/2025'
  }
];

// Tipos de checklists para filtro
const checklistTypes = [
  'Todos os tipos',
  'Recebimento de Materiais',
  'Inspeção de Execução',
  'Controle de Materiais',
  'Segurança do Trabalho',
  'Verificação de Projetos'
];

// Status para filtro
const statusOptions = [
  'Todos os status',
  'Completo',
  'Em andamento',
  'Pendente de aprovação',
  'Não conforme'
];

// Projetos para filtro
const projectOptions = [
  'Todos os projetos',
  'Obra Ferroviária Setúbal',
  'Ponte Vasco da Gama - Manutenção',
  'Ampliação Terminal Portuário'
];

const Checklists = () => {
  // Estado para navegação
  const navigate = useNavigate();
  
  // Estados para gerenciar filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos os tipos');
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [projectFilter, setProjectFilter] = useState('Todos os projetos');

  // Função para filtrar os checklists
  const filteredChecklists = checklistsData.filter(checklist => {
    const matchesSearch = checklist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos os tipos' || checklist.type === typeFilter;
    const matchesStatus = statusFilter === 'Todos os status' || checklist.status === statusFilter;
    const matchesProject = projectFilter === 'Todos os projetos' || checklist.project === projectFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesProject;
  });

  // Função para navegar para a página de novo checklist
  const handleNewChecklist = () => {
   navigate('/checklists/new');

  };

  // Função para navegar para a página de visualização de um checklist
  const handleViewChecklist = (id: number) => {
     navigate(`/checklists/view/${id}`);

 
  };

  return (
    <div className="checklists-page">
      <div className="page-header">
        <h1>Checklists</h1>
        <button className="btn-primary new-checklist-btn" onClick={handleNewChecklist}>Novo Checklist</button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Pesquisar checklists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            {checklistTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select 
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="filter-select"
          >
            {projectOptions.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="checklists-container">
        <table className="checklists-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Projeto</th>
              <th>Status</th>
              <th>Progresso</th>
              <th>Criado por</th>
              <th>Data de criação</th>
              <th>Última atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredChecklists.map(checklist => (
              <tr key={checklist.id}>
                <td className="checklist-name">
                 <Link to={`/checklists/view/${checklist.id}`}>{checklist.name}</Link>

                </td>
                <td className="checklist-type">{checklist.type}</td>
                <td className="checklist-project">{checklist.project}</td>
                <td>
                  <span className={`status-badge status-${checklist.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {checklist.status}
                  </span>
                </td>
                <td>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${checklist.completion}%` }}
                      title={`${checklist.completion}% concluído`}
                    ></div>
                  </div>
                </td>
                <td>{checklist.createdBy}</td>
                <td>{checklist.createdAt}</td>
                <td>{checklist.updatedAt}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view-btn" 
                    title="Visualizar"
                    onClick={() => handleViewChecklist(checklist.id)}
                  >
                    👁️
                  </button>
                  <button className="action-btn edit-btn" title="Editar">✏️</button>
                  <button className="action-btn delete-btn" title="Excluir">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredChecklists.length === 0 && (
        <div className="no-results">
          <p>Nenhum checklist encontrado com os filtros atuais.</p>
          <button
            className="btn-outline-primary"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('Todos os tipos');
              setStatusFilter('Todos os status');
              setProjectFilter('Todos os projetos');
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Rotas internas do módulo Checklists */}
      <Routes>
        <Route path="new" element={<NewChecklist />} />
        <Route path="view/:id" element={<ViewChecklist />} />
      </Routes>
    </div>
  );
};

export default Checklists;