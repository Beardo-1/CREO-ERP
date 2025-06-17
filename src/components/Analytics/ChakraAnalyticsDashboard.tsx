import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Award, 
  MapPin, 
  Zap,
  Search,
  Filter,
  Download
} from 'lucide-react';

// Sample data for charts
const salesData = [
  { month: 'Jan', sales: 1200000, leads: 45, conversions: 12 },
  { month: 'Feb', sales: 1500000, leads: 52, conversions: 15 },
  { month: 'Mar', sales: 1800000, leads: 60, conversions: 18 },
  { month: 'Apr', sales: 1600000, leads: 55, conversions: 16 },
  { month: 'May', sales: 2000000, leads: 65, conversions: 20 },
  { month: 'Jun', sales: 2200000, leads: 70, conversions: 22 },
];

const propertyTypeData = [
  { name: 'Residential', value: 45, color: '#F59E0B' },
  { name: 'Commercial', value: 25, color: '#EA580C' },
  { name: 'Luxury', value: 20, color: '#EAB308' },
  { name: 'Investment', value: 10, color: '#FB923C' },
];

const COLORS = ['#F59E0B', '#EA580C', '#EAB308', '#FB923C'];

const agentPerformanceData = [
  { name: 'Emma Wilson', sales: 2500000, deals: 15, rating: 4.8 },
  { name: 'John Smith', sales: 1800000, deals: 12, rating: 4.5 },
  { name: 'Sarah Johnson', sales: 2200000, deals: 14, rating: 4.7 },
  { name: 'Michael Brown', sales: 1500000, deals: 10, rating: 4.3 },
];

const recentActivities = [
  { action: 'New property listed', property: '123 Oak Street', time: '2 minutes ago', type: 'listing' },
  { action: 'Deal closed', property: '456 Pine Avenue', time: '15 minutes ago', type: 'sale' },
  { action: 'Client meeting scheduled', property: '789 Maple Drive', time: '1 hour ago', type: 'meeting' },
  { action: 'Property viewed', property: '321 Elm Street', time: '2 hours ago', type: 'viewing' },
];

const ChakraAnalyticsDashboard: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const MetricCard = ({ title, value, change, icon: IconComponent, trend, colorScheme }: any) => (
    <div className="bg-white shadow-xl rounded-3xl p-8 border border-amber-200/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200">
          <IconComponent className="w-8 h-8 text-amber-600" />
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
          trend === 'up' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-6 mb-8">
            <div className="p-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl shadow-2xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Chakra UI-Inspired Analytics
              </h1>
              <p className="text-gray-600">
                Modern, accessible analytics dashboard with Chakra UI design principles
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search analytics..." 
                  className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent w-80 transition-all"
                />
              </div>
              <select className="px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all">
                <option>All Time</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics - Chakra UI SimpleGrid equivalent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <MetricCard
            title="Total Sales"
            value="$10.3M"
            change="12%"
            icon={DollarSign}
            trend="up"
            colorScheme="amber"
          />
          <MetricCard
            title="Active Deals"
            value="89"
            change="8%"
            icon={Users}
            trend="up"
            colorScheme="blue"
          />
          <MetricCard
            title="Conversion Rate"
            value="24.5%"
            change="3%"
            icon={Target}
            trend="up"
            colorScheme="green"
          />
          <MetricCard
            title="Avg. Deal Size"
            value="$115,730"
            change="2%"
            icon={Award}
            trend="down"
            colorScheme="purple"
          />
        </div>

        {/* Charts Grid - Chakra UI Grid equivalent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200/30">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
                  <p className="text-sm text-gray-600">Monthly performance overview</p>
                </div>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#F59E0B" 
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                      strokeWidth={3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Property Distribution */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200/30 h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Property Types</h3>
                  <p className="text-sm text-gray-600">Distribution overview</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-6">
                {propertyTypeData.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Chakra UI Grid equivalent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Agents - Chakra UI VStack equivalent */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200/30">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
                  <p className="text-sm text-gray-600">Agent performance this month</p>
                </div>
              </div>
              <div className="space-y-6">
                {agentPerformanceData.map((agent, index) => (
                  <div key={agent.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {/* Chakra UI Avatar equivalent */}
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-600">{agent.deals} deals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(agent.sales)}</p>
                        <div className="flex items-center space-x-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                    {/* Chakra UI Progress equivalent */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(agent.sales / 2500000) * 100}%` }}
                      />
                    </div>
                    {index < agentPerformanceData.length - 1 && (
                      <div className="border-b border-gray-200 mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-amber-200/30">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest updates and actions</p>
                </div>
              </div>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex items-start space-x-4 flex-1">
                      <div 
                        className={`w-3 h-3 rounded-full mt-2 ${
                          activity.type === 'sale' ? 'bg-green-500' :
                          activity.type === 'listing' ? 'bg-blue-500' :
                          activity.type === 'meeting' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.property}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chakra UI Benefits Showcase */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Chakra UI Design Principles Demonstrated</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Accessibility First</h3>
                <p className="text-sm text-white/90">WCAG compliant components with keyboard navigation and screen reader support</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Design System</h3>
                <p className="text-sm text-white/90">Consistent spacing, colors, and typography across all components</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Developer Experience</h3>
                <p className="text-sm text-white/90">Simple, intuitive API with excellent TypeScript support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChakraAnalyticsDashboard; 