import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase com variáveis de ambiente
// Em ambiente de desenvolvimento, estas variáveis devem estar definidas no arquivo .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://htjtiglmptzvm.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sua-chave-publica-aqui';

// Criar e exportar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
