import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import analyticsRoutes from './routes/analytics.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001; // Mudar para 5001 ou outra porta disponível

// ✅ CORS BEM CONFIGURADO
app.use(cors({
  origin: 'http://localhost:3002',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ TESTE RÁPIDO
app.get('/', (_req, res) => {
  console.log('🌐 Rota / chamada');
  res.send('🎯 API do Sistema de Qualidade está online!');
});

// ✅ LOG DE DEBUG NAS ROTAS
app.use('/api/analytics', (req, res, next) => {
  console.log(`📈 [${new Date().toISOString()}] Chamada à rota /api/analytics`);
  next();
}, analyticsRoutes);

app.use('/api/users', usersRoutes);

// ✅ BOOT DO SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});
