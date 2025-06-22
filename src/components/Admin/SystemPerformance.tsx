import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Clock, 
  Zap, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Globe,
  Monitor,
  Gauge
} from 'lucide-react';

interface PerformanceMetrics {
  cpu: {
    current: number;
    average: number;
    peak: number;
    trend: 'up' | 'down' | 'stable';
  };
  memory: {
    used: number;
    total: number;
    available: number;
    trend: 'up' | 'down' | 'stable';
  };
  storage: {
    used: number;
    total: number;
    available: number;
    trend: 'up' | 'down' | 'stable';
  };
  network: {
    inbound: number;
    outbound: number;
    latency: number;
    trend: 'up' | 'down' | 'stable';
  };
  database: {
    connections: number;
    queries: number;
    responseTime: number;
    trend: 'up' | 'down' | 'stable';
  };
  api: {
    requests: number;
    responseTime: number;
    errorRate: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  metric: string;
  value: number;
  threshold: number;
}

export function SystemPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: {
      current: 45,
      average: 38,
      peak: 87,
      trend: 'stable'
    },
    memory: {
      used: 6.2,
      total: 16,
      available: 9.8,
      trend: 'up'
    },
    storage: {
      used: 450,
      total: 1000,
      available: 550,
      trend: 'up'
    },
    network: {
      inbound: 125,
      outbound: 89,
      latency: 23,
      trend: 'stable'
    },
    database: {
      connections: 45,
      queries: 1250,
      responseTime: 12,
      trend: 'down'
    },
    api: {
      requests: 2340,
      responseTime: 89,
      errorRate: 0.3,
      trend: 'stable'
    }
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'CPU usage above 80% for 5 minutes',
      timestamp: new Date(Date.now() - 300000),
      metric: 'cpu',
      value: 85,
      threshold: 80
    },
    {
      id: '2',
      type: 'info',
      message: 'Database query performance improved',
      timestamp: new Date(Date.now() - 600000),
      metric: 'database',
      value: 12,
      threshold: 20
    }
  ]);

  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          current: Math.max(10, Math.min(95, prev.cpu.current + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          used: Math.max(2, Math.min(14, prev.memory.used + (Math.random() - 0.5) * 0.5))
        },
        network: {
          ...prev.network,
          inbound: Math.max(50, Math.min(500, prev.network.inbound + (Math.random() - 0.5) * 50)),
          outbound: Math.max(30, Math.min(300, prev.network.outbound + (Math.random() - 0.5) * 30)),
          latency: Math.max(10, Math.min(100, prev.network.latency + (Math.random() - 0.5) * 10))
        },
        database: {
          ...prev.database,
          connections: Math.max(20, Math.min(100, prev.database.connections + Math.floor((Math.random() - 0.5) * 10))),
          queries: Math.max(800, Math.min(3000, prev.database.queries + Math.floor((Math.random() - 0.5) * 200))),
          responseTime: Math.max(5, Math.min(50, prev.database.responseTime + (Math.random() - 0.5) * 5))
        },
        api: {
          ...prev.api,
          requests: Math.max(1000, Math.min(5000, prev.api.requests + Math.floor((Math.random() - 0.5) * 300))),
          responseTime: Math.max(50, Math.min(200, prev.api.responseTime + (Math.random() - 0.5) * 20)),
          errorRate: Math.max(0, Math.min(5, prev.api.errorRate + (Math.random() - 0.5) * 0.5))
        }
      }));
    };

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateMetrics, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getPerformanceColor = (value: number, type: 'cpu' | 'memory' | 'storage' | 'response' | 'error') => {
    switch (type) {
      case 'cpu':
      case 'memory':
      case 'storage':
        if (value > 80) return 'text-red-600';
        if (value > 60) return 'text-yellow-600';
        return 'text-green-600';
      case 'response':
        if (value > 100) return 'text-red-600';
        if (value > 50) return 'text-yellow-600';
        return 'text-green-600';
      case 'error':
        if (value > 2) return 'text-red-600';
        if (value > 1) return 'text-yellow-600';
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPerformanceBarColor = (value: number, type: 'cpu' | 'memory' | 'storage' | 'response' | 'error') => {
    switch (type) {
      case 'cpu':
      case 'memory':
      case 'storage':
        if (value > 80) return 'bg-red-500';
        if (value > 60) return 'bg-yellow-500';
        return 'bg-green-500';
      case 'response':
        if (value > 100) return 'bg-red-500';
        if (value > 50) return 'bg-yellow-500';
        return 'bg-green-500';
      case 'error':
        if (value > 2) return 'bg-red-500';
        if (value > 1) return 'bg-yellow-500';
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertIcon = (type: 'warning' | 'critical' | 'info') => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: 'warning' | 'critical' | 'info') => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Performance</h1>
            <p className="text-gray-600">Real-time system performance monitoring and metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}</span>
            </button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">CPU Usage</h3>
                  <p className="text-sm text-gray-600">Current load</p>
                </div>
              </div>
              {getTrendIcon(metrics.cpu.trend)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${getPerformanceColor(metrics.cpu.current, 'cpu')}`}>
                  {metrics.cpu.current.toFixed(1)}%
                </span>
                <div className="text-right text-sm text-gray-600">
                  <div>Avg: {metrics.cpu.average}%</div>
                  <div>Peak: {metrics.cpu.peak}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPerformanceBarColor(metrics.cpu.current, 'cpu')}`}
                  style={{ width: `${metrics.cpu.current}%` }}
                />
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MemoryStick className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Memory Usage</h3>
                  <p className="text-sm text-gray-600">RAM utilization</p>
                </div>
              </div>
              {getTrendIcon(metrics.memory.trend)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${getPerformanceColor((metrics.memory.used / metrics.memory.total) * 100, 'memory')}`}>
                  {metrics.memory.used.toFixed(1)}GB
                </span>
                <div className="text-right text-sm text-gray-600">
                  <div>Total: {metrics.memory.total}GB</div>
                  <div>Free: {metrics.memory.available.toFixed(1)}GB</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPerformanceBarColor((metrics.memory.used / metrics.memory.total) * 100, 'memory')}`}
                  style={{ width: `${(metrics.memory.used / metrics.memory.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <HardDrive className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Storage Usage</h3>
                  <p className="text-sm text-gray-600">Disk space</p>
                </div>
              </div>
              {getTrendIcon(metrics.storage.trend)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${getPerformanceColor((metrics.storage.used / metrics.storage.total) * 100, 'storage')}`}>
                  {metrics.storage.used}GB
                </span>
                <div className="text-right text-sm text-gray-600">
                  <div>Total: {metrics.storage.total}GB</div>
                  <div>Free: {metrics.storage.available}GB</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPerformanceBarColor((metrics.storage.used / metrics.storage.total) * 100, 'storage')}`}
                  style={{ width: `${(metrics.storage.used / metrics.storage.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Network Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Network className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Network Activity</h3>
                  <p className="text-sm text-gray-600">Data transfer</p>
                </div>
              </div>
              {getTrendIcon(metrics.network.trend)}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  {metrics.network.latency}ms
                </span>
                <div className="text-right text-sm text-gray-600">
                  <div>↓ {metrics.network.inbound} MB/s</div>
                  <div>↑ {metrics.network.outbound} MB/s</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all bg-blue-500"
                  style={{ width: `${Math.min(metrics.network.latency, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Database className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Database Performance</h3>
                  <p className="text-sm text-gray-600">Query execution and connections</p>
                </div>
              </div>
              {getTrendIcon(metrics.database.trend)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{metrics.database.connections}</div>
                <div className="text-sm text-gray-600">Active Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.database.queries}</div>
                <div className="text-sm text-gray-600">Queries/min</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(metrics.database.responseTime, 'response')}`}>
                  {metrics.database.responseTime}ms
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
            </div>
          </div>

          {/* API Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">API Performance</h3>
                  <p className="text-sm text-gray-600">Request handling and response times</p>
                </div>
              </div>
              {getTrendIcon(metrics.api.trend)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{metrics.api.requests}</div>
                <div className="text-sm text-gray-600">Requests/min</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(metrics.api.responseTime, 'response')}`}>
                  {metrics.api.responseTime}ms
                </div>
                <div className="text-sm text-gray-600">Avg Response</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(metrics.api.errorRate, 'error')}`}>
                  {metrics.api.errorRate.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Error Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Alerts</h3>
            <span className="text-sm text-gray-600">{alerts.length} active alerts</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-sm opacity-75 mt-1">
                      {alert.metric.toUpperCase()}: {alert.value} (threshold: {alert.threshold})
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No performance alerts</p>
                <p className="text-sm text-gray-500">All systems operating normally</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends ({timeRange})</h3>
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Real-time monitoring</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Performance Analytics</h4>
              <p className="text-gray-600 mb-2">Real-time performance charts and trends</p>
              <p className="text-sm text-gray-500">Historical data visualization for {timeRange} timeframe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 