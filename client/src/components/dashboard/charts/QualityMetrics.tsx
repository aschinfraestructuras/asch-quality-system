
// components/dashboard/charts/QualityMetrics.tsx
import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface QualityMetricsProps {
  data: any;
  height?: number;
  fill?: string;
  stroke?: string;
  title?: string;
}

const QualityMetrics: React.FC<QualityMetricsProps> = ({
  data,
  height = 300,
  fill = '#4361ee',
  stroke = '#3a0ca3',
  title = 'Métricas de Qualidade'
}) => {

  console.log("📈 Dados recebidos no gráfico de Métricas de Qualidade:", data);

  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      { name: 'Documentação', value: data.documentsComplianceRate ?? 0, fullMark: 100 },
      { name: 'Ensaios', value: data.testsPassRate ?? 0, fullMark: 100 },
      { name: 'Inspeções', value: data.inspectionComplianceRate ?? 0, fullMark: 100 },
      { name: 'Materiais', value: data.materialsCertificationRate ?? 0, fullMark: 100 },
      { name: 'Conformidade', value: data.nonConformityResolutionRate ?? 0, fullMark: 100 },
      { name: 'Checklists', value: data.checklistCompletionRate ?? 0, fullMark: 100 }
    ];
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const metric = payload[0].payload;
      return (
        <div className="dashboard-pro-chart-tooltip">
          <p className="dashboard-pro-tooltip-title">{metric.name}</p>
          <p><strong>Valor:</strong> {metric.value.toFixed(1)}%</p>
          <p><strong>Meta:</strong> {metric.fullMark}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-pro-chart-container">
      <h3 className="dashboard-pro-chart-title">{title}</h3>
      {chartData.length === 0 ? (
        <div className="dashboard-pro-chart-no-data">
          <p>Sem dados disponíveis para exibição</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Métricas Atuais"
              dataKey="value"
              stroke={stroke}
              fill={fill}
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default QualityMetrics;

