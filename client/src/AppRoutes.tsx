import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import Ensaios from './pages/Ensaios';

// Componente central para gerenciar todas as rotas da aplicação
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas principais */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checklists/*" element={<Checklists />} />
      
      {/* Rotas para o módulo de Ensaios */}
      <Route path="/ensaios/*" element={<Ensaios />} />
      
      {/* Outras rotas */}
      <Route path="/nao-conformidades/*" element={<NaoConformidades />} />
      <Route path="/relatorios/*" element={<Relatorios />} />
      
      {/* Rota de fallback para páginas não encontradas */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;