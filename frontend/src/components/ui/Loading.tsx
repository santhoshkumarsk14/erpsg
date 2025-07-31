import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = 'primary',
  variant = 'spinner',
  fullScreen = false,
  text,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  // Text size classes based on spinner size
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Spinner component
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="loading-spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Dots component
  const Dots = () => (
    <div className={`flex space-x-2 ${colorClasses[color]}`} data-testid="loading-dots">
      <div
        className={`${sizeClasses[size].split(' ')[0].replace(/h-\d+/, 'h-2')} ${sizeClasses[size].split(' ')[1].replace(/w-\d+/, 'w-2')} rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      ></div>
      <div
        className={`${sizeClasses[size].split(' ')[0].replace(/h-\d+/, 'h-2')} ${sizeClasses[size].split(' ')[1].replace(/w-\d+/, 'w-2')} rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      ></div>
      <div
        className={`${sizeClasses[size].split(' ')[0].replace(/h-\d+/, 'h-2')} ${sizeClasses[size].split(' ')[1].replace(/w-\d+/, 'w-2')} rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      ></div>
    </div>
  );

  // Pulse component
  const Pulse = () => (
    <div
      className={`${sizeClasses[size]} rounded-full animate-pulse ${colorClasses[color]} bg-current opacity-75`}
      data-testid="loading-pulse"
    ></div>
  );

  // Render loading indicator based on variant
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner />;
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  // Full screen loading overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className={`flex flex-col items-center ${className}`}>
          {renderLoadingIndicator()}
          {text && (
            <p className={`mt-4 ${textSizeClasses[size]} ${colorClasses['white']}`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Regular loading indicator
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {renderLoadingIndicator()}
      {text && (
        <p className={`mt-2 ${textSizeClasses[size]} ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;