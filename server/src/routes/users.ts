import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.status(200).json({
      message: 'Rota de utilizadores funcionando',
      users: [
        {
          id: '1',
          username: 'admin',
          email: 'admin@asch.com',
          role: 'administrador',
          active: true,
          lastLogin: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno do servidor', 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    });
  }
});

export default router;