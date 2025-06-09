import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  Target,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  Database,
  Filter,
  Search,
  Copy,
  Download,
  Upload,
  Zap,
  Calendar,
  DollarSign,
  Users,
  Home,
  Handshake,
  FileText,
  Mail,
  Calculator,
  Camera,
  Shield,
  Clock,
  Award,
  MapPin,
  Smartphone
} from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'financial' | 'operational' | 'team' | 'property';
  module: string;
  subModule?: string;
  visualType: 'card' | 'line-chart' | 'bar-chart' | 'pie-chart' | 'donut-chart' | 'gauge' | 'progress-bar' | 'number' | 'trend';
  dataSource: string;
  calculation: 'sum' | 'average' | 'count' | 'percentage' | 'ratio' | 'custom';
  customFormula?: string;
  filters: KPIFilter[];
  timeframe: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  target?: number;
  unit: 'currency' | 'percentage' | 'number' | 'days' | 'hours';
  color: string;
  size: 'small' | 'medium' | 'large';
  position: {
    module: string;
    subModule?: string;
    order: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface KPIFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
}

interface ModuleOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  subModules: SubModuleOption[];
}

interface SubModuleOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

export function KPIBuilder() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingKPI, setEditingKPI] = useState<Partial<KPI>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewMode, setPreviewMode] = useState(false);

  // Available modules and sub-modules
  const moduleOptions: ModuleOption[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      subModules: [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'analytics', name: 'Analytics', icon: TrendingUp },
        { id: 'quick-stats', name: 'Quick Stats', icon: Zap }
      ]
    },
    {
      id: 'properties',
      name: 'Properties',
      icon: Home,
      subModules: [
        { id: 'listings', name: 'Active Listings', icon: Home },
        { id: 'sold', name: 'Sold Properties', icon: Award },
        { id: 'pending', name: 'Pending Sales', icon: Clock }
      ]
    },
    {
      id: 'contacts',
      name: 'Contacts',
      icon: Users,
      subModules: [
        { id: 'clients', name: 'Clients', icon: Users },
        { id: 'prospects', name: 'Prospects', icon: Target },
        { id: 'vendors', name: 'Vendors', icon: Handshake }
      ]
    },
    {
      id: 'deals',
      name: 'Deals',
      icon: Handshake,
      subModules: [
        { id: 'active', name: 'Active Deals', icon: Handshake },
        { id: 'pipeline', name: 'Pipeline', icon: TrendingUp },
        { id: 'closed', name: 'Closed Deals', icon: Award }
      ]
    },
    {
      id: 'leads',
      name: 'Lead Management',
      icon: Target,
      subModules: [
        { id: 'new-leads', name: 'New Leads', icon: Plus },
        { id: 'qualified', name: 'Qualified', icon: Award },
        { id: 'follow-up', name: 'Follow-up', icon: Clock }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Mail,
      subModules: [
        { id: 'campaigns', name: 'Campaigns', icon: Mail },
        { id: 'social', name: 'Social Media', icon: Users },
        { id: 'analytics', name: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: DollarSign,
      subModules: [
        { id: 'revenue', name: 'Revenue', icon: DollarSign },
        { id: 'expenses', name: 'Expenses', icon: FileText },
        { id: 'commissions', name: 'Commissions', icon: Award }
      ]
    },
    {
      id: 'team',
      name: 'Team',
      icon: Users,
      subModules: [
        { id: 'performance', name: 'Performance', icon: TrendingUp },
        { id: 'collaboration', name: 'Collaboration', icon: Users },
        { id: 'tasks', name: 'Tasks', icon: Clock }
      ]
    }
  ];

  // Visual representation options
  const visualTypes = [
    { id: 'card', name: 'Metric Card', icon: BarChart3, description: 'Simple number display with trend' },
    { id: 'line-chart', name: 'Line Chart', icon: TrendingUp, description: 'Time series data visualization' },
    { id: 'bar-chart', name: 'Bar Chart', icon: BarChart3, description: 'Categorical data comparison' },
    { id: 'pie-chart', name: 'Pie Chart', icon: PieChart, description: 'Part-to-whole relationships' },
    { id: 'donut-chart', name: 'Donut Chart', icon: PieChart, description: 'Modern pie chart variant' },
    { id: 'gauge', name: 'Gauge Chart', icon: Target, description: 'Progress towards target' },
    { id: 'progress-bar', name: 'Progress Bar', icon: Activity, description: 'Linear progress indicator' },
    { id: 'number', name: 'Big Number', icon: Calculator, description: 'Large number display' },
    { id: 'trend', name: 'Trend Indicator', icon: TrendingUp, description: 'Up/down trend with percentage' }
  ];

  // Data source options
  const dataSourceOptions = [
    { id: 'properties', name: 'Properties Data', fields: ['price', 'status', 'type', 'bedrooms', 'bathrooms', 'sqft'] },
    { id: 'contacts', name: 'Contacts Data', fields: ['type', 'status', 'source', 'created_date', 'last_contact'] },
    { id: 'deals', name: 'Deals Data', fields: ['value', 'stage', 'type', 'commission', 'close_date'] },
    { id: 'leads', name: 'Leads Data', fields: ['source', 'status', 'score', 'conversion_date', 'value'] },
    { id: 'marketing', name: 'Marketing Data', fields: ['campaign_type', 'spend', 'impressions', 'clicks', 'conversions'] },
    { id: 'financial', name: 'Financial Data', fields: ['revenue', 'expenses', 'profit', 'commission', 'date'] },
    { id: 'team', name: 'Team Data', fields: ['agent_id', 'deals_closed', 'revenue_generated', 'performance_score'] }
  ];

  useEffect(() => {
    // Load existing KPIs from localStorage or API
    const savedKPIs = localStorage.getItem('creo-kpis');
    if (savedKPIs) {
      setKpis(JSON.parse(savedKPIs));
    } else {
      // Initialize with some default KPIs
      const defaultKPIs: KPI[] = [
        {
          id: '1',
          name: 'Total Revenue',
          description: 'Total revenue generated this month',
          category: 'financial',
          module: 'dashboard',
          subModule: 'overview',
          visualType: 'card',
          dataSource: 'financial',
          calculation: 'sum',
          filters: [],
          timeframe: 'monthly',
          target: 100000,
          unit: 'currency',
          color: '#10b981',
          size: 'medium',
          position: { module: 'dashboard', subModule: 'overview', order: 1 },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'Admin'
        },
        {
          id: '2',
          name: 'Active Listings',
          description: 'Number of active property listings',
          category: 'property',
          module: 'properties',
          subModule: 'listings',
          visualType: 'number',
          dataSource: 'properties',
          calculation: 'count',
          filters: [{ field: 'status', operator: 'equals', value: 'active' }],
          timeframe: 'real-time',
          unit: 'number',
          color: '#3b82f6',
          size: 'small',
          position: { module: 'properties', subModule: 'listings', order: 1 },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'Admin'
        }
      ];
      setKpis(defaultKPIs);
    }
  }, []);

  const saveKPIs = (updatedKPIs: KPI[]) => {
    setKpis(updatedKPIs);
    localStorage.setItem('creo-kpis', JSON.stringify(updatedKPIs));
  };

  const handleCreateKPI = () => {
    setEditingKPI({
      name: '',
      description: '',
      category: 'sales',
      module: 'dashboard',
      visualType: 'card',
      dataSource: 'properties',
      calculation: 'count',
      filters: [],
      timeframe: 'monthly',
      unit: 'number',
      color: '#3b82f6',
      size: 'medium',
      position: { module: 'dashboard', order: 1 },
      isActive: true
    });
    setShowBuilder(true);
  };

  const handleEditKPI = (kpi: KPI) => {
    setEditingKPI(kpi);
    setShowBuilder(true);
  };

  const handleSaveKPI = () => {
    if (!editingKPI.name || !editingKPI.module) return;

    const kpiData: KPI = {
      id: editingKPI.id || Date.now().toString(),
      name: editingKPI.name!,
      description: editingKPI.description || '',
      category: editingKPI.category!,
      module: editingKPI.module!,
      subModule: editingKPI.subModule,
      visualType: editingKPI.visualType!,
      dataSource: editingKPI.dataSource!,
      calculation: editingKPI.calculation!,
      customFormula: editingKPI.customFormula,
      filters: editingKPI.filters || [],
      timeframe: editingKPI.timeframe!,
      target: editingKPI.target,
      unit: editingKPI.unit!,
      color: editingKPI.color!,
      size: editingKPI.size!,
      position: editingKPI.position!,
      isActive: editingKPI.isActive !== false,
      createdAt: editingKPI.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: editingKPI.createdBy || 'Current User'
    };

    const updatedKPIs = editingKPI.id 
      ? kpis.map(k => k.id === editingKPI.id ? kpiData : k)
      : [...kpis, kpiData];

    saveKPIs(updatedKPIs);
    setShowBuilder(false);
    setEditingKPI({});
  };

  const handleDeleteKPI = (id: string) => {
    const updatedKPIs = kpis.filter(k => k.id !== id);
    saveKPIs(updatedKPIs);
  };

  const handleToggleKPI = (id: string) => {
    const updatedKPIs = kpis.map(k => 
      k.id === id ? { ...k, isActive: !k.isActive } : k
    );
    saveKPIs(updatedKPIs);
  };

  const filteredKPIs = kpis.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || kpi.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getModuleIcon = (moduleId: string) => {
    const module = moduleOptions.find(m => m.id === moduleId);
    return module?.icon || Home;
  };

  const getVisualTypeIcon = (visualType: string) => {
    const visual = visualTypes.find(v => v.id === visualType);
    return visual?.icon || BarChart3;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KPI Builder & Management</h1>
            <p className="text-gray-600">Create and manage custom KPIs with visual representations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                previewMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview Mode</span>
            </button>
            <button
              onClick={handleCreateKPI}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create KPI</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search KPIs..."
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
            <option value="property">Property</option>
          </select>
        </div>
      </div>

      {/* KPI List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredKPIs.map((kpi) => {
          const ModuleIcon = getModuleIcon(kpi.module);
          const VisualIcon = getVisualTypeIcon(kpi.visualType);
          
          return (
            <div
              key={kpi.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
                kpi.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ModuleIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                    <p className="text-sm text-gray-600">{kpi.module}{kpi.subModule && ` > ${kpi.subModule}`}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleKPI(kpi.id)}
                    className={`p-1 rounded transition-colors ${
                      kpi.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditKPI(kpi)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteKPI(kpi.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{kpi.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Visual Type:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <VisualIcon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium capitalize">{kpi.visualType.replace('-', ' ')}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Data Source:</span>
                  <div className="font-medium mt-1 capitalize">{kpi.dataSource}</div>
                </div>
                <div>
                  <span className="text-gray-600">Calculation:</span>
                  <div className="font-medium mt-1 capitalize">{kpi.calculation}</div>
                </div>
                <div>
                  <span className="text-gray-600">Timeframe:</span>
                  <div className="font-medium mt-1 capitalize">{kpi.timeframe.replace('-', ' ')}</div>
                </div>
              </div>

              {kpi.target && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">
                      {kpi.unit === 'currency' ? '$' : ''}{kpi.target.toLocaleString()}
                      {kpi.unit === 'percentage' ? '%' : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: kpi.color }}
                />
                <span className="text-xs text-gray-500 capitalize">{kpi.category}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500 capitalize">{kpi.size}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingKPI.id ? 'Edit KPI' : 'Create New KPI'}
                </h2>
                <button
                  onClick={() => setShowBuilder(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">KPI Name</label>
                        <input
                          type="text"
                          value={editingKPI.name || ''}
                          onChange={(e) => setEditingKPI({ ...editingKPI, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          placeholder="Enter KPI name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={editingKPI.description || ''}
                          onChange={(e) => setEditingKPI({ ...editingKPI, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          rows={3}
                          placeholder="Describe what this KPI measures"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={editingKPI.category || 'sales'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, category: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="sales">Sales</option>
                            <option value="marketing">Marketing</option>
                            <option value="financial">Financial</option>
                            <option value="operational">Operational</option>
                            <option value="team">Team</option>
                            <option value="property">Property</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                          <select
                            value={editingKPI.size || 'medium'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, size: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module & Position */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Module & Position</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Module</label>
                        <select
                          value={editingKPI.module || 'dashboard'}
                          onChange={(e) => {
                            setEditingKPI({ 
                              ...editingKPI, 
                              module: e.target.value,
                              subModule: undefined,
                              position: { ...editingKPI.position, module: e.target.value }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          {moduleOptions.map(module => (
                            <option key={module.id} value={module.id}>{module.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Module (Optional)</label>
                        <select
                          value={editingKPI.subModule || ''}
                          onChange={(e) => {
                            setEditingKPI({ 
                              ...editingKPI, 
                              subModule: e.target.value || undefined,
                              position: { ...editingKPI.position, subModule: e.target.value || undefined }
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select sub-module</option>
                          {moduleOptions
                            .find(m => m.id === editingKPI.module)?.subModules
                            .map(subModule => (
                              <option key={subModule.id} value={subModule.id}>{subModule.name}</option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                        <input
                          type="number"
                          value={editingKPI.position?.order || 1}
                          onChange={(e) => setEditingKPI({ 
                            ...editingKPI, 
                            position: { ...editingKPI.position, order: parseInt(e.target.value) || 1 }
                          })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual & Data Configuration */}
                <div className="space-y-6">
                  {/* Visual Type */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Representation</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {visualTypes.map(visual => {
                        const Icon = visual.icon;
                        return (
                          <button
                            key={visual.id}
                            onClick={() => setEditingKPI({ ...editingKPI, visualType: visual.id as any })}
                            className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                              editingKPI.visualType === visual.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-sm">{visual.name}</span>
                            </div>
                            <p className="text-xs text-gray-500">{visual.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Data Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Source</label>
                        <select
                          value={editingKPI.dataSource || 'properties'}
                          onChange={(e) => setEditingKPI({ ...editingKPI, dataSource: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          {dataSourceOptions.map(source => (
                            <option key={source.id} value={source.id}>{source.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Calculation</label>
                          <select
                            value={editingKPI.calculation || 'count'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, calculation: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="sum">Sum</option>
                            <option value="average">Average</option>
                            <option value="count">Count</option>
                            <option value="percentage">Percentage</option>
                            <option value="ratio">Ratio</option>
                            <option value="custom">Custom Formula</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                          <select
                            value={editingKPI.unit || 'number'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, unit: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="number">Number</option>
                            <option value="currency">Currency</option>
                            <option value="percentage">Percentage</option>
                            <option value="days">Days</option>
                            <option value="hours">Hours</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                          <select
                            value={editingKPI.timeframe || 'monthly'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, timeframe: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="real-time">Real-time</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target (Optional)</label>
                          <input
                            type="number"
                            value={editingKPI.target || ''}
                            onChange={(e) => setEditingKPI({ ...editingKPI, target: parseFloat(e.target.value) || undefined })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="Set target value"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={editingKPI.color || '#3b82f6'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, color: e.target.value })}
                            className="w-12 h-10 border border-gray-200 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingKPI.color || '#3b82f6'}
                            onChange={(e) => setEditingKPI({ ...editingKPI, color: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBuilder(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKPI}
                  className="flex items-center space-x-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingKPI.id ? 'Update KPI' : 'Create KPI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredKPIs.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No KPIs Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first KPI to get started with custom analytics'
            }
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={handleCreateKPI}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First KPI</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}