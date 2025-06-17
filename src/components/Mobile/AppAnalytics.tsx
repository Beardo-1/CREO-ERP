import React, { useState } from 'react';
import { 
  Smartphone, 
  Users, 
  Download, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Clock, 
  MapPin, 
  Eye, 
  Share2, 
  Heart, 
  MessageCircle, 
  Search, 
  Filter, 
  Calendar, 
  Globe, 
  Zap, 
  Award, 
  Target, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  Settings
} from 'lucide-react';

interface AppMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'percentage' | 'duration' | 'rating';
  period: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface UserSession {
  id: string;
  userId: string;
  platform: 'iOS' | 'Android';
  version: string;
  duration: number;
  screens: number;
  actions: number;
  startTime: string;
  endTime: string;
  location: string;
  device: string;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  users: number;
  sessions: number;
  avgDuration: number;
  retention: number;
  satisfaction: number;
}

export function AppAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'iOS' | 'Android'>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'users' | 'features' | 'performance'>('overview');

  const appMetrics: AppMetric[] = [
    {
      id: 'downloads',
      name: 'Total Downloads',
      value: 12450,
      previousValue: 11200,
      change: 11.2,
      changeType: 'increase',
      format: 'number',
      period: 'Last 7 days',
      icon: Download,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'active-users',
      name: 'Daily Active Users',
      value: 3240,
      previousValue: 2980,
      change: 8.7,
      changeType: 'increase',
      format: 'number',
      period: 'Last 7 days',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'session-duration',
      name: 'Avg Session Duration',
      value: 8.5,
      previousValue: 7.2,
      change: 18.1,
      changeType: 'increase',
      format: 'duration',
      period: 'Last 7 days',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'app-rating',
      name: 'App Store Rating',
      value: 4.6,
      previousValue: 4.4,
      change: 4.5,
      changeType: 'increase',
      format: 'rating',
      period: 'Last 7 days',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'retention-rate',
      name: 'Day 7 Retention',
      value: 68,
      previousValue: 62,
      change: 9.7,
      changeType: 'increase',
      format: 'percentage',
      period: 'Last 7 days',
      icon: Target,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'crash-rate',
      name: 'Crash Rate',
      value: 0.8,
      previousValue: 1.2,
      change: -33.3,
      changeType: 'increase',
      format: 'percentage',
      period: 'Last 7 days',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const recentSessions: UserSession[] = [
    {
      id: '1',
      userId: 'user-123',
      platform: 'iOS',
      version: '2.1.0',
      duration: 12,
      screens: 8,
      actions: 15,
      startTime: '2024-01-20T14:30:00Z',
      endTime: '2024-01-20T14:42:00Z',
      location: 'Chicago, IL',
      device: 'iPhone 14 Pro'
    },
    {
      id: '2',
      userId: 'user-456',
      platform: 'Android',
      version: '2.0.8',
      duration: 6,
      screens: 4,
      actions: 8,
      startTime: '2024-01-20T13:15:00Z',
      endTime: '2024-01-20T13:21:00Z',
      location: 'Springfield, IL',
      device: 'Samsung Galaxy S23'
    }
  ];

  const featureUsage: FeatureUsage[] = [
    {
      feature: 'Property Search',
      usage: 89,
      users: 2890,
      sessions: 4560,
      avgDuration: 4.2,
      retention: 78,
      satisfaction: 4.5
    },
    {
      feature: 'Saved Properties',
      usage: 67,
      users: 2170,
      sessions: 3240,
      avgDuration: 2.8,
      retention: 85,
      satisfaction: 4.7
    },
    {
      feature: 'Agent Contact',
      usage: 45,
      users: 1460,
      sessions: 1890,
      avgDuration: 3.5,
      retention: 72,
      satisfaction: 4.3
    },
    {
      feature: 'Virtual Tours',
      usage: 34,
      users: 1100,
      sessions: 1340,
      avgDuration: 8.7,
      retention: 68,
      satisfaction: 4.8
    },
    {
      feature: 'Mortgage Calculator',
      usage: 28,
      users: 910,
      sessions: 1120,
      avgDuration: 5.1,
      retention: 65,
      satisfaction: 4.2
    }
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${value}%`;
      case 'duration':
        return `${value} min`;
      case 'rating':
        return `${value}/5`;
      default:
        return value.toString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'iOS': return '🍎';
      case 'Android': return '🤖';
      default: return '📱';
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">App Analytics</h1>
        <p className="text-gray-600">Mobile application performance and user behavior insights</p>
      </div>

      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              {[
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' }
              ].map(period => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id as any)}
                  className={`px-4 py-2 ${
                    selectedPeriod === period.id 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Platforms</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'Users' },
                { id: 'features', label: 'Features' },
                { id: 'performance', label: 'Performance' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 ${
                    viewMode === mode.id 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {appMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
                    {getChangeIcon(metric.changeType)}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{metric.period}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.name}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metric.value, metric.format)}
                </p>
              </div>
              
              <div className="text-xs text-gray-500">
                Previous: {formatValue(metric.previousValue, metric.format)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Distribution */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <p className="font-medium text-gray-900">iOS</p>
                    <p className="text-sm text-gray-600">7,450 users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">59.8%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '59.8%' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="font-medium text-gray-900">Android</p>
                    <p className="text-sm text-gray-600">5,000 users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">40.2%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '40.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            
            <div className="space-y-4">
              {recentSessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getPlatformIcon(session.platform)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{session.device}</p>
                      <p className="text-sm text-gray-600">{session.platform} {session.version}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{session.duration} min</p>
                    <p className="text-sm text-gray-600">{session.screens} screens</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'features' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Feature Usage Analytics</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {featureUsage.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{feature.feature}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${feature.usage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{feature.usage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900">{feature.users.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900">{feature.avgDuration} min</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-900">{feature.retention}%</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-900">{feature.satisfaction}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(viewMode === 'users' || viewMode === 'performance') && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {viewMode === 'users' ? 'User Analytics' : 'Performance Metrics'}
          </h3>
          <p className="text-gray-600">
            {viewMode === 'users' 
              ? 'Detailed user behavior and demographics analysis'
              : 'App performance, crashes, and technical metrics'
            }
          </p>
        </div>
      )}
    </div>
  );
} 