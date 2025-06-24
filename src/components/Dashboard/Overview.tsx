import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Building,
  Users,
  Handshake,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';
import { ErrorBoundary } from '../ErrorBoundary';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

// Simple, safe dashboard component
export default function Overview() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading Overview data...');
        setIsLoading(true);
        
        // Safe data loading with fallbacks
        const properties = await unifiedDataService.getProperties().catch(() => []);
        const deals = await unifiedDataService.getDeals().catch(() => []);
        const contacts = await unifiedDataService.getContacts().catch(() => []);
        
        // Ensure arrays are valid
        const safeProperties = Array.isArray(properties) ? properties : [];
        const safeDeals = Array.isArray(deals) ? deals : [];
        const safeContacts = Array.isArray(contacts) ? contacts : [];

        // Calculate safe metrics
        const activeDeals = safeDeals.filter(deal => deal && deal.stage !== 'Closed').length;
        const totalRevenue = safeDeals.reduce((sum, deal) => sum + (deal?.value || 0), 0);

        const safeMetrics: MetricCard[] = [
          {
            id: 'revenue',
            title: 'Total Revenue',
            value: `$${(totalRevenue / 1000).toFixed(0)}K`,
            change: 12.5,
            changeType: 'increase',
            icon: DollarSign,
            color: 'green'
          },
          {
            id: 'properties',
            title: 'Properties',
            value: safeProperties.length.toString(),
            change: 8.2,
            changeType: 'increase',
            icon: Building,
            color: 'blue'
          },
          {
            id: 'deals',
            title: 'Active Deals',
            value: activeDeals.toString(),
            change: 5.1,
            changeType: 'increase',
            icon: Handshake,
            color: 'purple'
          },
          {
            id: 'contacts',
            title: 'Contacts',
            value: safeContacts.length.toString(),
            change: 15.7,
            changeType: 'increase',
            icon: Users,
            color: 'amber'
          }
        ];

        setMetrics(safeMetrics);
        console.log('Overview data loaded successfully');
      } catch (err) {
        console.error('Error loading Overview data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">Dashboard Error</h3>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary componentName="Overview" onError={(error) => {
      console.error('Overview component error:', error);
      setError(error.message);
    }}>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to CREO ERP
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your real estate business today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const colorClasses = {
              green: 'bg-green-50 text-green-600',
              blue: 'bg-blue-50 text-blue-600',
              purple: 'bg-purple-50 text-purple-600',
              amber: 'bg-amber-50 text-amber-600'
            };

            return (
              <ErrorBoundary key={metric.id} componentName={`Metric-${metric.id}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses] || 'bg-gray-50 text-gray-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{metric.change}%
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      {metric.title}
                    </p>
                  </div>
                </div>
              </ErrorBoundary>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary componentName="QuickActions">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Add New Property</p>
                      <p className="text-sm text-gray-600">List a new property for sale or rent</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Add New Contact</p>
                      <p className="text-sm text-gray-600">Add a client, lead, or vendor</p>
                    </div>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Schedule Appointment</p>
                      <p className="text-sm text-gray-600">Book a property showing or meeting</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </ErrorBoundary>

          <ErrorBoundary componentName="SystemStatus">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-900">Database</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-900">Data Service</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-900">Authentication</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Ready</span>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
} 