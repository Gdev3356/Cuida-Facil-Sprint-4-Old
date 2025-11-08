import { useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AcessibilityContext';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

interface NotificationToastProps {
  type?: NotificationType;
  title: string;
  message: string;
  linkTo?: string;
  linkText?: string;
  autoClose?: boolean;
  duration?: number;
  onClose: () => void;
  icon?: React.ReactNode;
}

export default function NotificationToast({
  type = 'info',
  title,
  message,
  linkTo,
  linkText = 'Ver detalhes',
  autoClose = true,
  duration = 8000,
  onClose,
  icon
}: NotificationToastProps) {
  const { leitorAtivo, lerTexto, pararLeitura } = useAccessibility();
  
  // Lê a notificação automaticamente quando aparece (se leitor ativo)
  useEffect(() => {
    if (leitorAtivo) {
      // Monta o texto completo para leitura
      const tipoTexto = type === 'error' ? 'Urgente!' : 
                        type === 'warning' ? 'Atenção!' : 
                        type === 'success' ? 'Sucesso!' : 'Notificação!';
      
      const textoCompleto = `${tipoTexto} ${title}. ${message}${linkTo ? `. ${linkText}` : ''}`;
      
      // Pequeno delay para não conflitar com outras leituras
      const timeoutLeitura = setTimeout(() => {
        lerTexto(textoCompleto);
      }, 300);
      
      return () => {
        clearTimeout(timeoutLeitura);
      };
    }
  }, [leitorAtivo, type, title, message, linkTo, linkText, lerTexto]);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getDefaultIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="notification-icon" />;
      case 'success':
        return <Calendar className="notification-icon" />;
      case 'error':
        return <AlertCircle className="notification-icon" />;
      default:
        return <Calendar className="notification-icon" />;
    }
  };

  return (
    <div className={`notification-toast notification-${type}`}>
      <div className="notification-content">
        <div className="notification-icon-wrapper">
          {icon || getDefaultIcon()}
        </div>
        
        <div className="notification-text">
          <h3 className="notification-title">{title}</h3>
          <p className="notification-message">{message}</p>
          
          {linkTo && (
            <Link 
              to={linkTo} 
              className="notification-link"
              onClick={onClose}
            >
              {linkText} →
            </Link>
          )}
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="notification-close"
        aria-label="Fechar notificação"
      >
        <X size={18} />
      </button>
      
      {autoClose && (
        <div 
          className="notification-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
}