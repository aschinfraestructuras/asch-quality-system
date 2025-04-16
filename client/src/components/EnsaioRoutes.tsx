import { Routes, Route } from 'react-router-dom';
import EnsaiosModule from '../pages/Ensaios';

/**
 * Componente de Rotas para o Módulo de Ensaios
 * Este componente centraliza todas as rotas relacionadas ao módulo de ensaios
 * e utiliza o componente principal EnsaiosModule como ponto de entrada.
 */
const EnsaioRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<EnsaiosModule />} />
    </Routes>
  );
};

export default EnsaioRoutes;