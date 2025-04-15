import React, { useState, useRef } from 'react';
import '../styles/EvidenceUploader.css';

interface EvidenceUploaderProps {
  onUpload: (fileData: any) => void;
}

const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Em um cenário real, aqui faríamos o upload para o servidor
    // Por enquanto, simularemos o processo
    const fileData = {
      name: files[0].name,
      size: files[0].size,
      type: files[0].type,
      lastModified: new Date(files[0].lastModified).toLocaleDateString()
    };
    
    onUpload(fileData);
  };

  return (
    <div 
      className={`evidence-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
      <div className="uploader-content">
        <div className="uploader-icon">📁</div>
        <div className="uploader-text">
          Arraste arquivos ou clique para adicionar evidências
        </div>
        <div className="uploader-formats">
          Formatos: JPEG, PNG, PDF, DOC, XLS
        </div>
      </div>
    </div>
  );
};

export default EvidenceUploader;