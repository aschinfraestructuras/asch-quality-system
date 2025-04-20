import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente com base no modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 3002,
      open: true,
      // Configuração proxy para API em desenvolvimento, se aplicável
      proxy: env.API_URL
        ? {
            '/api': {
              target: env.API_URL,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
        : undefined
    },
    build: {
      outDir: 'dist',
      // Otimização do build
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            vendor: ['axios', 'date-fns']
          }
        }
      },
      sourcemap: mode !== 'production'
    },
    // Configuração de testes usando Vitest
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true
    },
    // Otimizações de desempenho
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'axios',
        'date-fns'
      ]
    }
  };
});