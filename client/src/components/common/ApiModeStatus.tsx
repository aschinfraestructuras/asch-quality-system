import React from 'react';
import { currentMode } from '../../services/projectsService';

const ApiModeStatus = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: currentMode === 'mock' ? '#f0ad4e' : '#5cb85c',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000,
        cursor: 'pointer'
      }}
      title={`API Mode: ${currentMode}`}
    >
      {currentMode === 'mock' ? 'Dados Simulados' : 'Dados Reais'}
    </div>
  );
};

export default ApiModeStatus;