import { supabase } from './supabaseClient'

export const getDashboardCounts = async () => {
  try {
    // Buscar contagem de projetos ativos
    const { count: projetosCount, error: projetosError } = await supabase
      .from('projetos')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'em curso')
    
    if (projetosError) throw projetosError
    
    // Buscar contagem de documentos
    const { count: documentosCount, error: documentosError } = await supabase
      .from('documentos')
      .select('*', { count: 'exact', head: true })
    
    if (documentosError) throw documentosError
    
    // Buscar contagem de ensaios em andamento
    const { count: ensaiosCount, error: ensaiosError } = await supabase
      .from('ensaios')
      .select('*', { count: 'exact', head: true })
      .gt('data_ensaio', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    
    if (ensaiosError) throw ensaiosError
    
    // Buscar contagem de não conformidades em aberto
    const { count: ncCount, error: ncError } = await supabase
      .from('nao_conformidades')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'aberta')
    
    if (ncError) throw ncError
    
    // Buscar contagem de checklists completados
    const { count: checklistsCount, error: checklistsError } = await supabase
      .from('checklists')
      .select('*', { count: 'exact', head: true })
    
    if (checklistsError) throw checklistsError
    
    // Buscar contagem de materiais em estoque
    // Verificamos se a tabela existe antes de tentar consultar
    let materiaisCount = 0
    try {
      const { count, error: materiaisError } = await supabase
        .from('materiais')
        .select('*', { count: 'exact', head: true })
      
      if (!materiaisError) {
        materiaisCount = count || 0
      }
    } catch (materiaisError) {
      console.warn('Tabela materiais pode não existir:', materiaisError)
      // Continuamos a execução sem interrompê-la
    }
    
    return {
      projetos: projetosCount || 0,
      documentos: documentosCount || 0,
      ensaios: ensaiosCount || 0,
      naoConformidades: ncCount || 0,
      checklists: checklistsCount || 0,
      materiais: materiaisCount
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    throw error
  }
}

export const getTarefasPendentes = async () => {
  try {
    const { data, error } = await supabase
      .from('vw_tarefas_pendentes')
      .select('*')
      .order('prioridade', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar tarefas pendentes:', error)
    throw error
  }
}