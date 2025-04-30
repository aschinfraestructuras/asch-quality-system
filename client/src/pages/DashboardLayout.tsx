import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
// import Sidebar from '../components/Sidebar'; // 👈 Comentado e guardado para o futuro

const LayoutContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
  background: var(--gray-50);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-top: 64px;
  width: 100%;
`;

const DashboardLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <MainContent>
        {/* <Sidebar /> 👈 Guardado para usar depois se quiseres */}
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
