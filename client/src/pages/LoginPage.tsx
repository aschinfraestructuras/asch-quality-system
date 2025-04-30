import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUser, FaLock, FaArrowRight, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import logo from '../assets/logo-asch.png';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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

const LogoContainer = styled(motion.div)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 2;
`;

const Logo = styled.img`
  height: 50px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    border-radius: 20px 20px 0 0;
  }
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.3);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: white;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    console.log('Login attempt:', { email, password });
    navigate('/dashboard');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container>
      <LogoContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo src={logo} alt="ASCH Logo" />
      </LogoContainer>

      <BackButton
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft />
        Voltar
      </BackButton>

      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Bem-vindo</Title>
        <Subtitle>Faça login para acessar o sistema</Subtitle>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Icon>
              <FaUser />
            </Icon>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
            />
          </InputGroup>
          
          <InputGroup>
            <Icon>
              <FaLock />
            </Icon>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
            />
            <TogglePassword
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePassword>
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Entrar
            <FaArrowRight />
          </Button>
        </Form>
      </LoginCard>

      <Footer>
        © {new Date().getFullYear()} ASCH Infraestruturas. Todos os direitos reservados.
      </Footer>
    </Container>
  );
};

export default LoginPage; 