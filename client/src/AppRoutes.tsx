import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import Ensaios from './pages/Ensaios';
import ViewEnsaio from './pages/ViewEnsaio';
import NewEnsaio from './pages/NewEnsaio';
import AnalyticsDashboard from './pages/AnalyticsDashboard'; // ← NOVO

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas principais */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} /> {/* NOVA ROTA */}

      {/* Rota aninhada principal para Checklists */}
      <Route path="/checklists/*" element={<Checklists />} />

      {/* Rotas para Ensaios */}
      <Route path="/ensaios" element={<Ensaios />} />
      <Route path="/ensaios/view/:id" element={<ViewEnsaio />} />
      <Route path="/ensaios/new" element={<NewEnsaio />} />

      {/* Outras rotas */}
      <Route path="/nao-conformidades" element={<NaoConformidades />} />
      <Route path="/relatorios" element={<Relatorios />} />

      {/* Fallback */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;
