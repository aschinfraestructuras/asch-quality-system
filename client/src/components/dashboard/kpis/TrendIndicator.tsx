// components/dashboard/kpis/TrendIndicator.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  currentValue: number;
  previousValue: number;
  inverse?: boolean; // Para métricas onde menor é melhor
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  currentValue,
  previousValue,
  inverse = false,
  showPercentage = true,
  size = 'medium'
}) => {
  // Calcular tendência
  const getTrend = () => {
    if (currentValue === previousValue) return 'neutral';
    
    if (currentValue > previousValue) {
      return inverse ? 'negative' : 'positive';
    } else {
      return inverse ? 'positive' : 'negative';
    }
  };

  // Calcular percentagem de mudança
  const getChangePercentage = () => {
    if (previousValue === 0) return '∞';
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };

  // Determinar tamanho do ícone
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const trend = getTrend();
  const iconSize = getIconSize();
  
  return (
    <div className={`dashboard-pro-trend dashboard-pro-trend-${trend} dashboard-pro-trend-${size}`}>
      {trend === 'positive' && <TrendingUp size={iconSize} />}
      {trend === 'negative' && <TrendingDown size={iconSize} />}
      {trend === 'neutral' && <Minus size={iconSize} />}
      
      {showPercentage && (
        <span className="dashboard-pro-trend-percentage">
          {getChangePercentage()}%
        </span>
      )}
    </div>
  );
};

export default TrendIndicator;