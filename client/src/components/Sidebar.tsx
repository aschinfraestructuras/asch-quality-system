
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside style={{ width: '240px', background: '#20232a', color: 'white', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.2rem' }}>📊 Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><Link style={{ color: 'white' }} to="/dashboard">Dashboard</Link></li>
        <li><Link style={{ color: 'white' }} to="/dashboard/analytics">Analytics</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
