import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/NaoConformidades.css';

const NaoConformidades: React.FC = () => {
  return (
    <div className="nao-conformidades-container">
      <h1>Gestão de Não Conformidades</h1>
      <div className="nao-conformidades-content">
        <Outlet />
      </div>
    </div>
  );
};

export default NaoConformidades;