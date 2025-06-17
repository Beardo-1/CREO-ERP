import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Share2,
  Settings,
  RefreshCw,
  Target,
  Award,
  Clock,
  MapPin,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Plus,
  Edit,
  Mail,
  FileText,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';

interface ReportData {
  id: string;
  name: string;
  category: 'sales' | 'marketing' | 'financial' | 'operational' | 'team';
  type: 'chart' | 'table' | 'metric' | 'dashboard';
  description: string;
  lastUpdated: Date;
  frequency: 'real-time' | 'daily' | 'weekly' | 'monthly';
  data: any[];
  metrics: ReportMetric[];
}

interface ReportMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  target?: number;
}

interface CustomReport {
  id: string;
  name: string;
  filters: ReportFilter[];
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  groupBy: string;
  chartType: 'bar' | 'line' | 'pie' | 'table';
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  label: string;
}

interface Report {
  id: string;
  name: string;
  category: 'sales' | 'financial' | 'performance' | 'marketing' | 'operational' | 'compliance';
  type: 'chart' | 'table' | 'dashboard' | 'summary';
  description: string;
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  status: 'active' | 'scheduled' | 'draft' | 'archived';
  recipients: string[];
  dataSource: string[];
  metrics: ReportMetric[];
  filters: ReportFilter[];
  visualizations: Visualization[];
  isCustom: boolean;
  createdBy: string;
  tags: string[];
}

interface Visualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'gauge' | 'table';
  title: string;
  data: any[];
  config: any;
}

