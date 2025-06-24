import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Safe icon renderer to prevent React error #31
export const SafeIcon: React.FC<{
  icon: React.ComponentType<any> | undefined | null;
  className?: string;
  fallback?: React.ComponentType<any>;
}> = ({ icon: Icon, className = "", fallback: FallbackIcon = AlertCircle }) => {
  // Check if Icon is a valid React component
  if (!Icon || typeof Icon !== 'function') {
    return <FallbackIcon className={className} />;
  }

  try {
    return <Icon className={className} />;
  } catch (error) {
    console.error('Error rendering icon:', error);
    return <FallbackIcon className={className} />;
  }
};

// Safe component renderer
export const SafeComponent: React.FC<{
  component: React.ComponentType<any> | undefined | null;
  props?: any;
  fallback?: React.ReactNode;
}> = ({ component: Component, props = {}, fallback = null }) => {
  if (!Component || typeof Component !== 'function') {
    return <>{fallback}</>;
  }

  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('Error rendering component:', error);
    return <>{fallback}</>;
  }
};

// Validate React element
export const isValidReactElement = (element: any): element is React.ReactElement => {
  return React.isValidElement(element);
};

// Safe render function
export const safeRender = (element: any, fallback: React.ReactNode = null): React.ReactNode => {
  if (isValidReactElement(element)) {
    return element;
  }
  
  if (typeof element === 'function') {
    try {
      const rendered = element();
      return isValidReactElement(rendered) ? rendered : fallback;
    } catch (error) {
      console.error('Error rendering function component:', error);
      return fallback;
    }
  }
  
  return fallback;
};

interface SafeRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

export const SafeRender: React.FC<SafeRenderProps> = ({ 
  children, 
  fallback,
  componentName = 'Component' 
}) => {
  const defaultFallback = (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
        <span className="text-sm text-yellow-800">
          {componentName} temporarily unavailable
        </span>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback || defaultFallback}
      componentName={componentName}
    >
      {children}
    </ErrorBoundary>
  );
}; 