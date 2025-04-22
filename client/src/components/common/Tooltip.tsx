import React, { ReactNode } from 'react';

// Interface para as props do Tooltip
interface TooltipProps {
  conteudo: string;
  children: ReactNode;
}

// Componente de Tooltip para informações adicionais
const Tooltip: React.FC<TooltipProps> = ({ conteudo, children }) => (
  <div className="tooltip-container">
    {children}
    <span className="tooltip-texto">{conteudo}</span>
  </div>
);

export default Tooltip;