import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Database, 
  Cloud, 
  Shield, 
  Globe, 
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Monitor,
  Wifi,
  Server,
  Lock,
  Eye,
  Activity,
  BarChart3,
  Users,
  Home,
  DollarSign
} from 'lucide-react';

interface IntegrationStatus {
  id: string;
  name: string;
  category: 'core' | 'external' | 'security' | 'analytics';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: Date;
  description: string;
  dependencies: string[];
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    database: 'healthy' | 'warning' | 'critical';
    api: 'healthy' | 'warning' | 'critical';
    frontend: 'healthy' | 'warning' | 'critical';
    integrations: 'healthy' | 'warning' | 'critical';
  };
  performance: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
}

export function SystemIntegration() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationStatus | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'monitoring'>('overview');

  useEffect(() => {
    // Mock integration data
    const mockIntegrations: IntegrationStatus[] = [
      {
        id: 'crm-core',
        name: 'CRM Core System',
        category: 'core',
        status: 'connected',
        lastSync: new Date(),
        description: 'Central customer relationship management system',
        dependencies: ['database', 'auth-service'],
        metrics: {
          uptime: 99.9,
          responseTime: 120,
          errorRate: 0.1,
          throughput: 1500
        }
      },
      {
        id: 'property-management',
        name: 'Property Management',
        category: 'core',
        status: 'connected',
        lastSync: new Date(Date.now() - 300000),
        description: 'Property listing and management system',
        dependencies: ['crm-core', 'media-storage'],
        metrics: {
          uptime: 99.8,
          responseTime: 95,
          errorRate: 0.2,
          throughput: 800
        }
      },
      {
        id: 'mls-integration',
        name: 'MLS Data Feed',
        category: 'external',
        status: 'syncing',
        lastSync: new Date(Date.now() - 600000),
        description: 'Multiple Listing Service data synchronization',
        dependencies: ['property-management'],
        metrics: {
          uptime: 98.5,
          responseTime: 2500,
          errorRate: 1.2,
          throughput: 200
        }
      },
      {
        id: 'email-service',
        name: 'Email Marketing Platform',
        category: 'external',
        status: 'connected',
        lastSync: new Date(Date.now() - 180000),
        description: 'Automated email campaigns and notifications',
        dependencies: ['crm-core'],
        metrics: {
          uptime: 99.5,
          responseTime: 450,
          errorRate: 0.5,
          throughput: 5000
        }
      },
      {
        id: 'payment-gateway',
        name: 'Payment Processing',
        category: 'external',
        status: 'connected',
        lastSync: new Date(Date.now() - 120000),
        description: 'Secure payment processing for transactions',
        dependencies: ['security-service'],
        metrics: {
          uptime: 99.99,
          responseTime: 200,
          errorRate: 0.01,
          throughput: 300
        }
      },
      {
        id: 'document-storage',
        name: 'Document Storage',
        category: 'external',
        status: 'connected',
        lastSync: new Date(Date.now() - 60000),
        description: 'Cloud document storage and management',
        dependencies: ['security-service'],
        metrics: {
          uptime: 99.7,
          responseTime: 180,
          errorRate: 0.3,
          throughput: 1200
        }
      },
      {
        id: 'auth-service',
        name: 'Authentication Service',
        category: 'security',
        status: 'connected',
        lastSync: new Date(),
        description: 'User authentication and authorization',
        dependencies: [],
        metrics: {
          uptime: 99.95,
          responseTime: 50,
          errorRate: 0.05,
          throughput: 2000
        }
      },
      {
        id: 'security-monitoring',
        name: 'Security Monitoring',
        category: 'security',
        status: 'connected',
        lastSync: new Date(Date.now() - 30000),
        description: 'Real-time security threat detection',
        dependencies: ['auth-service'],
        metrics: {
          uptime: 99.9,
          responseTime: 75,
          errorRate: 0.1,
          throughput: 10000
        }
      },
      {
        id: 'analytics-engine',
        name: 'Analytics Engine',
        category: 'analytics',
        status: 'connected',
        lastSync: new Date(Date.now() - 90000),
        description: 'Business intelligence and reporting',
        dependencies: ['crm-core', 'property-management'],
        metrics: {
          uptime: 99.6,
          responseTime: 300,
          errorRate: 0.4,
          throughput: 600
        }
      },
      {
        id: 'mobile-api',
        name: 'Mobile API Gateway',
        category: 'core',
        status: 'error',
        lastSync: new Date(Date.now() - 1800000),
        description: 'API gateway for mobile applications',
        dependencies: ['crm-core', 'auth-service'],
        metrics: {
          uptime: 95.2,
          responseTime: 800,
          errorRate: 4.8,
          throughput: 400
        }
      }
    ];

    const mockSystemHealth: SystemHealth = {
      overall: 'healthy',
      components: {
        database: 'healthy',
        api: 'healthy',
        frontend: 'healthy',
        integrations: 'warning'
      },
      performance: {
        cpu: 45,
        memory: 62,
        storage: 78,
        network: 23
      }
    };

    setIntegrations(mockIntegrations);
    setSystemHealth(mockSystemHealth);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'disconnected': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return Database;
      case 'external': return Globe;
      case 'security': return Shield;
      case 'analytics': return BarChart3;
      default: return Settings;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const errorIntegrations = integrations.filter(i => i.status === 'error').length;
  const syncingIntegrations = integrations.filter(i => i.status === 'syncing').length;

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Integration</h1>
            <p className="text-gray-600">Monitor and manage all system integrations and health</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh All</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* System Health Overview */}
        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${getHealthColor(systemHealth.overall)}`}>
                    {systemHealth.overall.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">Overall Health</div>
                </div>
                <Monitor className={`w-8 h-8 ${getHealthColor(systemHealth.overall)}`} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{connectedIntegrations}</div>
                  <div className="text-sm text-gray-600">Connected</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{syncingIntegrations}</div>
                  <div className="text-sm text-gray-600">Syncing</div>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{errorIntegrations}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{integrations.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <Database className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>
        )}

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'overview' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'detailed' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Detailed View
          </button>
          <button
            onClick={() => setViewMode('monitoring')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'monitoring' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const StatusIcon = getStatusIcon(integration.status);
            const CategoryIcon = getCategoryIcon(integration.category);
            
            return (
              <div
                key={integration.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedIntegration(integration)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CategoryIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{integration.category}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(integration.status)}`}>
                    <StatusIcon className={`w-4 h-4 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                    <span className="capitalize">{integration.status}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Uptime:</span>
                    <div className="font-medium">{integration.metrics.uptime}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Response:</span>
                    <div className="font-medium">{integration.metrics.responseTime}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Error Rate:</span>
                    <div className="font-medium">{integration.metrics.errorRate}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Sync:</span>
                    <div className="font-medium">
                      {Math.floor((Date.now() - integration.lastSync.getTime()) / 60000)}m ago
                    </div>
                  </div>
                </div>

                {integration.dependencies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Dependencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {integration.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'monitoring' && systemHealth && (
        <div className="space-y-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                  <span className="text-sm font-bold text-gray-900">{systemHealth.performance.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPerformanceColor(systemHealth.performance.cpu)}`}
                    style={{ width: `${systemHealth.performance.cpu}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                  <span className="text-sm font-bold text-gray-900">{systemHealth.performance.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPerformanceColor(systemHealth.performance.memory)}`}
                    style={{ width: `${systemHealth.performance.memory}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Storage Usage</span>
                  <span className="text-sm font-bold text-gray-900">{systemHealth.performance.storage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPerformanceColor(systemHealth.performance.storage)}`}
                    style={{ width: `${systemHealth.performance.storage}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Network Usage</span>
                  <span className="text-sm font-bold text-gray-900">{systemHealth.performance.network}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPerformanceColor(systemHealth.performance.network)}`}
                    style={{ width: `${systemHealth.performance.network}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Component Health */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Component Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Database className={`w-12 h-12 mx-auto mb-3 ${getHealthColor(systemHealth.components.database)}`} />
                <h3 className="font-semibold text-gray-900">Database</h3>
                <p className={`text-sm font-medium capitalize ${getHealthColor(systemHealth.components.database)}`}>
                  {systemHealth.components.database}
                </p>
              </div>
              
              <div className="text-center">
                <Server className={`w-12 h-12 mx-auto mb-3 ${getHealthColor(systemHealth.components.api)}`} />
                <h3 className="font-semibold text-gray-900">API Services</h3>
                <p className={`text-sm font-medium capitalize ${getHealthColor(systemHealth.components.api)}`}>
                  {systemHealth.components.api}
                </p>
              </div>
              
              <div className="text-center">
                <Monitor className={`w-12 h-12 mx-auto mb-3 ${getHealthColor(systemHealth.components.frontend)}`} />
                <h3 className="font-semibold text-gray-900">Frontend</h3>
                <p className={`text-sm font-medium capitalize ${getHealthColor(systemHealth.components.frontend)}`}>
                  {systemHealth.components.frontend}
                </p>
              </div>
              
              <div className="text-center">
                <Globe className={`w-12 h-12 mx-auto mb-3 ${getHealthColor(systemHealth.components.integrations)}`} />
                <h3 className="font-semibold text-gray-900">Integrations</h3>
                <p className={`text-sm font-medium capitalize ${getHealthColor(systemHealth.components.integrations)}`}>
                  {systemHealth.components.integrations}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedIntegration.name}</h2>
                  <p className="text-gray-600">{selectedIntegration.description}</p>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium">{selectedIntegration.metrics.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{selectedIntegration.metrics.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Rate:</span>
                      <span className="font-medium">{selectedIntegration.metrics.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Throughput:</span>
                      <span className="font-medium">{selectedIntegration.metrics.throughput} req/min</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{selectedIntegration.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium capitalize ${
                        selectedIntegration.status === 'connected' ? 'text-green-600' :
                        selectedIntegration.status === 'error' ? 'text-red-600' :
                        selectedIntegration.status === 'syncing' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {selectedIntegration.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium">{selectedIntegration.lastSync.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedIntegration.dependencies.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Dependencies</h4>
                      <div className="space-y-2">
                        {selectedIntegration.dependencies.map((dep) => (
                          <div key={dep} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{dep}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 