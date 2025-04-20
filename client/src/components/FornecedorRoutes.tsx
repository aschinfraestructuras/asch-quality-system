import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListaFornecedores from '@/pages/ListaFornecedores';
import DetalheFornecedor from '@/pages/DetalheFornecedor';

const FornecedorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ListaFornecedores />} />
      <Route path="/:id" element={<DetalheFornecedor />} />
    </Routes>
  );
};

export default FornecedorRoutes;

