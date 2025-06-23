import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { ChartWidget } from './ChartWidget';
import { useTranslation } from '../../contexts/TranslationContext';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

export function PerformanceDashboard() {
  const { t, currentLanguage } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '17,639,027.24 ريال',
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Agents',
      value: '784',
      change: -2.1,
      trend: 'down',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Deals',
      value: '154',
      change: 8.3,
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Performance Score',
      value: '94.2%',
      change: 1.8,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-amber-600'
    }
  ];

  const agentPerformanceData = [
    { label: 'عبدالرحمن ناجي', value: 36.1, percentage: 36.1, color: '#ef4444' },
    { label: 'محمد النحيس', value: 27.4, percentage: 27.4, color: '#22c55e' },
    { label: 'أحمد الأحمد', value: 21.6, percentage: 21.6, color: '#8b5cf6' },
    { label: 'محمد زميرة', value: 8.2, percentage: 8.2, color: '#3b82f6' },
    { label: 'محمد طارق', value: 3.4, percentage: 3.4, color: '#06b6d4' },
    { label: 'طارق مختار', value: 1.9, percentage: 1.9, color: '#ec4899' },
    { label: 'فايز النحيس', value: 1.4, percentage: 1.4, color: '#0ea5e9' }
  ];

  const monthlyData = [
    { label: 'يناير', value: 15.2, percentage: 15.2, color: '#3b82f6' },
    { label: 'فبراير', value: 18.7, percentage: 18.7, color: '#06b6d4' },
    { label: 'مارس', value: 22.1, percentage: 22.1, color: '#22c55e' },
    { label: 'أبريل', value: 19.8, percentage: 19.8, color: '#84cc16' },
    { label: 'مايو', value: 25.3, percentage: 25.3, color: '#eab308' },
    { label: 'يونيو', value: 28.9, percentage: 28.9, color: '#f97316' },
    { label: 'يوليو', value: 31.2, percentage: 31.2, color: '#ef4444' },
    { label: 'أغسطس', value: 29.6, percentage: 29.6, color: '#ec4899' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time analytics and insights</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-opacity-10 ${metric.color.replace('text', 'bg')}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance Chart */}
          <ChartWidget
            title="Agent Performance Distribution"
            type="pie"
            data={agentPerformanceData}
            showSettings={true}
            showFilters={true}
            customizable={true}
          />

          {/* Monthly Revenue Chart */}
          <ChartWidget
            title="Monthly Revenue Trend"
            type="bar"
            data={monthlyData}
            showSettings={true}
            showFilters={true}
            customizable={true}
          />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lead Quality</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {agentPerformanceData.slice(0, 5).map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{agent.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{agent.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New deal closed</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Lead converted</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Property listed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Client meeting scheduled</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 