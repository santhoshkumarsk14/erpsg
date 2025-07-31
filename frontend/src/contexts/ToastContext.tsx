import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ToastContainer, ToastProps } from '../components/ui/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastContextProps {
  addToast: (props: AddToastProps) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

interface AddToastProps {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  showIcon?: boolean;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [position, setPosition] = useState<ToastPosition>('top-right');

  const addToast = useCallback(
    ({ title, message, type = 'info', duration = 5000, position: toastPosition, showIcon = true }: AddToastProps) => {
      const id = uuidv4();
      const newToast: ToastProps = {
        id,
        title,
        message,
        type,
        duration,
        onClose: (id) => removeToast(id),
        position: toastPosition || position,
        showIcon,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);
      return id;
    },
    [position]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        removeAllToasts,
        position,
        setPosition,
      }}
    >
      {children}
      <ToastContainer position={position}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Utility functions for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (message: string, options?: Omit<AddToastProps, 'message' | 'type'>) => {
      return addToast({ message, type: 'success', ...options });
    },
    error: (message: string, options?: Omit<AddToastProps, 'message' | 'type'>) => {
      return addToast({ message, type: 'error', ...options });
    },
    warning: (message: string, options?: Omit<AddToastProps, 'message' | 'type'>) => {
      return addToast({ message, type: 'warning', ...options });
    },
    info: (message: string, options?: Omit<AddToastProps, 'message' | 'type'>) => {
      return addToast({ message, type: 'info', ...options });
    },
  };
};