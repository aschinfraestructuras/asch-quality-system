// components/dashboard/common/FilterBar.tsx
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardFilter, UserRole } from '../../../interfaces/dashboardTypes';

interface FilterBarProps {
  filters: DashboardFilter;
  onFilterChange: (filters: Partial<DashboardFilter>) => void;
  userRole: UserRole;
  availableProjects?: { id: string; name: string }[];
  availableStatuses?: string[];
  availableCategories?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  userRole,
  availableProjects = [],
  availableStatuses = ['active', 'completed', 'pending', 'suspended'],
  availableCategories = []
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Atualizar termo de busca quando mudar nos filtros
  useEffect(() => {
    setSearchTerm(filters.searchTerm);
  }, [filters.searchTerm]);

  // Manipulador para mudança no termo de busca
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Manipulador para submissão da busca
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFilterChange({ searchTerm });
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
    onFilterChange({
      dateRange: {
        startDate: null,
        endDate: null
      },
      projects: [],
      status: [],
      categories: [],
      searchTerm: '',
      sortBy: 'dateDesc'
    });
  };

  // Remover um filtro específico
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case 'dateRange':
        onFilterChange({
          dateRange: {
            startDate: null,
            endDate: null
          }
        });
        break;
      case 'project':
        if (value) {
          onFilterChange({
            projects: filters.projects.filter(p => p.id !== value)
          });
        }
        break;
      case 'status':
        if (value) {
          onFilterChange({
            status: filters.status.filter(s => s !== value)
          });
        }
        break;
      case 'category':
        if (value) {
          onFilterChange({
            categories: filters.categories.filter(c => c !== value)
          });
        }
        break;
      case 'searchTerm':
        onFilterChange({ searchTerm: '' });
        setSearchTerm('');
        break;
    }
  };

  // Tradução de status para português
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      'active': 'Ativo',
      'completed': 'Concluído',
      'pending': 'Pendente',
      'suspended': 'Suspenso',
      'open': 'Aberto',
      'closed': 'Fechado',
      'in_progress': 'Em Progresso',
      'resolved': 'Resolvido',
      'failed': 'Reprovado',
      'passed': 'Aprovado'
    };

    return translations[status] || status;
  };

  // Renderizar filtros ativos
  const renderActiveFilters = () => {
    const activeFilters = [];

    // Filtro de intervalo de datas
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      const startDateStr = filters.dateRange.startDate 
        ? new Date(filters.dateRange.startDate).toLocaleDateString('pt-PT')
        : '';
      
      const endDateStr = filters.dateRange.endDate
        ? new Date(filters.dateRange.endDate).toLocaleDateString('pt-PT')
        : '';
      
      const dateText = startDateStr && endDateStr
        ? `${startDateStr} até ${endDateStr}`
        : startDateStr
          ? `A partir de ${startDateStr}`
          : `Até ${endDateStr}`;
      
      activeFilters.push(
        <div key="dateRange" className="dashboard-pro-active-filter">
          <Calendar size={14} />
          <span>{dateText}</span>
          <button 
            className="dashboard-pro-filter-remove" 
            onClick={() => removeFilter('dateRange')}
            aria-label="Remover filtro de data"
          >
            <X size={12} />
          </button>
        </div>
      );
    }

    // Filtros de projetos
    filters.projects.forEach(project => {
      activeFilters.push(
        <div key={`project-${project.id}`} className="dashboard-pro-active-filter">
          <span>Projeto: {project.name}</span>
          <button 
            className="dashboard-pro-filter-remove" 
            onClick={() => removeFilter('project', project.id)}
            aria-label="Remover filtro de projeto"
          >
            <X size={12} />
          </button>
        </div>
      );
    });

    // Filtros de status
    filters.status.forEach(status => {
      activeFilters.push(
        <div key={`status-${status}`} className="dashboard-pro-active-filter">
          <span>Estado: {translateStatus(status)}</span>
          <button 
            className="dashboard-pro-filter-remove" 
            onClick={() => removeFilter('status', status)}
            aria-label="Remover filtro de estado"
          >
            <X size={12} />
          </button>
        </div>
      );
    });

    // Filtros de categorias
    filters.categories.forEach(category => {
      activeFilters.push(
        <div key={`category-${category}`} className="dashboard-pro-active-filter">
          <span>Categoria: {category}</span>
          <button 
            className="dashboard-pro-filter-remove" 
            onClick={() => removeFilter('category', category)}
            aria-label="Remover filtro de categoria"
          >
            <X size={12} />
          </button>
        </div>
      );
    });

    // Filtro de termo de busca
    if (filters.searchTerm) {
      activeFilters.push(
        <div key="searchTerm" className="dashboard-pro-active-filter">
          <Search size={14} />
          <span>{filters.searchTerm}</span>
          <button 
            className="dashboard-pro-filter-remove" 
            onClick={() => removeFilter('searchTerm')}
            aria-label="Remover filtro de busca"
          >
            <X size={12} />
          </button>
        </div>
      );
    }

    return activeFilters.length > 0 ? (
      <div className="dashboard-pro-active-filters">
        <div className="dashboard-pro-active-filters-list">
          {activeFilters}
        </div>
        <button 
          className="dashboard-pro-clear-filters-btn" 
          onClick={clearAllFilters}
          aria-label="Limpar todos os filtros"
        >
          Limpar todos
        </button>
      </div>
    ) : null;
  };

  return (
    <div className="dashboard-pro-filter-bar">
      <div className="dashboard-pro-filter-main">
        <form className="dashboard-pro-search-form" onSubmit={handleSearchSubmit}>
          <div className="dashboard-pro-search-input-container">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="dashboard-pro-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              type="submit" 
              className="dashboard-pro-search-button"
              aria-label="Pesquisar"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        <button 
          className="dashboard-pro-filter-toggle" 
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Ocultar filtros' : 'Exibir filtros'}
          aria-expanded={expanded}
        >
          <Filter size={18} />
          <span>Filtros</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="dashboard-pro-filter-expanded">
          <div className="dashboard-pro-filter-section">
            <h4>Período</h4>
            <div className="dashboard-pro-date-filters">
              <div className="dashboard-pro-date-input-group">
                <label htmlFor="filter-start-date">De:</label>
                <input
                  id="filter-start-date"
                  type="date"
                  value={filters.dateRange.startDate || ''}
                  onChange={(e) => onFilterChange({
                    dateRange: {
                      ...filters.dateRange,
                      startDate: e.target.value || null
                    }
                  })}
                />
              </div>
              <div className="dashboard-pro-date-input-group">
                <label htmlFor="filter-end-date">Até:</label>
                <input
                  id="filter-end-date"
                  type="date"
                  value={filters.dateRange.endDate || ''}
                  onChange={(e) => onFilterChange({
                    dateRange: {
                      ...filters.dateRange,
                      endDate: e.target.value || null
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-pro-filter-section">
            <div className="dashboard-pro-filter-header" onClick={() => setProjectsExpanded(!projectsExpanded)}>
              <h4>Projetos</h4>
              {projectsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {projectsExpanded && (
              <div className="dashboard-pro-filter-options">
                {availableProjects.length > 0 ? (
                  availableProjects.map(project => (
                    <div key={project.id} className="dashboard-pro-filter-option">
                      <input
                        type="checkbox"
                        id={`project-${project.id}`}
                        checked={filters.projects.some(p => p.id === project.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange({
                              projects: [...filters.projects, project]
                            });
                          } else {
                            onFilterChange({
                              projects: filters.projects.filter(p => p.id !== project.id)
                            });
                          }
                        }}
                      />
                      <label htmlFor={`project-${project.id}`}>{project.name}</label>
                    </div>
                  ))
                ) : (
                  <p className="dashboard-pro-filter-no-data">Sem projetos disponíveis</p>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-pro-filter-section">
            <div className="dashboard-pro-filter-header" onClick={() => setStatusExpanded(!statusExpanded)}>
              <h4>Estado</h4>
              {statusExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {statusExpanded && (
              <div className="dashboard-pro-filter-options">
                {availableStatuses.map(status => (
                  <div key={status} className="dashboard-pro-filter-option">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onFilterChange({
                            status: [...filters.status, status]
                          });
                        } else {
                          onFilterChange({
                            status: filters.status.filter(s => s !== status)
                          });
                        }
                      }}
                    />
                    <label htmlFor={`status-${status}`}>{translateStatus(status)}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-pro-filter-section">
            <div className="dashboard-pro-filter-header" onClick={() => setCategoriesExpanded(!categoriesExpanded)}>
              <h4>Categorias</h4>
              {categoriesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            {categoriesExpanded && (
              <div className="dashboard-pro-filter-options">
                {availableCategories.length > 0 ? (
                  availableCategories.map(category => (
                    <div key={category} className="dashboard-pro-filter-option">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onFilterChange({
                              categories: [...filters.categories, category]
                            });
                          } else {
                            onFilterChange({
                              categories: filters.categories.filter(c => c !== category)
                            });
                          }
                        }}
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </div>
                  ))
                ) : (
                  <p className="dashboard-pro-filter-no-data">Sem categorias disponíveis</p>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-pro-filter-section">
            <h4>Ordenar por</h4>
            <select
              className="dashboard-pro-sort-select"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            >
              <option value="dateDesc">Data (mais recente primeiro)</option>
              <option value="dateAsc">Data (mais antiga primeiro)</option>
              <option value="nameAsc">Nome (A-Z)</option>
              <option value="nameDesc">Nome (Z-A)</option>
              <option value="statusAsc">Estado (A-Z)</option>
              <option value="statusDesc">Estado (Z-A)</option>
            </select>
          </div>
        </div>
      )}

      {renderActiveFilters()}
    </div>
  );
};

export default FilterBar;