// components/dashboard/kpis/KPICard.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'number' | 'percentage' | 'currency';
  previousValue?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  inverseThreshold?: boolean; // Para métricas onde menor é melhor (ex: não conformidades)
  color?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  format = 'number',
  previousValue,
  threshold,
  inverseThreshold = false,
  color,
  icon,
  loading = false
}) => {
  // Estado para animação do contador
  const [displayValue, setDisplayValue] = useState<number>(0);
  
  // Calcular tendência
  const getTrend = () => {
    if (previousValue === undefined) return 'neutral';
    
    if (value > previousValue) {
      return inverseThreshold ? 'negative' : 'positive';
    } else if (value < previousValue) {
      return inverseThreshold ? 'positive' : 'negative';
    } else {
      return 'neutral';
    }
  };
  
  // Determinar cor do KPI baseado no threshold
  const getThresholdColor = () => {
    if (!threshold) return 'dashboard-pro-kpi-normal';
    
    if (inverseThreshold) {
      if (value >= threshold.critical) return 'dashboard-pro-kpi-critical';
      if (value >= threshold.warning) return 'dashboard-pro-kpi-warning';
      return 'dashboard-pro-kpi-success';
    } else {
      if (value <= threshold.critical) return 'dashboard-pro-kpi-critical';
      if (value <= threshold.warning) return 'dashboard-pro-kpi-warning';
      return 'dashboard-pro-kpi-success';
    }
  };
  
  // Calcular percentagem de mudança
  const getChangePercentage = () => {
    if (previousValue === undefined || previousValue === 0) return null;
    
    const change = ((value - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };
  
  // Formatar valor para exibição
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR'
        }).format(val);
      default:
        return val.toLocaleString('pt-PT');
    }
  };
  
  // Animação do contador
  useEffect(() => {
    if (loading) {
      setDisplayValue(0);
      return;
    }
    
    // Duração da animação em ms
    const animationDuration = 1000;
    // Intervalo de atualização em ms
    const updateInterval = 16;
    // Número de passos
    const steps = animationDuration / updateInterval;
    // Valor incrementado a cada passo
    const increment = (value - displayValue) / steps;
    // Valor atual
    let currentValue = displayValue;
    
    const timer = setInterval(() => {
      currentValue += increment;
      
      // Verificar se atingiu ou ultrapassou o valor final
      if ((increment >= 0 && currentValue >= value) || 
          (increment < 0 && currentValue <= value)) {
        clearInterval(timer);
        setDisplayValue(value);
      } else {
        setDisplayValue(currentValue);
      }
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [value, loading]);
  
  const trend = getTrend();
  const thresholdColor = getThresholdColor();
  const changePercentage = getChangePercentage();
  
  return (
    <div className={`dashboard-pro-kpi-card ${thresholdColor}`} style={{ borderColor: color }}>
      <div className="dashboard-pro-kpi-header">
        <h3 className="dashboard-pro-kpi-title">{title}</h3>
        {icon && <div className="dashboard-pro-kpi-icon">{icon}</div>}
      </div>
      
      <div className="dashboard-pro-kpi-value-container">
        {loading ? (
          <div className="dashboard-pro-kpi-loading">
            <div className="dashboard-pro-kpi-spinner"></div>
          </div>
        ) : (
          <div className="dashboard-pro-kpi-value">
            {formatValue(Math.round(displayValue))}
          </div>
        )}
      </div>
      
      {previousValue !== undefined && !loading && (
        <div className={`dashboard-pro-kpi-trend dashboard-pro-kpi-trend-${trend}`}>
          {trend === 'positive' && <TrendingUp size={16} />}
          {trend === 'negative' && <TrendingDown size={16} />}
          {trend === 'neutral' && <Minus size={16} />}
          
          {changePercentage && (
            <span className="dashboard-pro-kpi-change">
              {changePercentage}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;