
import React from 'react';
import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/Sidebar'; // 👈 Comentado e guardado para o futuro

const DashboardLayout: React.FC = () => {
  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* <Sidebar /> 👈 Guardado para usar depois se quiseres */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
