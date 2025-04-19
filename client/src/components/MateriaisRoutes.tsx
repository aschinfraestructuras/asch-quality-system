import { Routes, Route } from 'react-router-dom';
import MateriaisList from '../pages/MateriaisList';
import NewMaterial from '../pages/NewMaterial';
import ViewMaterial from '../pages/ViewMaterial';
import MateriaisDashboard from '../components/MateriaisDashboard';
import MateriaisReports from '../components/MateriaisReports';
import MaterialInventario from '../components/MaterialInventario';
import MaterialCertificacoes from '../components/MaterialCertificacoes';

/**
 * Componente de Rotas para o Módulo de Materiais
 * Este componente fornece todas as rotas para o módulo de materiais,
 * incluindo listagem, criação, edição, visualização e funcionalidades avançadas
 */
const MateriaisRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MateriaisList />} />
      <Route path="/novo" element={<NewMaterial />} />
      <Route path="/:id" element={<ViewMaterial />} />
      <Route path="/:id/editar" element={<NewMaterial />} />
      <Route path="/dashboard" element={<MateriaisDashboard />} />
      <Route path="/reports" element={<MateriaisReports />} />
      <Route path="/inventario" element={<MaterialInventario />} />
      <Route path="/certificacoes" element={<MaterialCertificacoes />} />
    </Routes>
  );
};

export default MateriaisRoutes;