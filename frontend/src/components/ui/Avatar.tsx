import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  className?: string;
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'bottom-right';
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  variant = 'circle',
  className = '',
  fallback,
  status,
  statusPosition = 'bottom-right',
  onClick,
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  // Variant classes
  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
    square: 'rounded-none',
  };

  // Status classes
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // Status position classes
  const statusPositionClasses = {
    'top-right': '-top-1 -right-1',
    'bottom-right': '-bottom-1 -right-1',
  };

  // Get initials from alt text for fallback
  const getInitials = () => {
    if (!alt) return '';
    return alt
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Combine classes
  const avatarClasses = [
    'inline-flex items-center justify-center bg-gray-200 text-gray-600 relative',
    sizeClasses[size],
    variantClasses[variant],
    onClick ? 'cursor-pointer hover:opacity-80' : '',
    className,
  ].join(' ');

  // Status indicator size based on avatar size
  const statusSize = {
    xs: 'h-2 w-2',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
    xl: 'h-4 w-4',
  };

  return (
    <div className={avatarClasses} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${variantClasses[variant]}`}
          onError={(e) => {
            // Hide the image on error
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        fallback || (
          <span className="font-medium">{getInitials()}</span>
        )
      )}
      
      {status && (
        <span
          className={`absolute ${statusPositionClasses[statusPosition]} ${statusSize[size]} ${statusClasses[status]} rounded-full ring-2 ring-white`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Avatar;