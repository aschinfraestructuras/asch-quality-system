import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaProjectDiagram, FaFileAlt, FaFlask, FaExclamationTriangle, 
  FaClipboardCheck, FaBoxes, FaChartLine, FaUsers, FaTools,
  FaBuilding, FaTruck, FaFileInvoice, FaChartBar, FaCalendarAlt, FaAngleRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import DashboardCard from '../components/DashboardCard';

const DashboardContainer = styled.div`
  padding: 0 2rem;
  margin-top: -4.5rem;
  background: #f9fafb;
  min-height: calc(100vh - 64px);
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const FiltersSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.25rem 0;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const ExportButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled(motion.button)`
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-2px);
  }

  svg {
    color: #3b82f6;
  }
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem 1.5rem;
  margin: 0.25rem 0 1.5rem;
  grid-template-rows: auto auto;
  row-gap: 2.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SubMenu = styled.div`
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
`;

const ModuleButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: #374151;
  transition: all 0.3s ease;
  height: 90px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    & + ${SubMenu} {
      display: flex;
    }
  }

  svg {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
    color: #3B82F6;
  }

  span {
    font-weight: 500;
    text-align: center;
    font-size: 0.8125rem;
    line-height: 1.2;
  }
`;

const SubMenuItem = styled(Link)`
  padding: 0.375rem 0.75rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.8125rem;
  transition: all 0.2s;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &:hover {
    color: #3B82F6;
    background: #f3f4f6;
  }

  svg {
    font-size: 0.875rem;
  }
`;

const ModuleContainer = styled.div`
  position: relative;
  min-height: 160px;

  &:hover ${SubMenu} {
    display: flex;
  }
`;

const ContentSection = styled.div`
  margin-top: 0.5rem;
  border-top: 2px solid #e5e7eb;
  padding-top: 1rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const WorkStatusSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const WorkStatusTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
`;

const WorkStatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const WorkStatusItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  svg {
    margin-right: 0.75rem;
    color: #3B82F6;
  }
`;

