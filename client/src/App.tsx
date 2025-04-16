import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import Ensaios from './pages/Ensaios';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checklists/*" element={<Checklists />} />
            <Route path="/ensaios/*" element={<Ensaios />} />
            <Route path="/nao-conformidades/*" element={<NaoConformidades />} />
            <Route path="/relatorios/*" element={<Relatorios />} />
            <Route path="*" element={<h1>Página não encontrada</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;