import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/checklists">Checklists</Link>
      <Link to="/ensaios">Ensaios</Link>
      {/* Adicione outros links conforme necessário */}
    </nav>
  );
};

export default Navbar;