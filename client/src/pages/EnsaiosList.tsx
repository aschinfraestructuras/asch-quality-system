import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Ensaios.css';

// Definição de tipos para ensaios
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
}

// Dados de exemplo para ensaios
const ensaiosData: Ensaio[] = [
  {
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
    approvedAt: '16/04/2025'
  },
  {
    id: 2,
    name: 'Análise Granulométrica - Balastro',
    type: 'Granulométrica',
    project: 'Obra Ferroviária Setúbal',
    status: 'Em análise',
    completion: 80,
    createdBy: 'João Silva',
    createdAt: '13/04/2025',
    updatedAt: '15/04/2025',
    material: 'Balastro',
    normReference: 'EN 13450',
    testDate: '14/04/2025'
  },
  {
    id: 3,
    name: 'Ensaio CBR - Subleito',
    type: 'CBR',
    project: 'Ponte Vasco da Gama - Manutenção',
    status: 'Não Conforme',
    result: '4%',
    completion: 100,
    createdBy: 'Ana Pereira',
    createdAt: '10/04/2025',
    updatedAt: '12/04/2025',
    material: 'Solo',
    normReference: 'ASTM D1883',
    testDate: '11/04/2025',
    approvedBy: 'Ricardo Almeida',
    approvedAt: '12/04/2025'
  },
  {
    id: 4,
    name: 'Ensaio de Tração - Aço Estrutural',
    type: 'Tração',
    project: 'Ampliação Terminal Portuário',
    status: 'Pendente de aprovação',
    result: '550 MPa',
    completion: 100,
    createdBy: 'Pedro Martins',
    createdAt: '09/04/2025',
    updatedAt: '14/04/2025',
    material: 'Aço',
    normReference: 'ISO 6892-1',
    testDate: '13/04/2025'
  },
  {
    id: 5,
    name: 'Ensaio de Abatimento - Concreto',
    type: 'Abatimento',
    project: 'Obra Ferroviária Setúbal',
    status: 'Conforme',
    result: '10 cm',
    completion: 100,
    createdBy: 'Sofia Costa',
    createdAt: '14/04/2025',
    updatedAt: '15/04/2025',
    material: 'Concreto',
    normReference: 'NBR NM 67',
    testDate: '14/04/2025',
    approvedBy: 'Carlos Santos',
    approvedAt: '15/04/2025'
  }
];

// Tipos para filtros
type FilterType = {
  type: string[];
  status: string[];
  project: string[];
  material: string[];
};

const EnsaiosPage = () => {
  const navigate = useNavigate();
  const [ensaios, setEnsaios] = useState<Ensaio[]>(ensaiosData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    type: [],
    status: [],
    project: [],
    material: []
  });

  // Obter opções únicas para filtros
  const typeOptions = [...new Set(ensaiosData.map(ensaio => ensaio.type))];
  const statusOptions = [...new Set(ensaiosData.map(ensaio => ensaio.status))];
  const projectOptions = [...new Set(ensaiosData.map(ensaio => ensaio.project))];
  const materialOptions = [...new Set(ensaiosData.map(ensaio => ensaio.material).filter(Boolean) as string[])];

  // Aplicar filtros e pesquisa
  useEffect(() => {
    let filteredEnsaios = ensaiosData;

    // Aplicar pesquisa
    if (searchTerm) {
      filteredEnsaios = filteredEnsaios.filter(ensaio =>
        ensaio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ensaio.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ensaio.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.type.length > 0) {
      filteredEnsaios = filteredEnsaios.filter(ensaio => filters.type.includes(ensaio.type));
    }
    if (filters.status.length > 0) {
      filteredEnsaios = filteredEnsaios.filter(ensaio => filters.status.includes(ensaio.status));
    }
    if (filters.project.length > 0) {
      filteredEnsaios = filteredEnsaios.filter(ensaio => filters.project.includes(ensaio.project));
    }
    if (filters.material.length > 0) {
      filteredEnsaios = filteredEnsaios.filter(ensaio => 
        ensaio.material && filters.material.includes(ensaio.material)
      );
    }

    setEnsaios(filteredEnsaios);
  }, [searchTerm, filters]);

  // Toggle filtro
  const toggleFilter = (filterType: keyof FilterType, value: string) => {
    setFilters(prev => {
      const filterValues = [...prev[filterType]];
      const index = filterValues.indexOf(value);
      
      if (index === -1) {
        filterValues.push(value);
      } else {
        filterValues.splice(index, 1);
      }
      
      return {
        ...prev,
        [filterType]: filterValues
      };
    });
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      type: [],
      status: [],
      project: [],
      material: []
    });
    setSearchTerm('');
  };

  // Status class
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

  return (
    <div className="ensaios-container">
      <div className="ensaios-header">
        <h1>Ensaios</h1>
        <button 
          className="new-ensaio-btn"
          onClick={() => navigate('/ensaios/novo')}
        >
          Novo Ensaio
        </button>
      </div>

      <div className="ensaios-tools">
        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar ensaios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Esconder Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <h3>Tipo de Ensaio</h3>
              {typeOptions.map(type => (
                <div key={type} className="filter-option">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    checked={filters.type.includes(type)}
                    onChange={() => toggleFilter('type', type)}
                  />
                  <label htmlFor={`type-${type}`}>{type}</label>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h3>Estado</h3>
              {statusOptions.map(status => (
                <div key={status} className="filter-option">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onChange={() => toggleFilter('status', status)}
                  />
                  <label htmlFor={`status-${status}`}>{status}</label>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h3>Projeto</h3>
              {projectOptions.map(project => (
                <div key={project} className="filter-option">
                  <input
                    type="checkbox"
                    id={`project-${project}`}
                    checked={filters.project.includes(project)}
                    onChange={() => toggleFilter('project', project)}
                  />
                  <label htmlFor={`project-${project}`}>{project}</label>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h3>Material</h3>
              {materialOptions.map(material => (
                <div key={material} className="filter-option">
                  <input
                    type="checkbox"
                    id={`material-${material}`}
                    checked={filters.material.includes(material)}
                    onChange={() => toggleFilter('material', material)}
                  />
                  <label htmlFor={`material-${material}`}>{material}</label>
                </div>
              ))}
            </div>

            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      <div className="ensaios-list">
        <table className="ensaios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Projeto</th>
              <th>Material</th>
              <th>Data do Ensaio</th>
              <th>Estado</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ensaios.map(ensaio => (
              <tr key={ensaio.id}>
                <td>{ensaio.id}</td>
                <td>{ensaio.name}</td>
                <td>{ensaio.type}</td>
                <td>{ensaio.project}</td>
                <td>{ensaio.material || '-'}</td>
                <td>{ensaio.testDate || '-'}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(ensaio.status)}`}>
                    {ensaio.status}
                  </span>
                </td>
                <td>{ensaio.updatedAt}</td>
                <td className="actions-cell">
                  <Link to={`/ensaios/${ensaio.id}`} className="view-btn">Ver</Link>
                  <Link to={`/ensaios/${ensaio.id}/editar`} className="edit-btn">Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnsaiosPage;