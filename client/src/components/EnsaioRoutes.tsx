import { Routes, Route } from 'react-router-dom';
import EnsaiosList from '../pages/EnsaiosList';
import NewEnsaio from '../pages/NewEnsaio';
import ViewEnsaio from '../pages/ViewEnsaio';
import EnsaiosDashboard from './EnsaiosDashboard';
import EnsaiosReports from './EnsaiosReports';
import EnsaiosAnalysis from './EnsaiosAnalysis';
import EnsaiosWorkflow from './EnsaiosWorkflow';
import LabIntegration from './LabIntegration';

/**
 * Componente de Rotas para o Módulo de Ensaios
 * Este componente fornece todas as rotas para o módulo de ensaios
 * e é usado pelo componente principal Ensaios.tsx
 */
const EnsaioRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EnsaiosList />} />
      <Route path="/novo" element={<NewEnsaio />} />
      <Route path="/:id" element={<ViewEnsaio />} />
      <Route path="/:id/editar" element={<NewEnsaio />} />
      <Route path="/dashboard" element={<EnsaiosDashboard />} />
      <Route path="/reports" element={<EnsaiosReports />} />
      <Route path="/analysis" element={<EnsaiosAnalysis />} />
      <Route path="/workflow" element={<EnsaiosWorkflow />} />
      <Route path="/lab-integration" element={<LabIntegration />} />
    </Routes>
  );
};

export default EnsaioRoutes;