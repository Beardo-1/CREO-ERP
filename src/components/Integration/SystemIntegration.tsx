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
  DollarSign,
  Plus,
  Link
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

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
  const { t } = useTranslation();
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
        description: 'Core customer relationship management system',
        dependencies: [],
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.systemIntegration.title)}</h1>
          <p className="text-gray-600">{t(appContent.systemIntegration.subtitle)}</p>
        </div>

        {/* Integration Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.systemIntegration.activeIntegrations)}</p>
                <p className="text-2xl font-bold text-green-600">{connectedIntegrations}</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.systemIntegration.pendingSetup)}</p>
                <p className="text-2xl font-bold text-amber-600">{errorIntegrations}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.systemIntegration.dataSync)}</p>
                <p className="text-2xl font-bold text-blue-600">{syncingIntegrations}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.systemIntegration.apiCalls)}</p>
                <p className="text-2xl font-bold text-purple-600">24.7K</p>
                <p className="text-sm text-gray-500">{t(appContent.systemIntegration.thisMonth)}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Integration Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* CRM Integrations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.systemIntegration.crmIntegrations)}</h3>
              <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{t(appContent.systemIntegration.addNew)}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Salesforce</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">HubSpot</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pipedrive</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.setupRequired)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.pending)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Tools */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.systemIntegration.marketingTools)}</h3>
              <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{t(appContent.systemIntegration.addNew)}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mailchimp</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Google Ads</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Facebook Ads</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Systems */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.systemIntegration.financialSystems)}</h3>
              <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{t(appContent.systemIntegration.addNew)}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">QuickBooks</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stripe</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.connected)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.active)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Xero</p>
                    <p className="text-sm text-gray-600">{t(appContent.systemIntegration.setupRequired)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {t(appContent.systemIntegration.pending)}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.systemIntegration.apiManagement)}</h3>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>{t(appContent.systemIntegration.syncNow)}</span>
              </button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{t(appContent.systemIntegration.newApi)}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">15</p>
              <p className="text-sm text-gray-600">{t(appContent.systemIntegration.activeApis)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-gray-600">{t(appContent.systemIntegration.uptime)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Database className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">2.4M</p>
              <p className="text-sm text-gray-600">{t(appContent.systemIntegration.recordsSynced)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <Link className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">45ms</p>
              <p className="text-sm text-gray-600">{t(appContent.systemIntegration.avgResponseTime)}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.systemIntegration.recentActivity)}</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              {t(appContent.systemIntegration.viewAll)}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t(appContent.systemIntegration.salesforceSync)}</p>
                <p className="text-sm text-gray-600">{t(appContent.systemIntegration.syncedContacts)}</p>
              </div>
              <div className="text-sm text-gray-500">2 {t(appContent.systemIntegration.minutesAgo)}</div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t(appContent.systemIntegration.quickbooksUpdate)}</p>
                <p className="text-sm text-gray-600">{t(appContent.systemIntegration.financialDataSynced)}</p>
              </div>
              <div className="text-sm text-gray-500">15 {t(appContent.systemIntegration.minutesAgo)}</div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Link className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{t(appContent.systemIntegration.mailchimpCampaign)}</p>
                <p className="text-sm text-gray-600">{t(appContent.systemIntegration.campaignDataUpdated)}</p>
              </div>
              <div className="text-sm text-gray-500">1 {t(appContent.systemIntegration.hourAgo)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 