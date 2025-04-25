import { createClient } from '@supabase/supabase-js'

// ⚙️ Variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🔎 Verificação de ligação com diagnóstico detalhado
export const checkSupabaseConnection = async () => {
  console.log('⚙️ Verificando conexão Supabase URL:', supabaseUrl)
  
  try {
    console.log('📊 Tentando selecionar projetos...')
    const { data, error } = await supabase.from('projetos').select('*').limit(1)
    
    if (error) {
      console.error('❌ Erro na consulta:', error)
      throw error
    }
    
    console.log('✅ Conexão estabelecida, dados recebidos:', data)
    return { online: true, error: null }
  } catch (error) {
    console.warn('🔌 Supabase offline:', error)
    
    // Tentar diagnosticar o tipo de erro
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.error('📡 Erro de rede: verifique a conexão à internet ou o URL do Supabase')
    } else if (error instanceof Error && (error as any).code === 'PGRST301') {
      console.error('🔒 Erro de autorização: verifique a chave anónima')
    }
    
    return { online: false, error }
  }
}

// 🔬 Diagnóstico detalhado da conexão
export const diagnosticarConexao = async () => {
  console.group('🔍 Diagnóstico Supabase')
  console.log('🌐 URL:', supabaseUrl)
  console.log('🔑 Chave anónima presente:', !!supabaseAnonKey)
  
  try {
    console.log('📡 Testando fetch diretamente...')
    const response = await fetch(`${supabaseUrl}/rest/v1/projetos?count=exact`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Resposta HTTP: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ Teste fetch bem-sucedido:', data)
    
    // Teste com cliente Supabase
    console.log('🧪 Testando cliente Supabase...')
    const { data: projectData, error } = await supabase.from('projetos').select('count')
    
    if (error) {
      throw error
    }
    
    console.log('✅ Teste cliente Supabase bem-sucedido:', projectData)
    console.log('🟢 Diagnóstico concluído: Conexão OK')
    console.groupEnd()
    return { ok: true, detalhes: { fetch: true, client: true } }
  } catch (error) {
    console.error('❌ Diagnóstico falhou:', error)
    console.groupEnd()
    return { 
      ok: false, 
      error, 
      detalhes: { mensagem: error instanceof Error ? error.message : 'Erro desconhecido' } 
    }
  }
}

// 💾 Modo offline básico
export const offlineService = {
  isOnline: true,

  setOnlineStatus(status: boolean) {
    this.isOnline = status
    window.dispatchEvent(new CustomEvent('supabase:connectivity', {
      detail: { online: status }
    }))
  },

  storeOfflineData(key: string, data: any) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }))
      return true
    } catch (error) {
      console.error('Erro ao guardar dados offline:', error)
      return false
    }
  },

  getOfflineData(key: string) {
    try {
      const item = localStorage.getItem(`offline_${key}`)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Erro ao ler dados offline:', error)
      return null
    }
  },

  hasPendingData() {
    return Object.keys(localStorage).some(key => key.startsWith('offline_'))
  },
  
  clearOfflineData() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('offline_')) {
        localStorage.removeItem(key)
      }
    })
    console.log('🧹 Dados offline removidos')
  }
}

// 🧹 Limpar armazenamento e reiniciar conexão
export const resetarConexao = async () => {
  console.log('🧹 Limpando localStorage e reiniciando conexão...')
  
  // Limpar localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('offline_') || key.startsWith('supabase_')) {
      localStorage.removeItem(key)
    }
  })
  
  // Verificar conexão novamente
  const status = await checkSupabaseConnection()
  offlineService.setOnlineStatus(status.online)
  return status
}