const ProgressChart = () => {
  const data = [
    { name: 'Jan', progress: 20 },
    { name: 'Fev', progress: 35 },
    { name: 'Mar', progress: 50 },
    { name: 'Abr', progress: 65 },
    { name: 'Mai', progress: 75 },
    { name: 'Jun', progress: 85 }
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const QualityIndicatorsChart = () => {
  const data = [
    { name: 'Checklists', value: 85 },
    { name: 'Ensaios', value: 92 },
    { name: 'NCs', value: 15 },
    { name: 'Documentos', value: 78 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const DashboardPro: React.FC = () => {
  const cards = [
    {
      title: 'Projetos',
      value: 7,
      subtitle: 'Ativos',
      percentage: 5,
      color: '#3B82F6',
      icon: <FaProjectDiagram />
    },
    {
      title: 'Documentos',
      value: 124,
      subtitle: 'Total',
      percentage: 12,
      color: '#10B981',
      icon: <FaFileAlt />
    },
    {
      title: 'Ensaios',
      value: 18,
      subtitle: 'Em andamento',
      percentage: 3,
      color: '#6366F1',
      icon: <FaFlask />
    },
    {
      title: 'Não Conformidades',
      value: 5,
      subtitle: 'Em aberto',
      percentage: -15,
      color: '#EF4444',
      icon: <FaExclamationTriangle />
    },
    {
      title: 'Checklists',
      value: 42,
      subtitle: 'Completados',
      percentage: 8,
      color: '#8B5CF6',
      icon: <FaClipboardCheck />
    },
    {
      title: 'Materiais',
      value: 86,
      subtitle: 'Em estoque',
      percentage: 4,
      color: '#F59E0B',
      icon: <FaBoxes />
    },
    {
      title: 'Fornecedores',
      value: 23,
      subtitle: 'Ativos',
      percentage: 2,
      color: '#EC4899',
      icon: <FaTruck />
    },
    {
      title: 'Relatórios',
      value: 15,
      subtitle: 'Este mês',
      percentage: 10,
      color: '#14B8A6',
      icon: <FaChartBar />
    }
  ];

  const quickActions = [
    { label: 'Novo Checklist', icon: <FaClipboardCheck /> },
    { label: 'Novo Ensaio', icon: <FaFlask /> },
    { label: 'Novo Documento', icon: <FaFileAlt /> },
    { label: 'Nova NC', icon: <FaExclamationTriangle /> },
    { label: 'Novo Material', icon: <FaBoxes /> }
  ];

  const modules = [
    { 
      path: '/projetos', 
      icon: <FaProjectDiagram />, 
      label: 'Projetos',
      submenu: [
        { path: '/projetos/listar', label: 'Listar Projetos' },
        { path: '/projetos/novo', label: 'Novo Projeto' },
        { path: '/projetos/timeline', label: 'Timeline' },
        { path: '/projetos/equipes', label: 'Equipes' },
        { path: '/projetos/orcamentos', label: 'Orçamentos' },
        { path: '/projetos/cronogramas', label: 'Cronogramas' },
        { path: '/projetos/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/checklists', 
      icon: <FaClipboardCheck />, 
      label: 'Checklists',
      submenu: [
        { path: '/checklists/listar', label: 'Listar Checklists' },
        { path: '/checklists/novo', label: 'Novo Checklist' },
        { path: '/checklists/modelos', label: 'Modelos' },
        { path: '/checklists/categorias', label: 'Categorias' },
        { path: '/checklists/pendentes', label: 'Pendentes' },
        { path: '/checklists/concluidos', label: 'Concluídos' },
        { path: '/checklists/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/ensaios/listar', 
      icon: <FaFlask />, 
      label: 'Ensaios',
      submenu: [
        { path: '/ensaios/listar', label: 'Listar Ensaios' },
        { path: '/ensaios/novo', label: 'Novo Ensaio' },
        { path: '/ensaios/calibracao', label: 'Calibração' },
        { path: '/ensaios/equipamentos', label: 'Equipamentos' },
        { path: '/ensaios/resultados', label: 'Resultados' },
        { path: '/ensaios/laboratorio', label: 'Laboratório' },
        { path: '/ensaios/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/nao-conformidades/listar', 
      icon: <FaExclamationTriangle />, 
      label: 'Não Conformidades',
      submenu: [
        { path: '/nao-conformidades/listar', label: 'Listar NCs' },
        { path: '/nao-conformidades/novo', label: 'Nova NC' },
        { path: '/nao-conformidades/acoes', label: 'Ações Corretivas' },
        { path: '/nao-conformidades/preventivas', label: 'Ações Preventivas' },
        { path: '/nao-conformidades/analise', label: 'Análise de Causa' },
        { path: '/nao-conformidades/verificacao', label: 'Verificação' },
        { path: '/nao-conformidades/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/documentos/listar', 
      icon: <FaFileAlt />, 
      label: 'Documentos',
      submenu: [
        { path: '/documentos/listar', label: 'Listar Documentos' },
        { path: '/documentos/novo', label: 'Novo Documento' },
        { path: '/documentos/modelos', label: 'Modelos' },
        { path: '/documentos/revisoes', label: 'Revisões' },
        { path: '/documentos/aprovacoes', label: 'Aprovações' },
        { path: '/documentos/categorias', label: 'Categorias' },
        { path: '/documentos/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/materiais/listar', 
      icon: <FaBoxes />, 
      label: 'Materiais',
      submenu: [
        { path: '/materiais/listar', label: 'Listar Materiais' },
        { path: '/materiais/novo', label: 'Novo Material' },
        { path: '/materiais/estoque', label: 'Controle de Estoque' },
        { path: '/materiais/entrada', label: 'Entrada de Materiais' },
        { path: '/materiais/saida', label: 'Saída de Materiais' },
        { path: '/materiais/inventario', label: 'Inventário' },
        { path: '/materiais/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/fornecedores/listar', 
      icon: <FaTruck />, 
      label: 'Fornecedores',
      submenu: [
        { path: '/fornecedores/listar', label: 'Listar Fornecedores' },
        { path: '/fornecedores/novo', label: 'Novo Fornecedor' },
        { path: '/fornecedores/avaliacoes', label: 'Avaliações' },
        { path: '/fornecedores/contratos', label: 'Contratos' },
        { path: '/fornecedores/qualificacoes', label: 'Qualificações' },
        { path: '/fornecedores/historico', label: 'Histórico' },
        { path: '/fornecedores/relatorios', label: 'Relatórios' }
      ]
    },
    { 
      path: '/relatorios/listar', 
      icon: <FaChartBar />, 
      label: 'Relatórios',
      submenu: [
        { path: '/relatorios/qualidade', label: 'Qualidade' },
        { path: '/relatorios/desempenho', label: 'Desempenho' },
        { path: '/relatorios/indicadores', label: 'Indicadores' },
        { path: '/relatorios/auditorias', label: 'Auditorias' },
        { path: '/relatorios/estatisticas', label: 'Estatísticas' },
        { path: '/relatorios/dashboard', label: 'Dashboard' },
        { path: '/relatorios/exportar', label: 'Exportar' }
      ]
    }
  ];

  const workStatus = [
    { icon: <FaBuilding />, text: 'Obra Ferroviária Setúbal: 75% concluída' },
    { icon: <FaUsers />, text: 'Equipe atual: 45 colaboradores' },
    { icon: <FaTools />, text: 'Próxima inspeção: 15/03/2024' },
    { icon: <FaCalendarAlt />, text: 'Prazo final: 30/06/2024' }
  ];

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Gestão de Qualidade ASCH</Subtitle>
      </Header>

      <FiltersSection>
        <FilterGroup>
          <Select defaultValue="todas">
            <option value="todas">Todas as Obras</option>
            <option value="obra1">Obra Ferroviária Setúbal</option>
            <option value="obra2">Obra Metro Lisboa</option>
          </Select>

          <Select defaultValue="30">
            <option value="7">Últimos 7 dias</option>
            <option value="15">Últimos 15 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </Select>
        </FilterGroup>

        <ExportButton>
          <FaFileAlt />
          Exportar
        </ExportButton>
      </FiltersSection>

      <ModuleGrid>
        {modules.map((module, index) => (
          <ModuleContainer key={index}>
            <ModuleButton to={module.path}>
              {module.icon}
              <span>{module.label}</span>
            </ModuleButton>
            {module.submenu.length > 0 && (
              <SubMenu>
                {module.submenu.map((item, idx) => (
                  <SubMenuItem key={idx} to={item.path}>
                    <FaAngleRight />
                    {item.label}
                  </SubMenuItem>
                ))}
              </SubMenu>
            )}
          </ModuleContainer>
        ))}
      </ModuleGrid>

      <ContentSection>
        <ChartsSection>
          <ChartCard>
            <ChartTitle>Progresso da Obra</ChartTitle>
            <ProgressChart />
          </ChartCard>
          <ChartCard>
            <ChartTitle>Indicadores de Qualidade</ChartTitle>
            <QualityIndicatorsChart />
          </ChartCard>
        </ChartsSection>

        <WorkStatusSection>
          <WorkStatusTitle>Status da Obra</WorkStatusTitle>
          <WorkStatusList>
            {workStatus.map((status, index) => (
              <WorkStatusItem key={index}>
                {status.icon}
                {status.text}
              </WorkStatusItem>
            ))}
          </WorkStatusList>
        </WorkStatusSection>

        <CardsGrid>
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              {...card}
            />
          ))}
        </CardsGrid>
      </ContentSection>
    </DashboardContainer>
  );
};

export default DashboardPro;
