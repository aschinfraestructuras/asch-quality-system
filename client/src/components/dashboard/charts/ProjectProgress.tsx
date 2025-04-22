
// components/dashboard/charts/ProjectProgress.tsx
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ProjectProgressProps {
  data: any[];
  height?: number;
  colors?: string[];
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({
  data,
  height = 300,
  colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0']
}) => {

  console.log("📊 Dados recebidos no gráfico de Progresso de Projetos:", data);
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(project => {
      const completion = project.completion || 0;
      return {
        name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
        fullName: project.name,
        completion,
        target: project.target || 100,
        status: project.status,
        startDate: new Date(project.start_date).toLocaleDateString('pt-PT'),
        endDate: project.end_date ? new Date(project.end_date).toLocaleDateString('pt-PT') : 'Em andamento',
        id: project.id
      };
    }).sort((a, b) => b.completion - a.completion);
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const project = payload[0].payload;
      return (
        <div className="dashboard-pro-chart-tooltip">
          <p className="dashboard-pro-tooltip-title">{project.fullName}</p>
          <p className="dashboard-pro-tooltip-item"><span className="dashboard-pro-tooltip-label">Conclusão:</span><span className="dashboard-pro-tooltip-value">{project.completion}%</span></p>
          <p className="dashboard-pro-tooltip-item"><span className="dashboard-pro-tooltip-label">Meta:</span><span className="dashboard-pro-tooltip-value">{project.target}%</span></p>
          <p className="dashboard-pro-tooltip-item"><span className="dashboard-pro-tooltip-label">Estado:</span><span className="dashboard-pro-tooltip-value">{project.status}</span></p>
          <p className="dashboard-pro-tooltip-item"><span className="dashboard-pro-tooltip-label">Início:</span><span className="dashboard-pro-tooltip-value">{project.startDate}</span></p>
          <p className="dashboard-pro-tooltip-item"><span className="dashboard-pro-tooltip-label">Fim:</span><span className="dashboard-pro-tooltip-value">{project.endDate}</span></p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (completion: number, target: number, index: number) => {
    if (completion >= target) return '#06d6a0';
    if (completion >= target * 0.7) return '#ffd166';
    return '#ef476f';
  };

  return (
    <div className="dashboard-pro-chart-container">
      <h3 className="dashboard-pro-chart-title">Progresso dos Projetos</h3>
      {chartData.length === 0 ? (
        <div className="dashboard-pro-chart-no-data">
          <p>Sem dados disponíveis para exibição</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="completion" name="Progresso Atual" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.completion, entry.target, index)} />
              ))}
            </Bar>
            <Bar dataKey="target" name="Meta" fill="#bbbbbb" opacity={0.6} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProjectProgress;
