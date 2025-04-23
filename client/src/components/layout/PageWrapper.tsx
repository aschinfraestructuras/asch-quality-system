// client/src/components/layout/PageWrapper.tsx
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';
import '../../styles/components.css'; // Se aplicável

interface PageWrapperProps {
  titleKey: string;
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ titleKey, children, className = '' }) => {
  const { t } = useTranslation();
  const { showNotification, setIsLoading } = useApp();

  return (
    <div className={`page-wrapper ${className}`}>
      <h1 className="page-title">{t(titleKey)}</h1>
      {children}
    </div>
  );
};
