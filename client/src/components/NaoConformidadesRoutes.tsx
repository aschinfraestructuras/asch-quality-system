import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import NaoConformidades from '../pages/NaoConformidades';
import NaoConformidadesList from '../pages/NaoConformidadesList';
import NewNaoConformidade from '../pages/NewNaoConformidade';
import ViewNaoConformidade from '../pages/ViewNaoConformidade';

const NaoConformidadesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<NaoConformidadesList />} />
        <Route path="nova" element={<NewNaoConformidade />} />
        <Route path=":id" element={<ViewNaoConformidade />} />
      </Route>
    </Routes>
  );
};

export default NaoConformidadesRoutes;