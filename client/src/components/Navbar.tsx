import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBell, FaUser, FaCog } from 'react-icons/fa';
import logo from '../assets/logo-asch.png';

const NavbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 40px;
  filter: brightness(1.2);
`;

const AppTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${props => props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  position: relative;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: white;
      border-radius: 2px;
    }
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;

  .badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4facfe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface NavbarProps {
  currentUser: {
    name: string;
    role: string;
    notifications: number;
  };
}

const Navbar: React.FC<NavbarProps> = ({ currentUser = { name: 'Usuário', role: 'Usuário', notifications: 0 } }) => {
  return (
    <NavbarContainer>
      <LogoSection>
        <Logo src={logo} alt="ASCH Logo" />
        <AppTitle>Sistema de Gestão da Qualidade</AppTitle>
      </LogoSection>

      <NavLinks>
        <NavLink to="/dashboard" $isActive>Dashboard</NavLink>
        <NavLink to="/projetos">Projetos</NavLink>
        <NavLink to="/checklists">Checklists</NavLink>
        <NavLink to="/ensaios">Ensaios</NavLink>
        <NavLink to="/nao-conformidades">Não Conformidades</NavLink>
        <NavLink to="/documentos">Documentos</NavLink>
        <NavLink to="/materiais">Materiais</NavLink>
        <NavLink to="/fornecedores">Fornecedores</NavLink>
        <NavLink to="/relatorios">Relatórios</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </NavLinks>

      <UserSection>
        <NotificationBadge>
          <IconButton>
            <FaBell size={18} />
          </IconButton>
          {currentUser.notifications > 0 && (
            <span className="badge">{currentUser.notifications}</span>
          )}
        </NotificationBadge>

        <IconButton>
          <FaCog size={18} />
        </IconButton>

        <UserProfile>
          <UserAvatar>
            {currentUser.name.charAt(0)}
          </UserAvatar>
          <UserInfo>
            <UserName>{currentUser.name}</UserName>
            <UserRole>{currentUser.role}</UserRole>
          </UserInfo>
        </UserProfile>
      </UserSection>
    </NavbarContainer>
  );
};

export default Navbar;