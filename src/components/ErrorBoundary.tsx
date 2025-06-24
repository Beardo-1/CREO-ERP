import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTracker } from '../utils/errorTracker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    // Only log in development to avoid production console spam
    if (import.meta.env.DEV) {
      console.log('React Error Boundary - Error caught:', error);
    }
    return { 
      hasError: true, 
      error,
      errorCount: 0 // Reset in getDerivedStateFromError
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track the error with component name
    const componentName = this.props.componentName || 'Unknown Component';
    errorTracker.trackError(componentName, error);

    // Only log detailed errors in development
    if (import.meta.env.DEV) {
      console.error('React Error Boundary - Error caught:', error);
      console.error('React Error Boundary - Full error details:', { error, errorInfo });
      console.error('Component Stack:', errorInfo.componentStack);
    }
    
    this.setState(prevState => ({ 
      error, 
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    } else {
      // If too many retries, reload the page
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const componentName = this.props.componentName || 'Component';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-sm text-gray-600 mb-4">
                We're sorry, but the {componentName} encountered an error. You can try again or refresh the page.
              </p>
              
              {/* Show error details only in development */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                  <summary className="cursor-pointer font-medium">Error Details (Dev Only)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
                  <div className="mt-2 text-xs text-gray-400">
                    Component: {componentName}
                  </div>
                  {this.state.error.stack && (
                    <pre className="mt-1 whitespace-pre-wrap text-xs">{this.state.error.stack.slice(0, 500)}...</pre>
                  )}
                </details>
              )}
              
              <div className="flex space-x-3">
                {this.retryCount < this.maxRetries && (
                  <button
                    onClick={this.handleRetry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Try Again ({this.maxRetries - this.retryCount} left)
                  </button>
                )}
                <button
                  onClick={this.handleReload}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 