export function AdvancedReports() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Monthly Sales Performance',
      category: 'sales',
      type: 'dashboard',
      description: 'Comprehensive monthly sales analysis with trends and forecasts',
      lastGenerated: '2024-01-15',
      frequency: 'monthly',
      status: 'active',
      recipients: ['manager@company.com', 'sales@company.com'],
      dataSource: ['deals', 'properties', 'agents'],
      metrics: [
        {
          id: 'm1',
          name: 'Total Sales',
          value: 2450000,
          change: 12.5,
          changeType: 'increase',
          format: 'currency',
          target: 2500000
        },
        {
          id: 'm2',
          name: 'Deals Closed',
          value: 45,
          change: -5.2,
          changeType: 'decrease',
          format: 'number',
          target: 50
        }
      ],
      filters: [
        {
          id: 'f1',
          field: 'date_range',
          operator: 'between',
          value: ['2024-01-01', '2024-01-31'],
          label: 'Date Range'
        }
      ],
      visualizations: [
        {
          id: 'v1',
          type: 'bar',
          title: 'Sales by Agent',
          data: [],
          config: {}
        }
      ],
      isCustom: false,
      createdBy: 'System',
      tags: ['sales', 'monthly', 'performance']
    },
    {
      id: '2',
      name: 'Property Market Analysis',
      category: 'marketing',
      type: 'chart',
      description: 'Market trends and property performance analysis',
      lastGenerated: '2024-01-14',
      frequency: 'weekly',
      status: 'active',
      recipients: ['marketing@company.com'],
      dataSource: ['properties', 'market_data'],
      metrics: [
        {
          id: 'm3',
          name: 'Average Days on Market',
          value: 28,
          change: -15.3,
          changeType: 'decrease',
          format: 'number',
          target: 30
        }
      ],
      filters: [],
      visualizations: [],
      isCustom: true,
      createdBy: 'Sarah Johnson',
      tags: ['market', 'analysis', 'properties']
    }
  ]);

  const [activeTab, setActiveTab] = useState<'reports' | 'builder' | 'scheduled' | 'templates'>('reports');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sample data for visualizations
  const sampleChartData = {
    salesByMonth: [
      { month: 'Jan', sales: 2100000, deals: 38 },
      { month: 'Feb', sales: 2300000, deals: 42 },
      { month: 'Mar', sales: 2450000, deals: 45 },
      { month: 'Apr', sales: 2200000, deals: 40 },
      { month: 'May', sales: 2600000, deals: 48 },
      { month: 'Jun', sales: 2800000, deals: 52 }
    ],
    agentPerformance: [
      { name: 'Emma Wilson', sales: 850000, deals: 15 },
      { name: 'John Smith', sales: 720000, deals: 12 },
      { name: 'Sarah Johnson', sales: 680000, deals: 11 },
      { name: 'Mike Davis', sales: 590000, deals: 10 },
      { name: 'Lisa Brown', sales: 610000, deals: 9 }
    ],
    propertyTypes: [
      { type: 'Single Family', count: 45, percentage: 52 },
      { type: 'Condo', count: 25, percentage: 29 },
      { type: 'Townhouse', count: 12, percentage: 14 },
      { type: 'Multi-Family', count: 4, percentage: 5 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'archived': return <FileText className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'financial': return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'performance': return <Target className="w-5 h-5 text-purple-600" />;
      case 'marketing': return <Star className="w-5 h-5 text-orange-600" />;
      case 'operational': return <Settings className="w-5 h-5 text-gray-600" />;
      case 'compliance': return <Award className="w-5 h-5 text-red-600" />;
      default: return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatMetricValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return value.toLocaleString();
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.reports.advancedReports)}</h1>
        <p className="text-gray-600">{t(appContent.reports.generateReports)}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-sm text-gray-600">{t(appContent.reports.totalReports)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.activeReports)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.scheduled)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.isCustom).length}
              </p>
              <p className="text-sm text-gray-600">{t(appContent.reports.customReports)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'reports', label: t(appContent.reports.allReports), icon: BarChart3 },
            { id: 'builder', label: t(appContent.reports.reportBuilder), icon: Plus },
            { id: 'scheduled', label: t(appContent.reports.scheduledReports), icon: Calendar },
            { id: 'templates', label: t(appContent.reports.templates), icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'reports' && (
        <div className="space-y-8">
          {/* Controls */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t(appContent.reports.searchReports)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t(appContent.reports.allCategories)}</option>
                  <option value="sales">{t(appContent.reports.sales)}</option>
                  <option value="financial">{t(appContent.reports.financial)}</option>
                  <option value="performance">{t(appContent.reports.performance)}</option>
                  <option value="marketing">{t(appContent.reports.marketing)}</option>
                  <option value="operational">{t(appContent.reports.operational)}</option>
                  <option value="compliance">{t(appContent.reports.compliance)}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t(appContent.reports.allStatus)}</option>
                  <option value="active">{t(appContent.reports.active)}</option>
                  <option value="scheduled">{t(appContent.reports.scheduled)}</option>
                  <option value="draft">{t(appContent.reports.draft)}</option>
                  <option value="archived">{t(appContent.reports.archived)}</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  New Report
                </button>

                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid/List */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            {viewMode === 'grid' ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      {getCategoryIcon(report.category)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(appContent.reports.frequency)}</span>
                        <span className="font-medium text-gray-900">{report.frequency}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t(appContent.reports.lastGenerated)}</span>
                        <span className="font-medium text-gray-900">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {report.metrics.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="space-y-2">
                          {report.metrics.slice(0, 2).map(metric => (
                            <div key={metric.id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">{metric.name}</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-medium text-gray-900">
                                  {formatMetricValue(metric.value, metric.format)}
                                </span>
                                {metric.changeType === 'increase' ? (
                                  <TrendingUp className="w-3 h-3 text-green-600" />
                                ) : metric.changeType === 'decrease' ? (
                                  <TrendingDown className="w-3 h-3 text-red-600" />
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1 inline" />
                        {t(appContent.reports.view)}
                      </button>
                      <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
                        <Download className="w-3 h-3 mr-1 inline" />
                        {t(appContent.reports.export)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.report)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.category)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.status)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.frequency)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.lastGenerated)}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(appContent.reports.actions)}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(report.category)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{report.name}</p>
                              <p className="text-xs text-gray-500">{report.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                            {report.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {report.frequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-amber-600 hover:text-amber-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-900">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sample Report Preview */}
      {activeTab === 'reports' && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReport.name}</h2>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    {t(appContent.reports.exportPDF)}
                  </button>
                  <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Mail className="w-4 h-4 mr-2 inline" />
                    {t(appContent.reports.email)}
                  </button>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {t(appContent.reports.close)}
                  </button>
                </div>
              </div>

              {/* Sample Report Content */}
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {selectedReport.metrics.map(metric => (
                    <div key={metric.id} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                        {metric.changeType === 'increase' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : metric.changeType === 'decrease' ? (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatMetricValue(metric.value, metric.format)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          metric.changeType === 'increase' ? 'text-green-600' :
                          metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </span>
                        {metric.target && (
                          <span className="text-xs text-gray-500">
                            Target: {formatMetricValue(metric.target, metric.format)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sales Trend Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {sampleChartData.salesByMonth.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg"
                            style={{ height: `${(data.sales / 3000000) * 200}px` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agent Performance */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                    <div className="space-y-3">
                      {sampleChartData.agentPerformance.map((agent, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">{agent.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatMetricValue(agent.sales, 'currency')}
                            </p>
                            <p className="text-xs text-gray-500">{agent.deals} deals</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {(activeTab === 'builder' || activeTab === 'scheduled' || activeTab === 'templates') && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'builder' ? (
              <Plus className="w-8 h-8 text-amber-600" />
            ) : activeTab === 'scheduled' ? (
              <Calendar className="w-8 h-8 text-amber-600" />
            ) : (
              <FileText className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeTab === 'builder' ? 'Report Builder' :
             activeTab === 'scheduled' ? 'Scheduled Reports' : 'Report Templates'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'builder' ? 'Create custom reports with drag-and-drop interface' :
             activeTab === 'scheduled' ? 'Manage automated report generation and delivery' :
             'Pre-built report templates for quick setup'}
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            Coming Soon
          </button>
        </div>
      )}
    </div>
  );
} 