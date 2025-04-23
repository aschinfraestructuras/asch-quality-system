import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

// Tipos
type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationState = {
  message: string;
  type: NotificationType;
  visible: boolean;
};

type AppContextType = {
  // Funções de arquivos
  downloadFile: (bucket: string, path: string, filename: string) => Promise<boolean>;
  uploadFile: (bucket: string, file: File, path: string) => Promise<{success: boolean, path: string}>;
  
  // Estado de carregamento
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Notificações
  showNotification: (message: string, type: NotificationType) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ 
    message: '', 
    type: 'info', 
    visible: false 
  });

  // Download de arquivos
  const downloadFile = async (bucket: string, path: string, filename: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).download(path);
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      showNotification('Arquivo descarregado com sucesso', 'success');
      return true;
    } catch (error) {
      console.error('Erro ao descarregar arquivo:', error);
      showNotification('Erro ao descarregar arquivo', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload de arquivos
  const uploadFile = async (bucket: string, file: File, path: string): Promise<{success: boolean, path: string}> => {
    setIsLoading(true);
    try {
      const filePath = `${path}/${file.name}`;
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
      
      if (error) throw error;
      
      showNotification('Arquivo enviado com sucesso', 'success');
      return { success: true, path: data.path };
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      showNotification('Erro ao enviar arquivo', 'error');
      return { success: false, path: '' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sistema de notificações
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const value = {
    downloadFile,
    uploadFile,
    isLoading,
    setIsLoading,
    showNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {notification.visible && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
      {isLoading && <div className="loading-overlay">Carregando...</div>}
    </AppContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};