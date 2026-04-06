import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, severity = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, severity, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showWarning = (message, duration) => addToast(message, 'warning', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  const showInfo = (message, duration) => addToast(message, 'info', duration);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showWarning,
        showError,
        showInfo
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          severity={toast.severity}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast Component
const Toast = ({ message, severity = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getSeverityConfig = () => {
    const configs = {
      success: {
        color: 'var(--green)',
        bg: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.3)',
        icon: CheckCircle
      },
      warning: {
        color: 'var(--amber)',
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
        icon: AlertTriangle
      },
      error: {
        color: 'var(--red)',
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
        icon: XCircle
      },
      info: {
        color: 'var(--cyan)',
        bg: 'rgba(6, 182, 212, 0.1)',
        border: 'rgba(6, 182, 212, 0.3)',
        icon: Info
      }
    };
    return configs[severity] || configs.info;
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(400px);
              opacity: 0;
            }
          }

          .toast-enter {
            animation: slideInRight 0.3s ease-out forwards;
          }

          .toast-exit {
            animation: slideOutRight 0.3s ease-in forwards;
          }
        `}
      </style>
      <div
        className={isVisible ? 'toast-enter' : 'toast-exit'}
        style={{
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderLeft: `3px solid ${config.color}`,
          borderRadius: '8px',
          padding: '1rem',
          minWidth: '320px',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'all'
        }}
      >
        {/* Icon */}
        <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
          <Icon size={20} color={config.color} />
        </div>

        {/* Message */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '0.875rem',
              fontFamily: 'Sora, sans-serif',
              color: 'var(--text-primary)',
              lineHeight: '1.5',
              margin: 0
            }}
          >
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
};

export default Toast;
