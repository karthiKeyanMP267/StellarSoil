import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Toast = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          icon: XCircleIcon,
          bgColor: 'bg-gradient-to-r from-red-50 to-pink-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-800'
        };
      case 'warning':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800'
        };
      case 'info':
      default:
        return {
          icon: InformationCircleIcon,
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-amber-500',
          textColor: 'text-amber-800'
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.icon;

  return (
    <div className={`fixed top-20 right-4 z-50 max-w-md w-full transform transition-all duration-300 ease-in-out`}>
      <div className={`${styles.bgColor} ${styles.borderColor} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start">
          <IconComponent className={`h-5 w-5 ${styles.iconColor} mr-3 flex-shrink-0 mt-0.5`} />
          <div className={`${styles.textColor} flex-1 font-medium`}>
            {message}
          </div>
          <button
            onClick={onClose}
            className={`${styles.iconColor} hover:opacity-70 transition-opacity ml-3`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message, duration = 5000) => {
    const id = Date.now();
    const newToast = { id, type, message, duration };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => addToast('success', message, duration);
  const showError = (message, duration) => addToast('error', message, duration);
  const showWarning = (message, duration) => addToast('warning', message, duration);
  const showInfo = (message, duration) => addToast('info', message, duration);

  const ToastContainer = () => (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  };
};

export default Toast;
