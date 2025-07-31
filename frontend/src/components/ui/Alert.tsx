import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

interface AlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  className = '',
  showIcon = true,
  dismissible = true,
}) => {
  // Define type-specific properties
  const typeConfig = {
    success: {
      icon: <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-800',
      titleColor: 'text-green-800',
    },
    error: {
      icon: <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      titleColor: 'text-red-800',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-700',
      titleColor: 'text-yellow-800',
    },
    info: {
      icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      titleColor: 'text-blue-800',
    },
  };

  const { icon, bgColor, borderColor, textColor, titleColor } = typeConfig[type];

  return (
    <div className={`rounded-md p-4 ${bgColor} border-l-4 ${borderColor} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className={`text-sm font-medium ${titleColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${textColor} ${title ? 'mt-2' : ''}`}>
            {message}
          </div>
        </div>
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${bgColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;