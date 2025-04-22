// components/dashboard/common/NotificationCenter.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertTriangle, Info, FileText, Package } from 'lucide-react';

// Interface para as notificações
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: Date;
  read: boolean;
  link?: string;
  relatedEntity?: {
    type: 'document' | 'checklist' | 'nonconformity' | 'material' | 'test';
    id: string;
  };
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onClearAll = () => {}
}) => {
  // Estado para o painel de notificações
  const [isOpen, setIsOpen] = useState(false);
  // Referência para o painel (para detectar cliques fora)
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  // Fechar painel quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationPanelRef.current && 
        !notificationPanelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Contagem de notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Formatar data
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return 'Agora mesmo';
    } else if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-PT');
    }
  };

  // Ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={18} className="dashboard-pro-notification-icon info" />;
      case 'warning':
        return <AlertTriangle size={18} className="dashboard-pro-notification-icon warning" />;
      case 'error':
        return <AlertTriangle size={18} className="dashboard-pro-notification-icon error" />;
      case 'success':
        return <Check size={18} className="dashboard-pro-notification-icon success" />;
      default:
        return <Info size={18} className="dashboard-pro-notification-icon info" />;
    }
  };

  // Ícone baseado no tipo de entidade relacionada
  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'document':
        return <FileText size={16} className="dashboard-pro-entity-icon" />;
      case 'material':
        return <Package size={16} className="dashboard-pro-entity-icon" />;
      case 'nonconformity':
        return <AlertTriangle size={16} className="dashboard-pro-entity-icon" />;
      case 'checklist':
        return <Check size={16} className="dashboard-pro-entity-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-pro-notification-center">
      <button 
        className="dashboard-pro-notification-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="dashboard-pro-notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dashboard-pro-notification-panel" ref={notificationPanelRef}>
          <div className="dashboard-pro-notification-header">
            <h3>Notificações</h3>
            <div className="dashboard-pro-notification-actions">
              <button 
                className="dashboard-pro-mark-all-read" 
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
                aria-label="Marcar todas como lidas"
              >
                Marcar todas como lidas
              </button>
              <button 
                className="dashboard-pro-clear-all" 
                onClick={onClearAll}
                disabled={notifications.length === 0}
                aria-label="Limpar todas"
              >
                Limpar todas
              </button>
            </div>
          </div>

          <div className="dashboard-pro-notification-list">
            {notifications.length === 0 ? (
              <div className="dashboard-pro-no-notifications">
                <p>Sem notificações</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`dashboard-pro-notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="dashboard-pro-notification-content">
                    {getNotificationIcon(notification.type)}
                    <div className="dashboard-pro-notification-text">
                      <div className="dashboard-pro-notification-title">
                        {notification.title}
                        {notification.relatedEntity && (
                          <span className="dashboard-pro-related-entity">
                            {getEntityIcon(notification.relatedEntity.type)}
                          </span>
                        )}
                      </div>
                      <p className="dashboard-pro-notification-message">{notification.message}</p>
                      <div className="dashboard-pro-notification-meta">
                        <span className="dashboard-pro-notification-date">
                          {formatDate(notification.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <button 
                      className="dashboard-pro-mark-read" 
                      onClick={() => onMarkAsRead(notification.id)}
                      aria-label="Marcar como lida"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;