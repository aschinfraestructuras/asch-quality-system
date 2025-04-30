import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaChartLine, FaClipboardCheck, FaFileAlt, FaSearch, FaArrowRight, FaShieldAlt, FaUsers, FaCogs, FaRocket, FaChartBar, FaCloud } from 'react-icons/fa';
import '../styles/LandingPage.css';
import logo from '../assets/logo-asch.png';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 80px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.div`
  text-align: center;
  margin: 1.5rem 0;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.6;
  opacity: 0.9;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  margin-bottom: 1.5rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #4facfe;
  filter: drop-shadow(0 0 10px rgba(79, 172, 254, 0.3));
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.5;
`;

const CTASection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Button = styled(motion.button)`
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-top: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaChartLine />,
      title: 'Gestão de Qualidade',
      description: 'Controle total sobre os processos de qualidade da sua empresa'
    },
    {
      icon: <FaClipboardCheck />,
      title: 'Análise de Dados',
      description: 'Relatórios detalhados e análises em tempo real'
    },
    {
      icon: <FaFileAlt />,
      title: 'Auditorias',
      description: 'Sistema completo para gestão de auditorias internas e externas'
    },
    {
      icon: <FaSearch />,
      title: 'Documentação',
      description: 'Centralize toda a documentação do seu SGQ'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Segurança',
      description: 'Proteção avançada para seus dados e processos'
    },
    {
      icon: <FaUsers />,
      title: 'Colaboração',
      description: 'Trabalhe em equipe de forma eficiente e integrada'
    },
    {
      icon: <FaRocket />,
      title: 'Alta Performance',
      description: 'Sistema otimizado para máxima eficiência e velocidade'
    },
    {
      icon: <FaChartBar />,
      title: 'Indicadores',
      description: 'Acompanhe KPIs e métricas importantes em tempo real'
    }
  ];

  return (
    <Container>
      <Header>
        <LogoContainer
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo src={logo} alt="ASCH Logo" />
        </LogoContainer>
        <NavButtons>
          <NavButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Login
          </NavButton>
          <NavButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: '#4facfe' }}
            onClick={() => navigate('/login')}
          >
            Começar Agora
          </NavButton>
        </NavButtons>
      </Header>

      <Content>
        <HeroSection>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Sistema de Gestão da Qualidade
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transforme a gestão da qualidade da sua empresa com nossa solução completa e integrada
          </Subtitle>
        </HeroSection>
        
        <FeaturesGrid>
          {features.slice(0, 8).map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <CTASection>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Acessar o Sistema
            <FaArrowRight />
          </Button>
        </CTASection>
      </Content>

      <Footer>
        <FooterContent>
          <div>© {new Date().getFullYear()} ASCH Infraestruturas. Todos os direitos reservados.</div>
          <FooterLinks>
            <FooterLink href="#">Sobre</FooterLink>
            <FooterLink href="#">Contato</FooterLink>
            <FooterLink href="#">Termos</FooterLink>
            <FooterLink href="#">Privacidade</FooterLink>
          </FooterLinks>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default LandingPage; 