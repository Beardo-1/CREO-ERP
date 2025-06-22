import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Monitor, 
  RefreshCw, 
  Server, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wifi, 
  Zap,
  BarChart3,
  Eye,
  Settings,
  Download,
  Upload,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Bell,
  AlertCircle,
  Info,
  XCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { unifiedDataService } from '../../services/unifiedDataService';

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  activeUsers: number;
  requestsPerMinute: number;
  responseTime: number;
  errorRate: number;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastCheck: Date;
  dependencies: string[];
  description: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SystemStatus() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 34,
    activeUsers: 0,
    requestsPerMinute: 0,
    responseTime: 0,
    errorRate: 0
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'database',
      name: 'Database Server',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 12,
      lastCheck: new Date(),
      dependencies: [],
      description: 'Primary database cluster'
    },
    {
      id: 'api',
      name: 'API Gateway',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 45,
      lastCheck: new Date(),
      dependencies: ['database'],
      description: 'REST API endpoints'
    },
    {
      id: 'auth',
      name: 'Authentication Service',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 23,
      lastCheck: new Date(),
      dependencies: ['database'],
      description: 'User authentication and authorization'
    },
    {
      id: 'storage',
      name: 'File Storage',
      status: 'warning',
      uptime: 98.5,
      responseTime: 156,
      lastCheck: new Date(),
      dependencies: [],
      description: 'Document and media storage'
    },
    {
      id: 'email',
      name: 'Email Service',
      status: 'healthy',
      uptime: 99.2,
      responseTime: 234,
      lastCheck: new Date(),
      dependencies: ['api'],
      description: 'Email notifications and campaigns'
    },
    {
      id: 'analytics',
      name: 'Analytics Engine',
      status: 'healthy',
      uptime: 99.1,
      responseTime: 89,
      lastCheck: new Date(),
      dependencies: ['database', 'api'],
      description: 'Data processing and reporting'
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Storage Usage',
      message: 'Storage usage is at 78%. Consider adding more capacity.',
      timestamp: new Date(Date.now() - 300000),
      acknowledged: false,
      severity: 'medium'
    },
    {
      id: '2',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2:00 AM.',
      timestamp: new Date(Date.now() - 600000),
      acknowledged: true,
      severity: 'low'
    },
    {
      id: '3',
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully.',
      timestamp: new Date(Date.now() - 900000),
      acknowledged: true,
      severity: 'low'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'performance' | 'alerts'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Load real data and simulate system metrics
  useEffect(() => {
    const updateMetrics = () => {
      try {
        const properties = unifiedDataService.getProperties();
        const contacts = unifiedDataService.getContacts();
        const deals = unifiedDataService.getDeals();
        const tasks = unifiedDataService.getTasks();

        // Simulate system metrics based on data volume
        const totalRecords = properties.length + contacts.length + deals.length + tasks.length;
        const activeUsers = Math.floor(Math.random() * 50) + 10;
        const requestsPerMinute = Math.floor(Math.random() * 200) + 100;
        const responseTime = Math.floor(Math.random() * 50) + 20;
        const errorRate = Math.random() * 2;

        setMetrics(prev => ({
          ...prev,
          activeUsers,
          requestsPerMinute,
          responseTime,
          errorRate,
          cpu: Math.min(95, Math.max(10, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.min(95, Math.max(20, prev.memory + (Math.random() - 0.5) * 8)),
          network: Math.min(95, Math.max(5, prev.network + (Math.random() - 0.5) * 15))
        }));

        // Update service status
        setServices(prev => prev.map(service => ({
          ...service,
          lastCheck: new Date(),
          responseTime: Math.floor(Math.random() * 200) + 10,
          status: Math.random() > 0.95 ? 'warning' : 'healthy'
        })));

      } catch (error) {
        console.error('Error updating system metrics:', error);
      }
    };

    updateMetrics();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateMetrics, refreshInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <XCircle className="w-5 h-5" />;
      case 'maintenance': return <Settings className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPerformanceColor = (value: number, type: 'usage' | 'response' | 'error') => {
    if (type === 'usage') {
      if (value > 80) return 'text-red-600';
      if (value > 60) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'response') {
      if (value > 200) return 'text-red-600';
      if (value > 100) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'error') {
      if (value > 5) return 'text-red-600';
      if (value > 2) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const overallSystemHealth = () => {
    const criticalServices = services.filter(s => s.status === 'critical').length;
    const warningServices = services.filter(s => s.status === 'warning').length;
    
    if (criticalServices > 0) return 'critical';
    if (warningServices > 1 || metrics.cpu > 90 || metrics.memory > 90) return 'warning';
    return 'healthy';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Status Dashboard</h1>
          <p className="text-gray-600">Monitor system health, performance, and alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-lg text-sm ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
              disabled={!autoRefresh}
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
            </select>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall System Health */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">System Health Overview</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(overallSystemHealth())}`}>
            {getStatusIcon(overallSystemHealth())}
            <span className="font-medium capitalize">{overallSystemHealth()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{services.filter(s => s.status === 'healthy').length}/{services.length}</div>
            <div className="text-sm text-gray-600">Services Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.requestsPerMinute}</div>
            <div className="text-sm text-gray-600">Requests/Min</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.responseTime, 'response')}`}>
              {metrics.responseTime}ms
            </div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'services', label: 'Services', icon: Server },
            { id: 'performance', label: 'Performance', icon: Activity },
            { id: 'alerts', label: 'Alerts', icon: Bell }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Usage */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: metrics.cpu, icon: Cpu, color: 'blue' },
                { label: 'Memory Usage', value: metrics.memory, icon: MemoryStick, color: 'green' },
                { label: 'Storage Usage', value: metrics.storage, icon: HardDrive, color: 'purple' },
                { label: 'Network Usage', value: metrics.network, icon: Network, color: 'orange' }
              ].map((resource) => (
                <div key={resource.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <resource.icon className={`w-5 h-5 text-${resource.color}-600`} />
                    <span className="text-gray-700">{resource.label}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${resource.color}-600 h-2 rounded-full`}
                        style={{ width: `${resource.value}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${getPerformanceColor(resource.value, 'usage')}`}>
                      {resource.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Status Summary */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
            <div className="space-y-3">
              {services.slice(0, 4).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.uptime}% uptime</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getPerformanceColor(service.responseTime, 'response')}`}>
                      {service.responseTime}ms
                    </div>
                    <div className="text-sm text-gray-600">response</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencies</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="capitalize">{service.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.uptime}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPerformanceColor(service.responseTime, 'response')}`}>
                        {service.responseTime}ms
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.lastCheck.toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {service.dependencies.map((dep) => (
                          <span key={dep} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className={`text-3xl font-bold ${getPerformanceColor(metrics.responseTime, 'response')}`}>
                {metrics.responseTime}ms
              </div>
              <div className="text-sm text-gray-600">Average response time</div>
            </div>

            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Error Rate</h3>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className={`text-3xl font-bold ${getPerformanceColor(metrics.errorRate, 'error')}`}>
                {metrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Error rate</div>
            </div>

            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Throughput</h3>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {metrics.requestsPerMinute}
              </div>
              <div className="text-sm text-gray-600">Requests per minute</div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance charts would be displayed here</p>
                <p className="text-sm text-gray-400">Real-time monitoring with historical data</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow border p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">System is running smoothly with no alerts to display.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-lg shadow border p-4 ${
                !alert.acknowledged ? 'border-l-4 border-l-yellow-500' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-gray-600">{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 