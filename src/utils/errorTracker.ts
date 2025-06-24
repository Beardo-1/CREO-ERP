// Error Tracker for identifying problematic components
interface ErrorReport {
  componentName: string;
  error: Error;
  timestamp: Date;
  stackTrace: string;
  userAgent: string;
  url: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorReport[] = [];
  private maxErrors = 50; // Keep last 50 errors

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(componentName: string, error: Error): void {
    const errorReport: ErrorReport = {
      componentName,
      error,
      timestamp: new Date(),
      stackTrace: error.stack || '',
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.unshift(errorReport);
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Only log in development
    if (import.meta.env.DEV) {
      console.error(`🚨 Component Error Tracked: ${componentName}`, {
        error: error.message,
        stack: error.stack?.slice(0, 200),
        timestamp: errorReport.timestamp
      });
    }
  }

  getErrorStats(): { [componentName: string]: number } {
    const stats: { [componentName: string]: number } = {};
    
    this.errors.forEach(errorReport => {
      stats[errorReport.componentName] = (stats[errorReport.componentName] || 0) + 1;
    });

    return stats;
  }

  getMostProblematicComponents(limit = 5): Array<{ name: string; count: number }> {
    const stats = this.getErrorStats();
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getRecentErrors(limit = 10): ErrorReport[] {
    return this.errors.slice(0, limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorTracker = ErrorTracker.getInstance(); 