import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  value: number;
  subtitle: string;
  percentage?: number;
  color: string;
  icon: React.ReactNode;
}

const CardContainer = styled(motion.div)<{ $color: string }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => `${props.$color}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 1.5rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0.5rem 0;
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Percentage = styled.span<{ $isPositive: boolean }>`
  color: ${props => props.$isPositive ? '#10B981' : '#EF4444'};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: ${props => props.$isPositive ? '6px solid #10B981' : 'none'};
    border-top: ${props => !props.$isPositive ? '6px solid #EF4444' : 'none'};
  }
`;

const DashboardCard: React.FC<CardProps> = ({
  title,
  value,
  subtitle,
  percentage,
  color,
  icon
}) => {
  const isPositive = percentage ? percentage > 0 : false;

  return (
    <CardContainer
      $color={color}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <Title>{title}</Title>
        <IconContainer $color={color}>
          {icon}
        </IconContainer>
      </CardHeader>

      <Value>{value}</Value>
      
      <Subtitle>
        {subtitle}
        {percentage && (
          <Percentage $isPositive={isPositive}>
            {Math.abs(percentage)}%
          </Percentage>
        )}
      </Subtitle>
    </CardContainer>
  );
};

export default DashboardCard; 