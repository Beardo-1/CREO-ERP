import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Download, 
  Filter, 
  Search, 
  RefreshCw, 
  Eye, 
  Share2, 
  Settings, 
  Target, 
  Award, 
  Clock, 
  MapPin, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Plus,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface SalesMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage';
  period: string;
  target?: number;
  category: 'revenue' | 'volume' | 'performance' | 'conversion';
}

interface SalesData {
  period: string;
  revenue: number;
  units: number;
  averagePrice: number;
  commissions: number;
  leads: number;
  conversions: number;
  activeListings: number;
  closedDeals: number;
}

interface AgentPerformance {
  id: string;
  name: string;
  avatar: string;
  revenue: number;
  units: number;
  commissions: number;
  conversionRate: number;
  averageDealSize: number;
  activeDeals: number;
  rank: number;
  change: number;
  target: number;
  achievement: number;
}

interface PropertyTypeData {
  type: string;
  count: number;
  revenue: number;
  averagePrice: number;
  averageDays: number;
  percentage: number;
  color: string;
}

export function SalesAnalytics() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const salesMetrics: SalesMetric[] = [
    {
      id: 'total-revenue',
      name: t(appContent.salesAnalytics.totalRevenue),
      value: 2450000,
      previousValue: 2180000,
      change: 12.4,
      changeType: 'increase',
      format: 'currency',
      period: t(appContent.salesAnalytics.last30Days),
      target: 2500000,
      category: 'revenue'
    },
    {
      id: 'units-sold',
      name: t(appContent.salesAnalytics.unitsSold),
      value: 47,
      previousValue: 42,
      change: 11.9,
      changeType: 'increase',
      format: 'number',
      period: t(appContent.salesAnalytics.last30Days),
      target: 50,
      category: 'volume'
    },
    {
      id: 'average-price',
      name: t(appContent.salesAnalytics.averageSalePrice),
      value: 521277,
      previousValue: 518952,
      change: 0.4,
      changeType: 'increase',
      format: 'currency',
      period: t(appContent.salesAnalytics.last30Days),
      category: 'performance'
    },
    {
      id: 'conversion-rate',
      name: t(appContent.salesAnalytics.leadConversionRate),
      value: 18.5,
      previousValue: 16.2,
      change: 2.3,
      changeType: 'increase',
      format: 'percentage',
      period: t(appContent.salesAnalytics.last30Days),
      target: 20,
      category: 'conversion'
    },
    {
      id: 'commission-earned',
      name: t(appContent.salesAnalytics.commissionEarned),
      value: 147000,
      previousValue: 130800,
      change: 12.4,
      changeType: 'increase',
      format: 'currency',
      period: t(appContent.salesAnalytics.last30Days),
      category: 'revenue'
    },
    {
      id: 'average-days',
      name: t(appContent.salesAnalytics.averageDaysOnMarket),
      value: 28,
      previousValue: 32,
      change: -12.5,
      changeType: 'increase',
      format: 'number',
      period: t(appContent.salesAnalytics.last30Days),
      category: 'performance'
    }
  ];

  const salesData: SalesData[] = [
    { period: 'Week 1', revenue: 580000, units: 11, averagePrice: 527273, commissions: 34800, leads: 45, conversions: 8, activeListings: 125, closedDeals: 11 },
    { period: 'Week 2', revenue: 620000, units: 12, averagePrice: 516667, commissions: 37200, leads: 52, conversions: 9, activeListings: 128, closedDeals: 12 },
    { period: 'Week 3', revenue: 650000, units: 13, averagePrice: 500000, commissions: 39000, leads: 48, conversions: 10, activeListings: 132, closedDeals: 13 },
    { period: 'Week 4', revenue: 600000, units: 11, averagePrice: 545455, commissions: 36000, leads: 55, conversions: 12, activeListings: 135, closedDeals: 11 }
  ];

  const agentPerformance: AgentPerformance[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      revenue: 850000,
      units: 16,
      commissions: 51000,
      conversionRate: 22.5,
      averageDealSize: 531250,
      activeDeals: 8,
      rank: 1,
      change: 15.2,
      target: 800000,
      achievement: 106.3
    },
    {
      id: '2',
      name: 'Mike Wilson',
      avatar: 'MW',
      revenue: 720000,
      units: 14,
      commissions: 43200,
      conversionRate: 19.8,
      averageDealSize: 514286,
      activeDeals: 6,
      rank: 2,
      change: 8.7,
      target: 700000,
      achievement: 102.9
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'ED',
      revenue: 680000,
      units: 13,
      commissions: 40800,
      conversionRate: 18.2,
      averageDealSize: 523077,
      activeDeals: 7,
      rank: 3,
      change: 12.1,
      target: 650000,
      achievement: 104.6
    },
    {
      id: '4',
      name: 'John Smith',
      avatar: 'JS',
      revenue: 520000,
      units: 10,
      commissions: 31200,
      conversionRate: 16.5,
      averageDealSize: 520000,
      activeDeals: 5,
      rank: 4,
      change: -2.3,
      target: 550000,
      achievement: 94.5
    }
  ];

  const propertyTypes: PropertyTypeData[] = [
    { type: 'Single Family', count: 28, revenue: 1450000, averagePrice: 517857, averageDays: 25, percentage: 59.6, color: 'bg-blue-500' },
    { type: 'Condo', count: 12, revenue: 580000, averagePrice: 483333, averageDays: 32, percentage: 25.5, color: 'bg-green-500' },
    { type: 'Townhouse', count: 5, revenue: 320000, averagePrice: 640000, averageDays: 28, percentage: 10.6, color: 'bg-purple-500' },
    { type: 'Multi-Family', count: 2, revenue: 100000, averagePrice: 500000, averageDays: 45, percentage: 4.3, color: 'bg-orange-500' }
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return value.toLocaleString();
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

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-6 h-6" />;
      case 'volume': return <Home className="w-6 h-6" />;
      case 'performance': return <TrendingUp className="w-6 h-6" />;
      case 'conversion': return <Target className="w-6 h-6" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getMetricColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'bg-green-100 text-green-600';
      case 'volume': return 'bg-blue-100 text-blue-600';
      case 'performance': return 'bg-purple-100 text-purple-600';
      case 'conversion': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
              <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.salesAnalytics.title)}</h1>
          <p className="text-gray-600">{t(appContent.salesAnalytics.comprehensiveAnalytics)}</p>
        </div>

      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' },
                { id: '1y', label: '1 Year' }
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
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Agents</option>
              {agentPerformance.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="north">North Chicago</option>
              <option value="south">South Chicago</option>
              <option value="west">West Suburbs</option>
              <option value="east">East Suburbs</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'detailed', label: 'Detailed' },
                { id: 'comparison', label: 'Compare' }
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

            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>

            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors">
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {salesMetrics.map(metric => (
          <div key={metric.id} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getMetricColor(metric.category)}`}>
                {getMetricIcon(metric.category)}
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
            
            {metric.target && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Target</span>
                  <span>{formatValue(metric.target, metric.format)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((metric.value / metric.target) * 100).toFixed(1)}% of target
                </p>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Previous: {formatValue(metric.previousValue, metric.format)}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t(appContent.salesAnalytics.revenueTrend)}</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg transition-all duration-300 hover:from-amber-600 hover:to-orange-600"
                  style={{ height: `${(data.revenue / Math.max(...salesData.map(d => d.revenue))) * 200}px` }}
                />
                <p className="text-xs text-gray-600 mt-2 text-center">{data.period}</p>
                <p className="text-xs font-medium text-gray-900">
                  {formatValue(data.revenue, 'currency')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Property Types Distribution */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t(appContent.salesAnalytics.propertyTypes)}</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <PieChart className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {propertyTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{type.type}</p>
                    <p className="text-sm text-gray-600">{type.count} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatValue(type.revenue, 'currency')}</p>
                  <p className="text-sm text-gray-600">{type.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t(appContent.salesAnalytics.agentPerformance)}</h3>
            <div className="flex space-x-2">
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                {t(appContent.salesAnalytics.allAgents)}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                {t(appContent.salesAnalytics.topPerformers)}
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.agent)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.revenue)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.units)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.avgDealSize)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.conversion)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.targetAchievement)}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t(appContent.salesAnalytics.change)}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentPerformance.map((agent, index) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">#{agent.rank}</span>
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {agent.avatar}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.activeDeals} active deals</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{formatValue(agent.revenue, 'currency')}</p>
                    <p className="text-sm text-gray-600">{formatValue(agent.commissions, 'currency')} commission</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{agent.units}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{formatValue(agent.averageDealSize, 'currency')}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{agent.conversionRate}%</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            agent.achievement >= 100 ? 'bg-green-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(agent.achievement, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${
                        agent.achievement >= 100 ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {agent.achievement}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center space-x-1 ${
                      agent.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {agent.change >= 0 ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(agent.change)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{t(appContent.salesAnalytics.marketTrends)}</h4>
              <p className="text-sm text-gray-600">Positive momentum</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Sales volume increased 12% compared to last month, with strong demand in single-family homes.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">Above market average</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Goal Progress</h4>
              <p className="text-sm text-gray-600">Monthly targets</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Currently at 98% of monthly revenue target with 5 days remaining in the period.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">On track to exceed</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Opportunities</h4>
              <p className="text-sm text-gray-600">Areas for improvement</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Condo market showing slower movement. Consider adjusted pricing strategies.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Info className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600 font-medium">Requires attention</span>
          </div>
        </div>
      </div>
    </div>
  );
} 