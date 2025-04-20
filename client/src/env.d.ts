/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_URL?: string;
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly VITE_ENABLE_OFFLINE_MODE?: 'true' | 'false';
  readonly VITE_ENABLE_LOGGING?: 'true' | 'false';
  readonly VITE_DEMO_MODE?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Adicionando tipos para dados offline e helpers
interface OfflineStoredData<T> {
  data: T;
  timestamp: string;
  pendingSync?: boolean;
}

// Tipos para objeto window estendido
interface Window {
  fs?: {
    readFile: (path: string, options?: { encoding?: string }) => Promise<string | ArrayBuffer>;
  };
  SUPABASE_CONFIG?: {
    url: string;
    key: string;
  };
}

// Tipos para o serviço offline
interface OfflineService {
  isOnline: boolean;
  setOnlineStatus(status: boolean): void;
  storeOfflineData<T>(key: string, data: T): boolean;
  getOfflineData<T>(key: string): OfflineStoredData<T> | null;
  hasPendingData(): boolean;
  syncPendingData?(): Promise<void>;
}

// Extensões para o objeto global
declare global {
  interface Window {
    fs?: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string | ArrayBuffer>;
    };
    SUPABASE_CONFIG?: {
      url: string;
      key: string;
    };
    offlineService?: OfflineService;
  }
}

// Tipos personalizados para o projeto
interface Usuario {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  avatar_url?: string;
  permissoes: string[];
  ultimo_acesso?: string;
}

interface Obra {
  id: number;
  nome: string;
  cliente: string;
  endereco?: string;
  data_inicio: string;
  data_fim_estimada: string;
  responsavel: string;
  status: 'Planeada' | 'Em andamento' | 'Concluída' | 'Suspensa';
  progresso: number;
  descricao?: string;
  valor_contrato?: number;
  moeda?: string;
  ultima_atualizacao: string;
  coordenadas?: { lat: number; lng: number };
}

interface Checklist {
  id: number;
  titulo: string;
  obra_id: number;
  responsavel: string;
  data_criacao: string;
  data_ultima_atualizacao?: string;
  status: 'Pendente' | 'Em andamento' | 'Completo';
  progresso: number;
  itens: ChecklistItem[];
}

interface ChecklistItem {
  id: number;
  checklist_id: number;
  descricao: string;
  status: 'Pendente' | 'Conforme' | 'Não Conforme' | 'N/A';
  observacoes?: string;
  evidencias?: string[];
  responsavel?: string;
  data_verificacao?: string;
}

interface Ensaio {
  id: number;
  referencia: string;
  tipo: string;
  obra_id: number;
  elemento_testado: string;
  responsavel: string;
  data_realizacao: string;
  resultado: 'Conforme' | 'Não Conforme' | 'Pendente';
  valor_medido?: string | number;
  valor_esperado?: string | number;
  localizacao?: string;
  observacoes?: string;
  relatorio_url?: string;
  evidencias?: string[];
}

interface NaoConformidade {
  id: number;
  referencia: string;
  obra_id: number;
  descricao: string;
  categoria: string;
  data_detecao: string;
  responsavel_detecao: string;
  gravidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Aberta' | 'Em análise' | 'Em correção' | 'Corrigida' | 'Fechada';
  acao_corretiva?: string;
  responsavel_correcao?: string;
  data_correcao?: string;
  evidencias?: string[];
}

interface Documento {
  id: number;
  titulo: string;
  tipo: string;
  obra_id: number;
  versao: string;
  responsavel: string;
  data_criacao: string;
  data_atualizacao?: string;
  status: 'Rascunho' | 'Em revisão' | 'Aprovado' | 'Rejeitado';
  arquivo_url: string;
  tamanho_arquivo?: number;
  observacoes?: string;
  tags?: string[];
}

interface Material {
  id: number;
  nome: string;
  codigo: string;
  tipo: string;
  fornecedor: string;
  obra_id: number;
  data_recebimento: string;
  lote: string;
  quantidade: number;
  unidade: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  responsavel_recepcao: string;
  certificado_url?: string;
  observacoes?: string;
  localizacao_armazem?: string;
}

export {};