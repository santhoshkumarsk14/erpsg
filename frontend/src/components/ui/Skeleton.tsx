import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  count = 1,
}) => {
  // Base classes
  const baseClasses = 'bg-gray-200 inline-block';
  
  // Variant classes
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };
  
  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };
  
  // Default dimensions based on variant
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'text':
        return { width: width || '100%', height: height || '1rem' };
      case 'circular':
        return { width: width || '2.5rem', height: height || '2.5rem' };
      case 'rectangular':
        return { width: width || '100%', height: height || '4rem' };
      default:
        return { width: width || '100%', height: height || '1rem' };
    }
  };
  
  const { width: defaultWidth, height: defaultHeight } = getDefaultDimensions();
  
  // Combine classes
  const skeletonClasses = [
    baseClasses,
    variantClasses[variant],
    animationClasses[animation],
    className,
  ].join(' ');
  
  // Create multiple skeletons if count > 1
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    skeletons.push(
      <span
        key={i}
        className={skeletonClasses}
        style={{
          width: defaultWidth,
          height: defaultHeight,
          display: variant === 'text' ? 'block' : 'inline-block',
          marginBottom: i < count - 1 ? '0.5rem' : 0,
        }}
        aria-hidden="true"
      />
    );
  }
  
  return <>{skeletons}</>;
};

export default Skeleton;