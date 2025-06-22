import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SafeIconProps {
  icon: React.ComponentType<any> | undefined | null;
  className?: string;
  fallback?: React.ComponentType<any>;
}

export const SafeIcon: React.FC<SafeIconProps> = ({ 
  icon: Icon, 
  className = "", 
  fallback: FallbackIcon = AlertCircle 
}) => {
  // Check if Icon is a valid React component
  if (!Icon || typeof Icon !== 'function') {
    console.warn('SafeIcon: Invalid icon component provided, using fallback');
    return <FallbackIcon className={className} />;
  }

  try {
    return <Icon className={className} />;
  } catch (error) {
    console.error('SafeIcon: Error rendering icon:', error);
    return <FallbackIcon className={className} />;
  }
}; 