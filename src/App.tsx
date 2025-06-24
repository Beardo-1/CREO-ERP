import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { useTranslation } from './contexts/TranslationContext';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import Overview from './components/Dashboard/Overview';

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to authenticated for now

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Check authentication status using localStorage for now
        const isAuthenticated = localStorage.getItem('creo_authenticated') === 'true';
        const userData = localStorage.getItem('creo_user');
        
        if (isAuthenticated && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // For demo purposes, set default user
          setUser({ name: 'Demo User', role: 'Admin' } as any);
          setIsAuthenticated(true);
        }
        
        console.log('App initialized successfully');
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const renderContent = () => {
    // Simple routing with safe component loading
    switch (activeTab) {
      case 'dashboard':
        return (
          <ErrorBoundary componentName="Dashboard">
            <Overview />
          </ErrorBoundary>
        );

      default:
        return (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-yellow-800 font-medium">Module Not Available</h3>
              <p className="text-yellow-600 text-sm mt-1">
                The requested module "{activeTab}" is not yet implemented.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <ErrorBoundary componentName="App">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <ErrorBoundary componentName="Sidebar">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </ErrorBoundary>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <ErrorBoundary componentName="Header">
            <Header 
              activeTab={activeTab}
              userName={(user as any)?.name || 'User'}
            />
          </ErrorBoundary>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <ErrorBoundary componentName="MainContent">
              {renderContent()}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App; 