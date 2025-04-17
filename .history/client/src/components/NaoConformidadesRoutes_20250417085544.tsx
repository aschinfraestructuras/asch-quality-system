// src/components/NaoConformidadesRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Usando um caminho relativo diferente, baseado na estrutura de pastas
import NaoConformidades from '../pages/NaoConformidades';
import NaoConformidadesList from '../pages/NaoConformidadesList';
import NewNaoConformidade from '../pages/NewNaoConformidade';
import ViewNaoConformidade from '../pages/ViewNaoConformidade';

const NaoConformidadesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NaoConformidades />}>
        <Route index element={<NaoConformidadesList />} />
        <Route path="nova" element={<NewNaoConformidade />} />
        <Route path=":id" element={<ViewNaoConformidade />} />
      </Route>
    </Routes>
  );
};

export default NaoConformidadesRoutes;