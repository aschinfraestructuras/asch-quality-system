import React from 'react';

// 🧾 Tipos de props esperadas
interface ErrorStateProps {
  message: string;            // Mensagem de erro a exibir
  onRetry?: () => void;       // Função opcional para tentar novamente
}

// ⚠️ Componente de estado de erro genérico
const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <h2>⚠️ Erro</h2>
      <p>{message}</p>

      {/* Botão para tentar novamente, se função onRetry estiver definida */}
      {onRetry && (
        <button onClick={onRetry} className="botao-primario">
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorState;


