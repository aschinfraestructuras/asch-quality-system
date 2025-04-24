import { supabase } from './supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export interface Project {
  id?: string;
  nome: string;
  descricao?: string;
  localizacao?: string;
  estado: 'em curso' | 'concluido' | 'suspenso';
  data_inicio: string;
  data_fim?: string;
  id_utilizador_responsavel: string;
  progresso?: number;
  created_at?: string;
  updated_at?: string;
  utilizadores?: {
    nome: string;
  };
}

export const getProjects = async (filters = {}) => {
  try {
    let query = supabase.from('projetos').select('*, utilizadores(nome)');
    
    // Aplicar filtros se fornecidos
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null as PostgrestError | null };
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return { data: null, error: error as PostgrestError };
  }
};

export const getProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .select('*, utilizadores(nome)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null as PostgrestError | null };
  } catch (error) {
    console.error(`Erro ao buscar projeto com ID ${id}:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

export const createProject = async (project: Project) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .insert([project])
      .select();
    
    if (error) throw error;
    return { data, error: null as PostgrestError | null };
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return { data: null, error: error as PostgrestError };
  }
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data, error: null as PostgrestError | null };
  } catch (error) {
    console.error(`Erro ao atualizar projeto com ID ${id}:`, error);
    return { data: null, error: error as PostgrestError };
  }
};

export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase
      .from('projetos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, error: null as PostgrestError | null };
  } catch (error) {
    console.error(`Erro ao excluir projeto com ID ${id}:`, error);
    return { success: false, error: error as PostgrestError };
  }
};