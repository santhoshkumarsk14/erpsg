import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showIcon?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  position = 'top-right',
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  // Define type-specific properties
  const typeConfig = {
    success: {
      icon: <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-800',
      titleColor: 'text-green-800',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      titleColor: 'text-red-800',
      progressColor: 'bg-red-500',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      titleColor: 'text-yellow-800',
      progressColor: 'bg-yellow-500',
    },
    info: {
      icon: <InformationCircleIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      titleColor: 'text-blue-800',
      progressColor: 'bg-blue-500',
    },
  };

  const { icon, bgColor, borderColor, textColor, titleColor, progressColor } = typeConfig[type];

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for fade out animation
  };

  // Auto close after duration
  useEffect(() => {
    if (duration === 0) return; // Don't auto-close if duration is 0

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, id]);

  // Pause progress when hovering
  const handleMouseEnter = () => {
    setProgress((prev) => prev);
  };

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${bgColor} border-l-4 ${borderColor}`}
      onMouseEnter={handleMouseEnter}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start">
          {showIcon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          <div className={`${showIcon ? 'ml-3' : ''} w-0 flex-1 pt-0.5`}>
            {title && (
              <p className={`text-sm font-medium ${titleColor}`}>
                {title}
              </p>
            )}
            <p className={`mt-1 text-sm ${textColor}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex rounded-md ${bgColor} text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200">
        <div
          className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  children,
}) => {
  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div
      className={`fixed z-50 p-4 flex flex-col space-y-4 ${positionClasses[position]}`}
      aria-live="assertive"
    >
      {children}
    </div>
  );
};