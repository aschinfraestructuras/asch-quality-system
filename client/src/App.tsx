import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import EnsaioRoutes from './components/EnsaioRoutes';
import NaoConformidades from './pages/NaoConformidades';
import Relatorios from './pages/Relatorios';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checklists/*" element={<Checklists />} />
            <Route path="/ensaios/*" element={<EnsaioRoutes />} />
            <Route path="/nao-conformidades/*" element={<NaoConformidades />} />
            <Route path="/relatorios/*" element={<Relatorios />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;