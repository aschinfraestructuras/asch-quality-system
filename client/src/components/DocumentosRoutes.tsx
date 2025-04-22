import { Routes, Route } from 'react-router-dom';
import DocumentosList from '../pages/DocumentosList';
import NewDocumento from '../pages/NewDocumento';
import ViewDocumento from '../pages/ViewDocumento';
import NewRFI from '../pages/NewRFI';
import ViewRFI from '../pages/ViewRFI';
import ListaRFIs from '../pages/ListaRFIs'; // <--- Aqui está o novo import
/**
 * Componente de Rotas para o Módulo de Documentos
 * Este componente fornece todas as rotas para o módulo de documentos
 * incluindo as rotas para RFIs (Pedidos de Informação)
 */
const DocumentosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DocumentosList />} />
      <Route path="/novo" element={<NewDocumento />} />
      <Route path="/:id" element={<ViewDocumento />} />
      <Route path="/:id/editar" element={<NewDocumento />} />
      <Route path="/rfis" element={<ListaRFIs />} />
      <Route path="/rfi/novo" element={<NewRFI />} />
      <Route path="/rfi/:id" element={<ViewRFI />} />
      <Route path="/rfi/:id/editar" element={<NewRFI />} />
    </Routes>
  );
};

export default DocumentosRoutes
