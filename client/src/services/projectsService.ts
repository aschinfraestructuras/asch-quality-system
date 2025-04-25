// src/services/projectsService.ts
import appConfig from '../config/appConfig';
import { supabase } from './supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

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
    utilizadores: { nome: 'António Silva' }
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
    utilizadores: { nome: 'Maria Santos' }
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
    utilizadores: { nome: 'Carlos Pereira' }
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
    utilizadores: { nome: 'António Silva' }
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const supabaseGetProjects = async (filters = {}) => {
  try {
    let query = supabase.from('projetos').select('*, utilizadores(nome)');
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query = query.eq(key, value);
    });
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro Supabase (getProjects):', error);
    return { data: null, error };
  }
};

const mockGetProjects = async (filters = {}) => {
  await delay(300);
  try {
    let result = [...mockProjects];
    if (Object.keys(filters).length) {
      result = result.filter(p =>
        Object.entries(filters).every(([key, value]) => !value || p[key as keyof Project] === value)
      );
    }
    return { data: result, error: null };
  } catch (error) {
    console.error('Erro Mock (getProjects):', error);
    return { data: null, error };
  }
};

export const getProjects = appConfig.apiMode === 'mock' ? mockGetProjects : supabaseGetProjects;

export const getProjectById = async (id: string) => {
  const { data, error } = await getProjects({ id });
  return { data: data?.[0] ?? null, error };
};

export const createProject = async (projeto: Project) => {
  if (appConfig.apiMode === 'mock') {
    await delay(300);
    const novo = { ...projeto, id: Date.now().toString(), created_at: new Date().toISOString() };
    mockProjects.push(novo);
    return { data: novo, error: null };
  }
  try {
    const { data, error } = await supabase.from('projetos').insert([projeto]).select();
    if (error) throw error;
    return { data: data?.[0] ?? null, error: null };
  } catch (error) {
    console.error('Erro Supabase (createProject):', error);
    return { data: null, error };
  }
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  if (appConfig.apiMode === 'mock') {
    await delay(300);
    const idx = mockProjects.findIndex(p => p.id === id);
    if (idx === -1) return { data: null, error: new Error('Projeto não encontrado') };
    mockProjects[idx] = { ...mockProjects[idx], ...updates };
    return { data: mockProjects[idx], error: null };
  }
  try {
    const { data, error } = await supabase.from('projetos').update(updates).eq('id', id).select();
    if (error) throw error;
    return { data: data?.[0] ?? null, error: null };
  } catch (error) {
    console.error('Erro Supabase (updateProject):', error);
    return { data: null, error };
  }
};

export const deleteProject = async (id: string) => {
  if (appConfig.apiMode === 'mock') {
    await delay(200);
    const idx = mockProjects.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, error: new Error('Projeto não encontrado') };
    mockProjects.splice(idx, 1);
    return { success: true, error: null };
  }
  try {
    const { error } = await supabase.from('projetos').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro Supabase (deleteProject):', error);
    return { success: false, error };
  }
};

export const getUsers = async () => {
  if (appConfig.apiMode === 'mock') {
    await delay(200);
    return {
      data: [
        { id: '1', nome: 'António Silva' },
        { id: '2', nome: 'Maria Santos' },
        { id: '3', nome: 'Carlos Pereira' },
        { id: '4', nome: 'Ana Costa' }
      ],
      error: null
    };
  }
  try {
    const { data, error } = await supabase.from('utilizadores').select('id, nome');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro Supabase (getUsers):', error);
    return { data: null, error };
  }
};

export const currentMode = appConfig.apiMode;
