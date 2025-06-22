import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ 
  children, 
  color = 'gray', 
  size = 'md',
  className = '' 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      case 'md':
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${getColorClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Chip; 