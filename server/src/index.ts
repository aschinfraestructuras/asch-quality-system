import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização da aplicação Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota básica
app.get('/', (req, res) => {
  res.send('API do Sistema de Gestão de Qualidade ASCH está funcionando!');
});

// Rotas da API
app.use('/api/users', require('./routes/users'));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});