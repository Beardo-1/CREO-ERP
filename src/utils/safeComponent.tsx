import React from 'react';

// Safe component wrapper to prevent React error #31
export const SafeComponent: React.FC<{
  component: React.ComponentType<any>;
  props?: any;
  fallback?: React.ReactNode;
  name?: string;
}> = ({ component: Component, props = {}, fallback = null, name = 'Unknown' }) => {
  try {
    // Validate that Component is a valid React component
    if (!Component) {
      console.warn(`SafeComponent: Component is null/undefined for ${name}`);
      return <>{fallback}</>;
    }

    if (typeof Component !== 'function') {
      console.warn(`SafeComponent: Component is not a function for ${name}`, Component);
      return <>{fallback}</>;
    }

    // Try to render the component
    return <Component {...props} />;
  } catch (error) {
    console.error(`SafeComponent: Error rendering component ${name}:`, error);
    return <>{fallback}</>;
  }
};

// Safe render function for dynamic components
export const safeRender = (
  element: any, 
  fallback: React.ReactNode = null,
  name: string = 'Unknown'
): React.ReactNode => {
  try {
    if (React.isValidElement(element)) {
      return element;
    }
    
    if (typeof element === 'function') {
      try {
        const rendered = element();
        return React.isValidElement(rendered) ? rendered : fallback;
      } catch (error) {
        console.error(`safeRender: Error rendering function component ${name}:`, error);
        return fallback;
      }
    }
    
    console.warn(`safeRender: Invalid element type for ${name}:`, typeof element);
    return fallback;
  } catch (error) {
    console.error(`safeRender: Unexpected error for ${name}:`, error);
    return fallback;
  }
};

// Component validation utility
export const isValidComponent = (component: any): component is React.ComponentType<any> => {
  return component && typeof component === 'function';
};

// Error boundary hook for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Component error caught:', error, errorInfo);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // Log error for debugging
      console.error('Error state set:', error);
    }
  }, [error]);

  return { error, resetError, handleError };
}; 