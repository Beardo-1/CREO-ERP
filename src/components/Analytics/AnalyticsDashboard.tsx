import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award, MapPin, Calendar, Eye, Zap, BarChart3, Filter, Download, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

// Sample data for charts
const salesData = [
  { month: 'Jan', sales: 1200000, leads: 45, conversions: 12 },
  { month: 'Feb', sales: 1500000, leads: 52, conversions: 15 },
  { month: 'Mar', sales: 1800000, leads: 60, conversions: 18 },
  { month: 'Apr', sales: 1600000, leads: 55, conversions: 16 },
  { month: 'May', sales: 2000000, leads: 65, conversions: 20 },
  { month: 'Jun', sales: 2200000, leads: 70, conversions: 22 },
];

const COLORS = ['#F59E0B', '#EA580C', '#EAB308', '#FB923C'];

const agentPerformanceData = [
  { name: 'Emma Wilson', sales: 2500000, deals: 15, rating: 4.8 },
  { name: 'John Smith', sales: 1800000, deals: 12, rating: 4.5 },
  { name: 'Sarah Johnson', sales: 2200000, deals: 14, rating: 4.7 },
  { name: 'Michael Brown', sales: 1500000, deals: 10, rating: 4.3 },
];

const revenueData = [
  { month: 'Jan', revenue: 1200000, target: 1100000 },
  { month: 'Feb', revenue: 1500000, target: 1300000 },
  { month: 'Mar', revenue: 1800000, target: 1500000 },
  { month: 'Apr', revenue: 1600000, target: 1700000 },
  { month: 'May', revenue: 2000000, target: 1900000 },
  { month: 'Jun', revenue: 2200000, target: 2100000 },
];

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const propertyTypeData = [
    { name: t(appContent.analytics.residential), value: 45, color: '#F59E0B' },
    { name: t(appContent.analytics.commercial), value: 25, color: '#EA580C' },
    { name: t(appContent.analytics.luxury), value: 20, color: '#EAB308' },
    { name: t(appContent.analytics.investment), value: 10, color: '#FB923C' },
  ];

  const MetricCard = ({ title, value, change, icon: Icon, trend, gradient }: any) => (
    <div className={`relative overflow-hidden rounded-3xl p-8 shadow-xl border-0 ${gradient}`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            trend === 'up' ? 'bg-green-100/80 text-green-800' : 'bg-red-100/80 text-red-800'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        </div>
        <h4 className="text-sm font-medium text-white/80 mb-2">{title}</h4>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(appContent.analyticsDashboard.title)}</h1>
          <p className="text-gray-600">{t(appContent.analyticsDashboard.subtitle)}</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.totalLeads)}</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18.2% {t(appContent.analyticsDashboard.thisMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.conversionRate)}</p>
                <p className="text-2xl font-bold text-green-600">24.8%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3.1% {t(appContent.analyticsDashboard.thisMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.avgDealValue)}</p>
                <p className="text-2xl font-bold text-purple-600">$485K</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% {t(appContent.analyticsDashboard.thisMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{t(appContent.analyticsDashboard.avgSaleCycle)}</p>
                <p className="text-2xl font-bold text-amber-600">42 {t(appContent.analyticsDashboard.days)}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2.3 {t(appContent.analyticsDashboard.days)} {t(appContent.analyticsDashboard.thisMonth)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Performance Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.salesPerformance)}</h3>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>{t(appContent.analyticsDashboard.last30Days)}</option>
                  <option>{t(appContent.analyticsDashboard.last90Days)}</option>
                  <option>{t(appContent.analyticsDashboard.lastYear)}</option>
                </select>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">{t(appContent.analyticsDashboard.chartPlaceholder)}</p>
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.leadSources)}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.website)}</p>
                  <p className="text-sm text-gray-600">387 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">31%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '31%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.referrals)}</p>
                  <p className="text-sm text-gray-600">298 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">24%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.socialMedia)}</p>
                  <p className="text-sm text-gray-600">234 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">19%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{t(appContent.analyticsDashboard.advertising)}</p>
                  <p className="text-sm text-gray-600">189 {t(appContent.analyticsDashboard.leads)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-600">15%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.agentPerformance)}</h3>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>{t(appContent.analyticsDashboard.refresh)}</span>
              </button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{t(appContent.analyticsDashboard.export)}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.agent)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.totalSales)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.commission)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.conversionRate)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.avgDealSize)}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">{t(appContent.analyticsDashboard.performance)}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">SJ</span>
                      </div>
                      <span className="font-medium text-gray-900">Sarah Johnson</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$2.4M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$72K</td>
                  <td className="py-3 px-4 text-gray-900">28.5%</td>
                  <td className="py-3 px-4 text-gray-900">$485K</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.excellent)}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">MC</span>
                      </div>
                      <span className="font-medium text-gray-900">Mike Chen</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$1.8M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$54K</td>
                  <td className="py-3 px-4 text-gray-900">22.1%</td>
                  <td className="py-3 px-4 text-gray-900">$420K</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.good)}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">ED</span>
                      </div>
                      <span className="font-medium text-gray-900">Emily Davis</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">$1.5M</td>
                  <td className="py-3 px-4 font-semibold text-green-600">$45K</td>
                  <td className="py-3 px-4 text-gray-900">19.8%</td>
                  <td className="py-3 px-4 text-gray-900">$375K</td>
                  <td className="py-3 px-4">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t(appContent.analyticsDashboard.average)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t(appContent.analyticsDashboard.marketTrends)}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">+15.2%</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.priceGrowth)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.yearOverYear)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">28 {t(appContent.analyticsDashboard.days)}</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.avgTimeOnMarket)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.thisQuarter)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">92%</p>
              <p className="text-sm text-gray-600">{t(appContent.analyticsDashboard.inventoryTurnover)}</p>
              <p className="text-xs text-gray-500 mt-1">{t(appContent.analyticsDashboard.lastMonth)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;