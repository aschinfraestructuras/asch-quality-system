
// components/dashboard/charts/NonConformityAnalysis.tsx
import React, { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector
} from 'recharts';

interface NonConformityAnalysisProps {
  data: any[];
  height?: number;
  groupBy?: 'category' | 'severity' | 'status' | 'project';
  title?: string;
}

const NonConformityAnalysis: React.FC<NonConformityAnalysisProps> = ({
  data,
  height = 300,
  groupBy = 'category',
  title = 'Análise de Não Conformidades'
}) => {

  console.log("📉 Dados recebidos no gráfico de Não Conformidades:", data);

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [group, setGroup] = useState(groupBy);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ff7300', '#d0ed57', '#8dd1e1', '#a4de6c'
  ];

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedData: Record<string, number> = {};

    data.forEach(nc => {
      let key = '';
      switch (group) {
        case 'category':
          key = nc.category || 'Sem Categoria';
          break;
        case 'severity':
          key = nc.severity || 'Não Especificada';
          break;
        case 'status':
          key = nc.status || 'Desconhecido';
          break;
        case 'project':
          key = nc.project_name || 'Sem Projeto';
          break;
      }
      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    return Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data, group]);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(undefined);

  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="#333" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#333" fontSize={16} fontWeight="bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999" fontSize={12}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 1} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="dashboard-pro-chart-tooltip">
          <p className="dashboard-pro-tooltip-title">{payload[0].name}</p>
          <p className="dashboard-pro-tooltip-item">
            <span className="dashboard-pro-tooltip-label">Quantidade:</span>
            <span className="dashboard-pro-tooltip-value">{payload[0].value}</span>
          </p>
          <p className="dashboard-pro-tooltip-item">
            <span className="dashboard-pro-tooltip-label">Percentagem:</span>
            <span className="dashboard-pro-tooltip-value">{`${(payload[0].payload.percent * 100).toFixed(1)}%`}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getGroupTitle = () => {
    switch (group) {
      case 'category': return 'Não Conformidades por Categoria';
      case 'severity': return 'Não Conformidades por Severidade';
      case 'status': return 'Não Conformidades por Estado';
      case 'project': return 'Não Conformidades por Projeto';
      default: return title;
    }
  };

  return (
    <div className="dashboard-pro-chart-container" style={{ minHeight: height }}>
      <h3 className="dashboard-pro-chart-title">{getGroupTitle()}</h3>
      {chartData.length === 0 ? (
        <div className="dashboard-pro-chart-no-data">
          <p>Sem dados disponíveis para exibição</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#333', fontSize: 12 }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="dashboard-pro-chart-controls">
        <select
          className="dashboard-pro-chart-select"
          value={group}
          onChange={(e) => setGroup(e.target.value as any)}
        >
          <option value="category">Por Categoria</option>
          <option value="severity">Por Severidade</option>
          <option value="status">Por Estado</option>
          <option value="project">Por Projeto</option>
        </select>
      </div>
    </div>
  );
};

export default NonConformityAnalysis;
