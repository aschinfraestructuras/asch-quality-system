import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

type DownloadButtonProps = {
  bucket: string;
  path: string;
  filename: string;
  label?: string;
  className?: string;
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  bucket,
  path,
  filename,
  label,
  className = '',
}) => {
  const { downloadFile } = useApp();
  const { t } = useTranslation();
  
  const handleDownload = async () => {
    await downloadFile(bucket, path, filename);
  };
  
  return (
    <button 
      className={`download-button ${className}`} 
      onClick={handleDownload}
    >
      {label || t('common.download')}
    </button>
  );
};