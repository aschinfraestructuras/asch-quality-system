import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css';

// Obter o elemento root e verificar se existe
const rootElement = document.getElementById('root');

// Verificar se o elemento existe antes de criar a raiz
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Elemento com ID "root" não encontrado no DOM!');
}