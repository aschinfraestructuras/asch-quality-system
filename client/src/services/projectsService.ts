// src/services/projectsService.ts
import { supabase } from './supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import appConfig from '../config/appConfig';

export interface Project {
  id?: string;
  nome: string;
  descricao?: string;
  localizacao?: string;
  estado: 'em curso' | 'concluido' | 'suspenso';
  data_inicio: string;
  data_fim?: string | null;
  id_utilizador_responsavel: string;
  progresso?: number;
  created_at?: string;
  updated_at?: string;
  utilizadores?: {
    nome: string;
  };
}

// Dados simulados
const mockProjects: Project[] = [
  {
    id: '1',
    nome: 'Obra Ferroviária Setúbal',
    descricao: 'Manutenção e renovação de linhas férreas',
    localizacao: 'Setúbal',
    estado: 'em curso',
    data_inicio: '2023-01-15',
    data_fim: '2025-07-30',
    id_utilizador_responsavel: '1',
    progresso: 75,
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2024-04-15T00:00:00Z',
    utilizadores: {
      nome: 'António Silva'
    }
  },
  {
    id: '2',
    nome: 'Construção de Viaduto Lisboa',
    descricao: 'Construção de novo viaduto para descongestionar tráfego',
    localizacao: 'Lisboa',
    estado: 'em curso',
    data_inicio: '2023-05-20',
    data_fim: '2024-12-15',
    id_utilizador_responsavel: '2',
    progresso: 45,
    created_at: '2023-05-01T00:00:00Z',
    updated_at: '2024-04-10T00:00:00Z',
    utilizadores: {
      nome: 'Maria Santos'
    }
  },
  {
    id: '3',
    nome: 'Reabilitação Ponte do Porto',
    descricao: 'Manutenção e reforço estrutural da ponte existente',
    localizacao: 'Porto',
    estado: 'concluido',
    data_inicio: '2022-10-05',
    data_fim: '2023-08-20',
    id_utilizador_responsavel: '3',
    progresso: 100,
    created_at: '2022-09-25T00:00:00Z',
    updated_at: '2023-08-20T00:00:00Z',
    utilizadores: {
      nome: 'Carlos Pereira'
    }
  },
  {
    id: '4',
    nome: 'Túnel Rodoviário Sintra',
    descricao: 'Escavação e construção de túnel de 2km',
    localizacao: 'Sintra',
    estado: 'suspenso',
    data_inicio: '2023-02-10',
    data_fim: null,
    id_utilizador_responsavel: '1',
    progresso: 15,
    created_at: '2023-01-20T00:00:00Z',
    updated_at: '2023-05-15T00:00:00Z',
    utilizadores: {
      nome: 'António Silva'
    }
  }
];

// Simula um pequeno atraso para parecer uma API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funções usando Supabase (dados reais)
const supabaseGetProjects = async (filters = {}) => {
  try {
    let query = supabase.from('projetos').select('*, utilizadores(nome)');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar projetos do Supabase:', error);
    return { data: null, error: error as PostgrestError };
  }
};

const supabaseGetProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .select('*, utilizadores(nome)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Erro ao buscar projeto com ID ${id} do Supabase:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

const supabaseCreateProject = async (project: Project) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .insert([project])
      .select();
    
    if (error) throw error;
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Erro ao criar projeto no Supabase:', error);
    return { data: null, error: error as PostgrestError };
  }
};

const supabaseUpdateProject = async (id: string, updates: Partial<Project>) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error(`Erro ao atualizar projeto no Supabase:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

const supabaseDeleteProject = async (id: string) => {
  try {
    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error(`Erro ao excluir projeto do Supabase:`, error);
    return { success: false, error: error as PostgrestError };
  }
};

const supabaseGetUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('utilizadores')
      .select('id, nome');
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar utilizadores do Supabase:', error);
    return { data: null, error: error as PostgrestError };
  }
};

// Funções usando dados simulados
const mockGetProjects = async (filters = {}) => {
  await delay(500);
  
  try {
    if (appConfig.enableDebugLogs) {
      console.log('Usando dados simulados para projetos');
    }
    
    // Filtra os projetos de acordo com os filtros
    let filteredProjects = [...mockProjects];
    
    if (filters && Object.keys(filters).length > 0) {
      filteredProjects = filteredProjects.filter(project => {
        return Object.entries(filters).every(([key, value]) => {
          return !value || project[key as keyof Project] === value;
        });
      });
    }
    
    return { data: filteredProjects, error: null };
  } catch (error) {
    console.error('Erro ao buscar projetos simulados:', error);
    return { data: null, error: error as PostgrestError };
  }
};

const mockGetProjectById = async (id: string) => {
  await delay(300);
  
  try {
    if (appConfig.enableDebugLogs) {
      console.log(`Buscando projeto simulado com ID: ${id}`);
    }
    
    const project = mockProjects.find(p => p.id === id);
    
    if (!project) {
      throw new Error('Projeto não encontrado');
    }
    
    return { data: project, error: null };
  } catch (error) {
    console.error(`Erro ao buscar projeto simulado:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

const mockCreateProject = async (project: Project) => {
  await delay(700);
  
  try {
    if (appConfig.enableDebugLogs) {
      console.log('Criando projeto simulado:', project);
    }
    
    const newProject = {
      ...project,
      id: String(mockProjects.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockProjects.push(newProject);
    
    return { data: newProject, error: null };
  } catch (error) {
    console.error('Erro ao criar projeto simulado:', error);
    return { data: null, error: error as PostgrestError };
  }
};

const mockUpdateProject = async (id: string, updates: Partial<Project>) => {
  await delay(500);
  
  try {
    if (appConfig.enableDebugLogs) {
      console.log(`Atualizando projeto simulado com ID ${id}:`, updates);
    }
    
    const index = mockProjects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Projeto não encontrado');
    }
    
    const updatedProject = {
      ...mockProjects[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    mockProjects[index] = updatedProject;
    
    return { data: updatedProject, error: null };
  } catch (error) {
    console.error(`Erro ao atualizar projeto simulado:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

const mockDeleteProject = async (id: string) => {
  await delay(400);
  
  try {
    if (appConfig.enableDebugLogs) {
      console.log(`Excluindo projeto simulado com ID ${id}`);
    }
    
    const index = mockProjects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Projeto não encontrado');
    }
    
    mockProjects.splice(index, 1);
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Erro ao excluir projeto simulado:`, error);
    return { success: false, error: error as PostgrestError };
  }
};

const mockGetUsers = async () => {
  await delay(300);
  
  const mockUsers = [
    { id: '1', nome: 'António Silva' },
    { id: '2', nome: 'Maria Santos' },
    { id: '3', nome: 'Carlos Pereira' },
    { id: '4', nome: 'Ana Costa' }
  ];
  
  return { data: mockUsers, error: null };
};

// Exporta as funções corretas baseadas na configuração
export const getProjects = appConfig.apiMode === 'mock' ? mockGetProjects : supabaseGetProjects;
export const getProjectById = appConfig.apiMode === 'mock' ? mockGetProjectById : supabaseGetProjectById;
export const createProject = appConfig.apiMode === 'mock' ? mockCreateProject : supabaseCreateProject;
export const updateProject = appConfig.apiMode === 'mock' ? mockUpdateProject : supabaseUpdateProject;
export const deleteProject = appConfig.apiMode === 'mock' ? mockDeleteProject : supabaseDeleteProject;
export const getUsers = appConfig.apiMode === 'mock' ? mockGetUsers : supabaseGetUsers;

// Exportando para debug
export const currentMode = appConfig.apiMode;