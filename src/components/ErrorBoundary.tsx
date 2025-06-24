import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
  componentStack: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      componentStack: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Enhanced error logging for production debugging
    if (typeof window !== 'undefined') {
      console.error('React Error Boundary - Error caught:', error);
      console.error('Error ID:', errorId);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Store error in sessionStorage for debugging
      try {
        const errorLog = JSON.parse(sessionStorage.getItem('creo_error_log') || '[]');
        errorLog.push({
          id: errorId,
          timestamp: new Date().toISOString(),
          name: error.name,
          message: error.message,
          stack: error.stack ?? 'No stack trace available'
        });
        sessionStorage.setItem('creo_error_log', JSON.stringify(errorLog.slice(-10))); // Keep last 10 errors
      } catch (e) {
        console.warn('Could not store error log:', e);
      }
    }

    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName, onError } = this.props;
    
    console.error('React Error Boundary - Full error details:', {
      error,
      errorInfo,
      componentName,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Track error patterns
    if (typeof window !== 'undefined') {
      try {
        const errorPatterns = JSON.parse(sessionStorage.getItem('creo_error_patterns') || '{}');
        const errorKey = `${error.name}_${componentName || 'unknown'}`;
        errorPatterns[errorKey] = (errorPatterns[errorKey] || 0) + 1;
        sessionStorage.setItem('creo_error_patterns', JSON.stringify(errorPatterns));
      } catch (e) {
        console.warn('Could not store error patterns:', e);
      }
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
        componentStack: '',
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      componentStack: '',
      retryCount: 0
    });
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback, componentName } = this.props;
      const { error, errorId, retryCount } = this.state;

      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 text-center mb-4">
              {componentName ? `Error in ${componentName} component` : 'An unexpected error occurred'}
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
                <p className="text-xs text-red-600 mt-1">ID: {errorId}</p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              {retryCount < 3 && (
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({3 - retryCount} attempts left)
                </button>
              )}
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
              
              <button
                onClick={this.handleReset}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset Component
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-32 bg-gray-50 p-2 rounded">
                  {JSON.stringify({ error: error?.stack, componentStack: this.state.componentStack }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary }; 