import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import Ensaios from './pages/Ensaios';
import ViewEnsaio from './pages/ViewEnsaio';
import NewEnsaio from './pages/NewEnsaio';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Login from './pages/Login';
import UploadDocumento from './pages/UploadDocumento'; // 👈 AQUI adicionas a nova página

import RequireAuth from './utils/RequireAuth';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <RequireAuth>
            <AnalyticsDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/checklists/*"
        element={
          <RequireAuth>
            <Checklists />
          </RequireAuth>
        }
      />
      <Route
        path="/ensaios"
        element={
          <RequireAuth>
            <Ensaios />
          </RequireAuth>
        }
      />
      <Route
        path="/ensaios/view/:id"
        element={
          <RequireAuth>
            <ViewEnsaio />
          </RequireAuth>
        }
      />
      <Route
        path="/ensaios/new"
        element={
          <RequireAuth>
            <NewEnsaio />
          </RequireAuth>
        }
      />
      <Route
        path="/nao-conformidades"
        element={
          <RequireAuth>
            <NaoConformidades />
          </RequireAuth>
        }
      />
      <Route
        path="/relatorios"
        element={
          <RequireAuth>
            <Relatorios />
          </RequireAuth>
        }
      />

      {/* ✅ NOVA ROTA PARA ENVIO DE DOCUMENTOS */}
      <Route
        path="/documentos/upload"
        element={
          <RequireAuth>
            <UploadDocumento />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<h1>Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;
