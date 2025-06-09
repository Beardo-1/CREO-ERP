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
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

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
  label: string;
  value: number | string;
  change: number;
  format: 'currency' | 'percentage' | 'number' | 'text';
  trend: 'up' | 'down' | 'stable';
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
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export function AdvancedReports() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'custom'>('overview');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    // Mock data - in real app, this would come from analytics APIs
    const mockReports: ReportData[] = [
      {
        id: '1',
        name: 'Sales Performance Dashboard',
        category: 'sales',
        type: 'dashboard',
        description: 'Comprehensive sales metrics and performance indicators',
        lastUpdated: new Date(),
        frequency: 'real-time',
        data: [
          { month: 'Jan', sales: 2400000, deals: 18, avgPrice: 133333 },
          { month: 'Feb', sales: 2800000, deals: 22, avgPrice: 127273 },
          { month: 'Mar', sales: 3200000, deals: 25, avgPrice: 128000 },
          { month: 'Apr', sales: 2900000, deals: 20, avgPrice: 145000 },
          { month: 'May', sales: 3500000, deals: 28, avgPrice: 125000 },
          { month: 'Jun', sales: 3800000, deals: 32, avgPrice: 118750 }
        ],
        metrics: [
          { id: 'm1', label: 'Total Sales', value: '$18.6M', change: 15.2, format: 'currency', trend: 'up' },
          { id: 'm2', label: 'Deals Closed', value: '145', change: 8.7, format: 'number', trend: 'up' },
          { id: 'm3', label: 'Avg Deal Size', value: '$128,276', change: -2.1, format: 'currency', trend: 'down' },
          { id: 'm4', label: 'Conversion Rate', value: '24.3%', change: 3.2, format: 'percentage', trend: 'up' }
        ]
      },
      {
        id: '2',
        name: 'Marketing ROI Analysis',
        category: 'marketing',
        type: 'chart',
        description: 'Marketing campaign performance and return on investment',
        lastUpdated: new Date(Date.now() - 3600000),
        frequency: 'daily',
        data: [
          { campaign: 'Google Ads', spent: 15000, leads: 120, conversions: 28, roi: 186 },
          { campaign: 'Facebook Ads', spent: 12000, leads: 95, conversions: 22, roi: 158 },
          { campaign: 'Email Marketing', spent: 3000, leads: 85, conversions: 35, roi: 412 },
          { campaign: 'SEO', spent: 8000, leads: 65, conversions: 18, roi: 225 },
          { campaign: 'Print Ads', spent: 5000, leads: 25, conversions: 5, roi: 100 }
        ],
        metrics: [
          { id: 'm5', label: 'Total Ad Spend', value: '$43,000', change: 12.5, format: 'currency', trend: 'up' },
          { id: 'm6', label: 'Total Leads', value: '390', change: 18.3, format: 'number', trend: 'up' },
          { id: 'm7', label: 'Conversion Rate', value: '27.7%', change: 5.1, format: 'percentage', trend: 'up' },
          { id: 'm8', label: 'Average ROI', value: '216%', change: 8.9, format: 'percentage', trend: 'up' }
        ]
      },
      {
        id: '3',
        name: 'Agent Performance Report',
        category: 'team',
        type: 'table',
        description: 'Individual agent performance metrics and rankings',
        lastUpdated: new Date(Date.now() - 7200000),
        frequency: 'weekly',
        data: [
          { agent: 'Sarah Wilson', deals: 12, volume: 1800000, commission: 54000, satisfaction: 4.8 },
          { agent: 'John Smith', deals: 10, volume: 1500000, commission: 45000, satisfaction: 4.6 },
          { agent: 'Mike Johnson', deals: 8, volume: 1200000, commission: 36000, satisfaction: 4.7 },
          { agent: 'Lisa Rodriguez', deals: 15, volume: 2100000, commission: 63000, satisfaction: 4.9 },
          { agent: 'David Chen', deals: 6, volume: 900000, commission: 27000, satisfaction: 4.5 }
        ],
        metrics: [
          { id: 'm9', label: 'Top Performer', value: 'Lisa Rodriguez', change: 0, format: 'text', trend: 'stable' },
          { id: 'm10', label: 'Avg Deals/Agent', value: '10.2', change: 15.7, format: 'number', trend: 'up' },
          { id: 'm11', label: 'Team Satisfaction', value: '4.7/5', change: 2.1, format: 'text', trend: 'up' },
          { id: 'm12', label: 'Total Commission', value: '$225,000', change: 22.3, format: 'currency', trend: 'up' }
        ]
      },
      {
        id: '4',
        name: 'Financial Summary',
        category: 'financial',
        type: 'dashboard',
        description: 'Revenue, expenses, and profitability analysis',
        lastUpdated: new Date(Date.now() - 1800000),
        frequency: 'daily',
        data: [
          { category: 'Commission Revenue', amount: 225000, percentage: 75 },
          { category: 'Property Management', amount: 45000, percentage: 15 },
          { category: 'Consultation Fees', amount: 18000, percentage: 6 },
          { category: 'Other Services', amount: 12000, percentage: 4 }
        ],
        metrics: [
          { id: 'm13', label: 'Total Revenue', value: '$300,000', change: 18.5, format: 'currency', trend: 'up' },
          { id: 'm14', label: 'Operating Expenses', value: '$125,000', change: 5.2, format: 'currency', trend: 'up' },
          { id: 'm15', label: 'Net Profit', value: '$175,000', change: 28.7, format: 'currency', trend: 'up' },
          { id: 'm16', label: 'Profit Margin', value: '58.3%', change: 6.1, format: 'percentage', trend: 'up' }
        ]
      }
    ];

    setReports(mockReports);
    setSelectedReport(mockReports[0]);
  }, []);

  const formatValue = (value: number | string, format: string) => {
    if (format === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (format === 'percentage' && typeof value === 'number') {
      return `${value}%`;
    }
    if (format === 'number' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US').format(value);
    }
    return value.toString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales': return DollarSign;
      case 'marketing': return Target;
      case 'financial': return BarChart3;
      case 'operational': return Settings;
      case 'team': return Users;
      default: return BarChart3;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

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
            Detailed Reports
          </button>
          <button
            onClick={() => setViewMode('custom')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'custom' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom Reports
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="team">Team</option>
          </select>
        </div>
      </div>

      {viewMode === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedReport?.metrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <div key={metric.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                    <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </div>
              );
            })}
          </div>

          {/* Main Chart */}
          {selectedReport && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedReport.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Last updated: {selectedReport.lastUpdated.toLocaleTimeString()}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedReport.frequency === 'real-time' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedReport.category === 'sales' ? (
                    <BarChart data={selectedReport.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'sales' ? `$${(value as number).toLocaleString()}` : value,
                        name === 'sales' ? 'Sales' : name === 'deals' ? 'Deals' : 'Avg Price'
                      ]} />
                      <Bar dataKey="sales" fill="#f59e0b" />
                    </BarChart>
                  ) : selectedReport.category === 'financial' ? (
                    <RechartsPieChart>
                      <Pie
                        data={selectedReport.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {selectedReport.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Amount']} />
                    </RechartsPieChart>
                  ) : (
                    <BarChart data={selectedReport.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={selectedReport.category === 'marketing' ? 'campaign' : 'agent'} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey={selectedReport.category === 'marketing' ? 'roi' : 'deals'} fill="#3b82f6" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const CategoryIcon = getCategoryIcon(report.category);
              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                    selectedReport?.id === report.id ? 'border-amber-500 ring-2 ring-amber-200' : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{report.category}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.frequency === 'real-time' ? 'bg-green-100 text-green-800' :
                      report.frequency === 'daily' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.frequency}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Updated: {report.lastUpdated.toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'detailed' && selectedReport && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.name}</h2>
            <p className="text-gray-600">{selectedReport.description}</p>
          </div>

          {selectedReport.category === 'team' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Agent</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Deals</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Commission</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.data.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.agent}</td>
                      <td className="text-right py-3 px-4">{row.deals}</td>
                      <td className="text-right py-3 px-4">${row.volume.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">${row.commission.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end space-x-1">
                          <span>{row.satisfaction}</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${
                                  i < Math.floor(row.satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReport.category === 'marketing' && (
            <div className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedReport.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="campaign" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="roi" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedReport.data.map((campaign, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">{campaign.campaign}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spent:</span>
                        <span className="font-medium">${campaign.spent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Leads:</span>
                        <span className="font-medium">{campaign.leads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conversions:</span>
                        <span className="font-medium">{campaign.conversions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROI:</span>
                        <span className={`font-medium ${campaign.roi > 150 ? 'text-green-600' : 'text-gray-900'}`}>
                          {campaign.roi}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'custom' && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
            <p className="text-gray-600 mb-6">
              Create custom reports with drag-and-drop interface, custom filters, and advanced analytics
            </p>
            <div className="bg-gray-100 rounded-lg p-8 mx-auto max-w-2xl">
              <div className="text-gray-500 text-sm mb-4">
                Custom report builder would include:
              </div>
              <ul className="text-left text-gray-600 text-sm space-y-2">
                <li>• Drag-and-drop field selection</li>
                <li>• Advanced filtering and grouping options</li>
                <li>• Multiple chart types and visualizations</li>
                <li>• Scheduled report generation and delivery</li>
                <li>• Export to PDF, Excel, and other formats</li>
                <li>• Sharing and collaboration features</li>
                <li>• Real-time data connections</li>
                <li>• Custom calculations and formulas</li>
              </ul>
            </div>
            <button className="mt-6 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
              Start Building Custom Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 