// 🔄 Verificar configuração e estado
export const verificarEstado = async () => {
  // Verificar variáveis de ambiente
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ CRÍTICO: Variáveis de ambiente não definidas')
    console.log('💡 Verifique o ficheiro .env:')
    console.log('VITE_SUPABASE_URL =', supabaseUrl || 'não definido')
    console.log('VITE_SUPABASE_ANON_KEY =', supabaseAnonKey ? 'definido (primeiros caracteres: ' + supabaseAnonKey.substring(0, 10) + '...)' : 'não definido')
    
    // Salvar este estado para exibir avisos na UI
    localStorage.setItem('supabase_config_error', 'true')
    offlineService.setOnlineStatus(false)
    return { 
      configOK: false, 
      online: false, 
      error: 'Variáveis de ambiente não definidas' 
    }
  }
  
  // Variáveis presentes, verificar conexão
  console.log('✅ Variáveis de ambiente definidas')
  localStorage.removeItem('supabase_config_error')
  
  const status = await checkSupabaseConnection()
  offlineService.setOnlineStatus(status.online)
  
  return { 
    configOK: true, 
    online: status.online, 
    error: status.error 
  }
}

// 🔌 Cliente com fallback offline (apenas leitura/insert)
export const enhancedSupabase = {
  async fetch(table: string, query: any = {}) {
    try {
      // Verificar status de conectividade
      if (!offlineService.isOnline) {
        console.log(`📴 Modo offline ativo, usando dados locais para ${table}`)
        const offline = offlineService.getOfflineData(table)
        return {
          data: offline?.data || [],
          error: null,
          source: 'offline',
          timestamp: offline?.timestamp
        }
      }
      
      console.log(`🔄 Buscando dados de ${table}...`)
      const { data, error } = await supabase.from(table).select(query.select || '*')
      
      if (error) {
        console.error(`❌ Erro ao buscar ${table}:`, error)
        throw error
      }
      
      console.log(`✅ Dados de ${table} recebidos:`, data?.length || 0, 'registos')
      
      // Guardar cópia offline
      offlineService.storeOfflineData(table, data)
      
      return { data, error: null, source: 'online' }
    } catch (error) {
      console.warn(`⚠️ Fallback offline em '${table}':`, error)
      const offline = offlineService.getOfflineData(table)
      return {
        data: offline?.data || [],
        error: null,
        source: 'offline',
        timestamp: offline?.timestamp
      }
    }
  },

  async insert(table: string, data: any) {
    if (!offlineService.isOnline) {
      console.log(`📴 Modo offline, guardando inserção em ${table} localmente`)
      const ok = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data)
      return {
        success: ok,
        error: ok ? null : new Error('Erro ao guardar offline'),
        offline: true
      }
    }

    try {
      console.log(`🔄 Inserindo dados em ${table}...`)
      const { data: result, error } = await supabase.from(table).insert(data)
      
      if (error) {
        console.error(`❌ Erro ao inserir em ${table}:`, error)
        throw error
      }
      
      console.log(`✅ Dados inseridos em ${table} com sucesso`)
      return { success: true, error: null, data: result, offline: false }
    } catch (error) {
      console.error(`❌ Erro ao inserir em '${table}':`, error)
      console.log(`📴 Armazenando operação offline...`)
      const ok = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data)
      return { success: ok, error, offline: true }
    }
  },
  
  // Novos métodos para gestão de status
  getStatus() {
    return {
      online: offlineService.isOnline,
      hasPendingData: offlineService.hasPendingData(),
      configOK: !!supabaseUrl && !!supabaseAnonKey
    }
  },
  
  async resetConnection() {
    return resetarConexao()
  },
  
  async diagnose() {
    return diagnosticarConexao()
  }
}

// 🚦 Inicialização e monitorização automática
console.log('🚀 Inicializando cliente Supabase...')
verificarEstado().then(status => {
  if (status.configOK) {
    console.log('✅ Cliente Supabase inicializado:', status.online ? 'online' : 'offline')
  } else {
    console.error('❌ Falha na inicialização do cliente Supabase')
  }
})

// Monitorar alterações de conectividade
window.addEventListener('online', () => {
  console.log('🌐 Navegador detectou conexão online, verificando Supabase...')
  checkSupabaseConnection().then(r => offlineService.setOnlineStatus(r.online))
})

window.addEventListener('offline', () => {
  console.log('📴 Navegador detectou modo offline, atualizando estado...')
  offlineService.setOnlineStatus(false)
})

export default supabase