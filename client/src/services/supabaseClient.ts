import { createClient } from '@supabase/supabase-js';

// ⚙️ Variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚨 Verificação de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão definidas.'
  );
}

// ✅ Criar o cliente Supabase sem opções personalizadas (compatível com a SDK atual)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🩺 Função para testar conectividade
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    if (error) throw error;
    return { online: true, error: null };
  } catch (error) {
    console.error('❌ Falha ao conectar ao Supabase:', error);
    return { online: false, error };
  }
};

// 💾 Serviço de suporte offline (via localStorage)
export const offlineService = {
  isOnline: true,

  setOnlineStatus(status: boolean) {
    this.isOnline = status;
    window.dispatchEvent(new CustomEvent('supabase:connectivity', { 
      detail: { online: status } 
    }));
  },

  storeOfflineData(key: string, data: any) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Erro ao armazenar dados offline:', error);
      return false;
    }
  },

  getOfflineData(key: string) {
    try {
      const data = localStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados offline:', error);
      return null;
    }
  },

  hasPendingData() {
    return Object.keys(localStorage).some(key => key.startsWith('offline_'));
  }
};

// 🔄 Inicialização automática da verificação de conectividade
checkSupabaseConnection().then(result => {
  offlineService.setOnlineStatus(result.online);
});

window.addEventListener('online', () => {
  checkSupabaseConnection().then(result => {
    offlineService.setOnlineStatus(result.online);
  });
});

window.addEventListener('offline', () => {
  offlineService.setOnlineStatus(false);
});

// 🔌 Cliente Supabase com fallback offline
export const enhancedSupabase = {
  async fetch(table: string, query: any = {}) {
    try {
      const { data, error } = await supabase.from(table).select(query.select || '*');
      if (error) throw error;
      return { data, error: null, source: 'online' };
    } catch (error) {
      console.warn(`⚠️ Falha na leitura online da tabela ${table}:`, error);
      const offlineData = offlineService.getOfflineData(table);
      return { 
        data: offlineData?.data || [], 
        error: null, 
        source: 'offline',
        timestamp: offlineData?.timestamp 
      };
    }
  },

  async insert(table: string, data: any) {
    if (!offlineService.isOnline) {
      const success = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data);
      return { 
        success, 
        error: success ? null : new Error('Erro ao armazenar dados offline'),
        offline: true 
      };
    }

    try {
      const { data: result, error } = await supabase.from(table).insert(data);
      return { success: !error, error, data: result, offline: false };
    } catch (error) {
      console.error(`Erro ao inserir dados em ${table}:`, error);
      const success = offlineService.storeOfflineData(`${table}_insert_${Date.now()}`, data);
      return { success, error, offline: true };
    }
  }
};

export default supabase;
