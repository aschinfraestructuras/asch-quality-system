// src/config/appConfig.ts

const appConfig = {
  // Modo de API - "mock" ou "supabase"
  apiMode: import.meta.env.VITE_API_MODE || "mock",
  
  // Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Log de debug
  enableDebugLogs: import.meta.env.VITE_DEBUG_LOGS === "true"
};

export default appConfig;