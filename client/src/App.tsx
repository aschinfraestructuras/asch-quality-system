import { Routes, Route } from 'react-router-dom';

// Estilos
import './styles/App.css';

// Páginas (a serem criadas)
const Home = () => (
  <div className="container">
    <h1>Sistema de Gestão de Qualidade ASCH</h1>
    <p>Bem-vindo ao Sistema de Gestão de Qualidade para todas as obras da empresa ASCH</p>
  </div>
);

const NotFound = () => (
  <div className="container">
    <h1>404 - Página não encontrada</h1>
    <p>A página que procura não existe ou foi movida.</p>
  </div>
);

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">SGQ ASCH</div>
        <nav>
          <a href="/">Início</a>
        </nav>
      </header>
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} ASCH - Sistema de Gestão de Qualidade</p>
      </footer>
    </div>
  );
}

export default App;