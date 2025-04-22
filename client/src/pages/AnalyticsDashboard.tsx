
import React from 'react';
import useAnalyticsData from '../hooks/useAnalyticsData';
import '../styles/AnalyticsDashboard.css';

import {
  Project,
  NonConformity,
  DashboardData
} from '../interfaces/dashboardTypes';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const dadosSimuladosEnsaios = [
  { nome: 'Betão', valor: 35 },
  { nome: 'Solo', valor: 22 },
  { nome: 'Aço', valor: 18 },
  { nome: 'Água', valor: 7 },
  { nome: 'Outros', valor: 8 }
];

const AnalyticsDashboard: React.FC = () => {
  const {
    data,
    loading,
    error,
    modoSimulado,
    setModoSimulado
  } = useAnalyticsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        <p>Carregando dados analíticos...</p>
      </div>
    );
  }

  if (error && !modoSimulado) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar dados</h2>
        <p className="mb-4 text-gray-600">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-center">Dashboard da Qualidade</h1>
        <button
          onClick={() => setModoSimulado(!modoSimulado)}
          className="px-4 py-2 bg-yellow-500 text-white rounded shadow"
        >
          {modoSimulado ? 'Desativar Modo Simulado' : 'Ativar Modo Simulado'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Projetos</h2>
          {data?.projects?.map((project: Project) => (
            <div key={project.id} className="mb-2">
              <p className="font-medium">{project.name}</p>
              <p className="text-sm text-gray-500">Status: {project.status}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Não Conformidades</h2>
          {data?.nonConformities?.map((nc: NonConformity) => (
            <div key={nc.id} className="mb-2">
              <p className="font-medium">{nc.title}</p>
              <p className="text-sm text-gray-500">{nc.category} | {nc.status} | {nc.severity}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Indicadores</h2>
          <div className="space-y-2">
            <div>
              <strong>Projetos Ativos:</strong> {data?.kpiData?.strategic?.activeProjects}
            </div>
            <div>
              <strong>Ensaios Pendentes:</strong> {data?.kpiData?.technical?.pendingTests}
            </div>
            <div>
              <strong>Materiais Certificados:</strong> {data?.kpiData?.materials?.materialsWithCertification}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mt-10 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Distribuição de Ensaios por Tipo</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosSimuladosEnsaios}>
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
