import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Users,
  Handshake,
  Calendar,
  Phone,
  Mail,
  Eye,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
}

interface RecentActivity {
  id: string;
  type: 'property' | 'deal' | 'contact' | 'task';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'info' | 'error';
}

export default function Overview() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  const metrics: MetricCard[] = [
    {
      id: 'revenue',
      title: t(appContent.overview.totalRevenue),
      value: '$2,847,500',
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      color: 'green',
      description: t(appContent.overview.revenueGenerated)
    },
    {
      id: 'properties',
      title: t(appContent.overview.activeProperties),
      value: '1,247',
      change: 8.2,
      changeType: 'increase',
      icon: Building,
      color: 'blue',
      description: t(appContent.overview.propertiesListed)
    },
    {
      id: 'deals',
      title: t(appContent.stats.activeDeals),
      value: '89',
      change: -3.1,
      changeType: 'decrease',
      icon: Handshake,
      color: 'purple',
      description: t(appContent.overview.dealsInProgress)
    },
    {
      id: 'clients',
      title: t(appContent.stats.newClients),
      value: '156',
      change: 15.7,
      changeType: 'increase',
      icon: Users,
      color: 'amber',
      description: t(appContent.overview.newClientsMonth)
    },
    {
      id: 'appointments',
      title: t(appContent.stats.appointments),
      value: '24',
      change: 0,
      changeType: 'neutral',
      icon: Calendar,
      color: 'indigo',
      description: t(appContent.overview.scheduledToday)
    },
    {
      id: 'conversion',
      title: t(appContent.overview.conversionRate),
      value: '94.2%',
      change: 2.3,
      changeType: 'increase',
      icon: Target,
      color: 'emerald',
      description: t(appContent.overview.leadConversion)
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'add-property',
      title: t(appContent.overview.addProperty),
      description: t(appContent.overview.listNewProperty),
      icon: Building,
      color: 'blue',
      action: 'properties'
    },
    {
      id: 'add-contact',
      title: t(appContent.overview.addContact),
      description: t(appContent.overview.createNewContact),
      icon: Users,
      color: 'green',
      action: 'contacts'
    },
    {
      id: 'schedule-meeting',
      title: t(appContent.overview.scheduleMeeting),
      description: t(appContent.overview.bookAppointment),
      icon: Calendar,
      color: 'purple',
      action: 'calendar'
    },
    {
      id: 'create-deal',
      title: t(appContent.overview.createDeal),
      description: t(appContent.overview.startNewDeal),
      icon: Handshake,
      color: 'amber',
      action: 'deals'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'property',
      title: t(appContent.overview.newPropertyListed),
      description: '123 Oak Street - $450,000',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '2',
      type: 'deal',
      title: t(appContent.overview.dealClosed),
      description: '456 Pine Avenue - $320,000',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      id: '3',
      type: 'contact',
      title: t(appContent.overview.newClientAdded),
      description: 'Sarah Johnson - Buyer',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'info'
    },
    {
      id: '4',
      type: 'task',
      title: t(appContent.overview.taskOverdue),
      description: `${t(appContent.overview.propertyInspection)} 789 Elm St`,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'warning'
    }
  ];

  const getMetricColor = (color: string) => {
    const colors = {
      green: 'from-green-500 to-emerald-600',
      blue: 'from-blue-500 to-cyan-600',
      purple: 'from-purple-500 to-violet-600',
      amber: 'from-amber-500 to-orange-600',
      indigo: 'from-indigo-500 to-blue-600',
      emerald: 'from-emerald-500 to-teal-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4" />;
      case 'decrease': return <ArrowDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600 bg-green-100';
      case 'decrease': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building className="w-4 h-4" />;
      case 'deal': return <Handshake className="w-4 h-4" />;
      case 'contact': return <Users className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getMetricColor(metric.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.changeType)}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm mb-2">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t(appContent.overview.quickActions)}</h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getMetricColor(action.color)}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t(appContent.overview.recentActivity)}</h3>
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
            <div className="text-center">
              <LineChart className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <p className="text-gray-500">Revenue chart visualization</p>
              <p className="text-sm text-gray-400">Chart component integration needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-500">Property distribution chart</p>
              <p className="text-sm text-gray-400">Chart component integration needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 