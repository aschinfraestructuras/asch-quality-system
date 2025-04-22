// hooks/useFilterState.ts
import { useState, useCallback, useMemo } from 'react';

// Mantidas todas as definições de tipos originais
export interface Project {
  id: string;
  name: string;
  status: string;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DashboardFilter {
  dateRange: DateRange;
  projects: Project[];
  status: string[];
  categories: string[];
  searchTerm: string;
  sortBy: 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc' | 'statusAsc' | 'statusDesc';
}

export interface DashboardData {
  projects: any[];
  works: any[];
  checklists: any[];
  tests: any[];
  nonConformities: any[];
  documents: any[];
  materials: any[];
  kpiData?: any;
}

export interface UseFilterStateReturn {
  filters: DashboardFilter;
  setFilters: (newFilters: Partial<DashboardFilter>) => void;
  resetFilters: () => void;
  applyFilters: (data: DashboardData | null, filters: DashboardFilter) => DashboardData | null;
  activeFilterCount: number;
}

// Filtros padrão
const defaultFilters: DashboardFilter = {
  dateRange: {
    startDate: null,
    endDate: null
  },
  projects: [],
  status: [],
  categories: [],
  searchTerm: '',
  sortBy: 'dateDesc'
};

function useFilterState(): UseFilterStateReturn {
  // Estado para os filtros
  const [filters, setFiltersState] = useState<DashboardFilter>(defaultFilters);

  // Contagem de filtros ativos
  const activeFilterCount = useMemo(() => {
    let count = 0;
    
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    if (filters.projects.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.searchTerm.trim().length > 0) count++;
    if (filters.sortBy !== defaultFilters.sortBy) count++;
    
    return count;
  }, [filters]);

  // Atualizar filtros
  const setFilters = useCallback((newFilters: Partial<DashboardFilter>) => {
    setFiltersState(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Resetar filtros para os valores padrão
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // Aplicar filtros aos dados
  const applyFilters = useCallback((data: DashboardData | null, filters: DashboardFilter): DashboardData | null => {
    if (!data) return null;

    // Clonar os dados para não modificar o original
    const filteredData: DashboardData = JSON.parse(JSON.stringify(data));

    // TODO: Implementar lógica de filtragem
    // Esta parte deve ser implementada com a lógica de filtragem real

    return filteredData;
  }, []);

  return {
    filters,
    setFilters,
    resetFilters,
    applyFilters,
    activeFilterCount
  };
}

// Exportação default adicionada
export default useFilterState;

// Manter exportação nomeada para compatibilidade
export { useFilterState };

