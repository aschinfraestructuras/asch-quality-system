
import { createClient } from '@supabase/supabase-js'

// ⚙️ Variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🚨 Verificação de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas.')
}

// ✅ Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 🔎 Verificação de ligação
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('projetos').select('*').limit(1)
    if (error) throw error
    return { online: true, error: null }
  } catch (error) {
    console.warn('🔌 Supabase offline:', error)
    return { online: false, error }
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
  }
}

// 🚦 Monitorização automática
checkSupabaseConnection().then(r => offlineService.setOnlineStatus(r.online))
window.addEventListener('online', () => checkSupabaseConnection().then(r => offlineService.setOnlineStatus(r.online)))
window.addEventListener('offline', () => offlineService.setOnlineStatus(false))

// 🔌 Cliente com fallback offline (apenas leitura/insert)
export const enhancedSupabase = {
  async fetch(table: string, query: any = {}) {
    try {
      const { data, error } = await supabase.from(table).select(query.select || '*')
      if (error) throw error
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
      const ok = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data)
      return {
        success: ok,
        error: ok ? null : new Error('Erro ao guardar offline'),
        offline: true
      }
    }

    try {
      const { data: result, error } = await supabase.from(table).insert(data)
      if (error) throw error
      return { success: true, error: null, data: result, offline: false }
    } catch (error) {
      console.error(`Erro ao inserir em '${table}':`, error)
      const ok = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data)
      return { success: ok, error, offline: true }
    }
  }
}

export default supabase
