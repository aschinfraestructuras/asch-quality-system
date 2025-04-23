import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

type FileUploaderProps = {
  bucket: string;
  path: string;
  onSuccess?: (filePath: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  className?: string;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  bucket,
  path,
  onSuccess,
  acceptedTypes = "*",
  maxSizeMB = 10,
  className = '',
}) => {
  const { uploadFile, showNotification } = useApp();
  const { t } = useTranslation();
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Verificar tamanho do arquivo
    if (file.size > maxSizeMB * 1024 * 1024) {
      showNotification(
        t('common.fileTooLarge', { size: maxSizeMB }), 
        'error'
      );
      return;
    }
    
    setFileName(file.name);
  };
  
  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.length) {
      showNotification(t('common.selectFile'), 'info');
      return;
    }
    
    const file = fileInputRef.current.files[0];
    const result = await uploadFile(bucket, file, path);
    
    if (result.success && onSuccess) {
      onSuccess(result.path);
    }
    
    // Limpar input depois de upload
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`file-uploader ${className}`}>
      <div className="file-input-container">
        <input
          type="file"
          ref={fileInputRef}
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="file-input"
        />
        <div className="file-name">
          {fileName || t('common.selectFile')}
        </div>
      </div>
      <button 
        className="upload-button"
        onClick={handleUpload}
        disabled={!fileName}
      >
        {t('common.upload')}
      </button>
    </div>
  );
};