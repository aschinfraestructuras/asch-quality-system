
import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase com variáveis de ambiente
// Garante que criaste o ficheiro `.env` na pasta `client` com as variáveis corretas

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// Criar e exportar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
