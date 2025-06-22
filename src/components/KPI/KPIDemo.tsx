import React, { useState, useEffect } from 'react';
import { KPIBuilder } from './KPIBuilder';
import { KPIDisplay } from './KPIDisplay';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Eye, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Award,
  DollarSign,
  Users,
  Home,
  Handshake,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Copy,
  X,
  Check,
  AlertCircle,
  LineChart,
  PieChart,
  Activity,
  Monitor,
  Maximize,
  Minimize
} from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  description: string;
  module: string;
  subModule?: string;
  dataSource: string;
  formula: string;
  visualType: 'card' | 'number' | 'trend' | 'progress-bar' | 'gauge' | 'line-chart' | 'bar-chart' | 'pie-chart';
  target?: number;
  targetType?: 'greater' | 'less' | 'equal';
  refreshRate: number; // in seconds
  currentValue: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface KPITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  kpiConfig: Partial<KPI>;
}

export function KPIDemo() {
  const { t } = useTranslation();
  const [activeDemo, setActiveDemo] = useState<'overview' | 'builder' | 'display' | 'manage' | 'templates'>('overview');
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [createdKPIs, setCreatedKPIs] = useState<KPI[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sample KPIs for demonstration
  const sampleKPIs: KPI[] = [
    {
      id: '1',
      name: 'Total Revenue',
      description: 'Total revenue generated this month',
      module: 'dashboard',
      dataSource: 'financial',
      formula: 'SUM(deals.value WHERE status=closed)',
      visualType: 'card',
      target: 500000,
      targetType: 'greater',
      refreshRate: 300,
      currentValue: 425000,
      previousValue: 380000,
      trend: 'up',
      unit: '$',
      color: 'green',
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'Emma Wilson'
    },
    {
      id: '2',
      name: 'Active Properties',
      description: 'Number of active property listings',
      module: 'properties',
      dataSource: 'properties',
      formula: 'COUNT(properties WHERE status=active)',
      visualType: 'number',
      target: 100,
      targetType: 'greater',
      refreshRate: 600,
      currentValue: 87,
      previousValue: 92,
      trend: 'down',
      unit: '',
      color: 'blue',
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      createdBy: 'Emma Wilson'
    },
    {
      id: '3',
      name: 'Conversion Rate',
      description: 'Lead to deal conversion percentage',
      module: 'deals',
      dataSource: 'leads',
      formula: '(COUNT(deals)/COUNT(leads))*100',
      visualType: 'gauge',
      target: 25,
      targetType: 'greater',
      refreshRate: 900,
      currentValue: 18.5,
      previousValue: 16.2,
      trend: 'up',
      unit: '%',
      color: 'purple',
      isActive: true,
      createdAt: '2024-01-16',
      updatedAt: '2024-01-20',
      createdBy: 'Mike Chen'
    }
  ];

  const kpiTemplates: KPITemplate[] = [
    {
      id: 'template-1',
      name: 'Sales Performance',
      description: 'Track monthly sales performance',
      category: 'Sales',
      kpiConfig: {
        visualType: 'card',
        unit: '$',
        color: 'green',
        refreshRate: 300
      }
    },
    {
      id: 'template-2',
      name: 'Property Inventory',
      description: 'Monitor property listing counts',
      category: 'Properties',
      kpiConfig: {
        visualType: 'number',
        unit: '',
        color: 'blue',
        refreshRate: 600
      }
    },
    {
      id: 'template-3',
      name: 'Lead Conversion',
      description: 'Track lead to deal conversion rates',
      category: 'Marketing',
      kpiConfig: {
        visualType: 'gauge',
        unit: '%',
        color: 'purple',
        refreshRate: 900
      }
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    if (createdKPIs.length === 0) {
      setCreatedKPIs(sampleKPIs);
    }
  }, []);

  // Live demo simulation
  useEffect(() => {
    if (isLiveDemo) {
      const interval = setInterval(() => {
        setCreatedKPIs(prev => prev.map(kpi => ({
          ...kpi,
          previousValue: kpi.currentValue,
          currentValue: kpi.currentValue + (Math.random() - 0.5) * (kpi.currentValue * 0.1),
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'neutral',
          updatedAt: new Date().toISOString()
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLiveDemo]);

  const visualTypes = [
    {
      id: 'card',
      name: 'Metric Card',
      icon: BarChart3,
      description: 'Clean card with value and trend',
      preview: '📊 $125K ↗️ 12%'
    },
    {
      id: 'number',
      name: 'Big Number',
      icon: Target,
      description: 'Large prominent number display',
      preview: '🎯 247'
    },
    {
      id: 'trend',
      name: 'Trend Indicator',
      icon: TrendingUp,
      description: 'Value with trend comparison',
      preview: '📈 $89K vs $76K'
    },
    {
      id: 'progress-bar',
      name: 'Progress Bar',
      icon: Target,
      description: 'Progress towards target',
      preview: '▓▓▓▓▓░░░ 65%'
    },
    {
      id: 'gauge',
      name: 'Gauge Chart',
      icon: Target,
      description: 'Circular progress indicator',
      preview: '🌡️ 78% of target'
    },
    {
      id: 'line-chart',
      name: 'Line Chart',
      icon: TrendingUp,
      description: 'Time series visualization',
      preview: '📈 Trend over time'
    },
    {
      id: 'bar-chart',
      name: 'Bar Chart',
      icon: BarChart3,
      description: 'Categorical comparison',
      preview: '📊 Monthly comparison'
    },
    {
      id: 'pie-chart',
      name: 'Pie Chart',
      icon: PieChart,
      description: 'Part-to-whole relationships',
      preview: '🥧 Distribution view'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Dynamic Creation',
      description: 'Create custom KPIs with drag-and-drop interface'
    },
    {
      icon: Target,
      title: 'Multiple Visualizations',
      description: '8 different chart types and display options'
    },
    {
      icon: Settings,
      title: 'Module Integration',
      description: 'Place KPIs in any module or sub-module'
    },
    {
      icon: BarChart3,
      title: 'Real-time Data',
      description: 'Live updates with configurable refresh rates'
    },
    {
      icon: Users,
      title: 'Role-based Access',
      description: 'Control who can create and view KPIs'
    },
    {
      icon: Award,
      title: 'Target Tracking',
      description: 'Set goals and track progress automatically'
    }
  ];

  const handleCreateKPI = (kpiData: Partial<KPI>) => {
    const newKPI: KPI = {
      id: Date.now().toString(),
      name: kpiData.name || 'New KPI',
      description: kpiData.description || '',
      module: kpiData.module || 'dashboard',
      subModule: kpiData.subModule,
      dataSource: kpiData.dataSource || 'manual',
      formula: kpiData.formula || '',
      visualType: kpiData.visualType || 'card',
      target: kpiData.target,
      targetType: kpiData.targetType || 'greater',
      refreshRate: kpiData.refreshRate || 300,
      currentValue: kpiData.currentValue || 0,
      previousValue: kpiData.previousValue,
      trend: kpiData.trend || 'neutral',
      unit: kpiData.unit || '',
      color: kpiData.color || 'blue',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    setCreatedKPIs([...createdKPIs, newKPI]);
    setShowCreateModal(false);
  };

  const handleEditKPI = (updatedKPI: KPI) => {
    setCreatedKPIs(createdKPIs.map(kpi => 
      kpi.id === updatedKPI.id ? { ...updatedKPI, updatedAt: new Date().toISOString() } : kpi
    ));
    setShowEditModal(false);
    setSelectedKPI(null);
  };

  const handleDeleteKPI = (kpiId: string) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      setCreatedKPIs(createdKPIs.filter(kpi => kpi.id !== kpiId));
    }
  };

  const handleToggleKPI = (kpiId: string) => {
    setCreatedKPIs(createdKPIs.map(kpi => 
      kpi.id === kpiId ? { ...kpi, isActive: !kpi.isActive } : kpi
    ));
  };

  const handleExportKPIs = () => {
    const dataStr = JSON.stringify(createdKPIs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `kpis-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportKPIs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedKPIs = JSON.parse(e.target?.result as string);
          setCreatedKPIs([...createdKPIs, ...importedKPIs]);
          // Success: KPIs imported successfully!
        } catch (error) {
          // Success: Error importing KPIs. Please check the file format.
        }
      };
      reader.readAsText(file);
    }
  };

  const renderKPICard = (kpi: KPI) => {
    const formatValue = (value: number) => {
      if (kpi.unit === '$') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
}).format(value);
      }
      return value.toFixed(1) + kpi.unit;
    };

    const getTrendIcon = () => {
      switch (kpi.trend) {
        case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
        case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
        default: return <Activity className="w-4 h-4 text-gray-500" />;
      }
    };

    const getProgressPercentage = () => {
      if (!kpi.target) return 0;
      return Math.min((kpi.currentValue / kpi.target) * 100, 100);
    };

    return (
      <div key={kpi.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
              kpi.color === 'green' ? 'from-green-500 to-emerald-600' :
              kpi.color === 'blue' ? 'from-blue-500 to-cyan-600' :
              kpi.color === 'purple' ? 'from-purple-500 to-violet-600' :
              'from-gray-500 to-gray-600'
            } flex items-center justify-center`}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
              <p className="text-sm text-gray-600">{kpi.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className={`px-2 py-1 rounded-full text-xs ${kpi.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {kpi.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatValue(kpi.currentValue)}
          </div>
          {kpi.previousValue && (
            <div className="text-sm text-gray-600">
              vs {formatValue(kpi.previousValue)} last period
            </div>
          )}
        </div>

        {kpi.target && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Target</span>
              <span>{getProgressPercentage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${
                  kpi.color === 'green' ? 'from-green-500 to-emerald-600' :
                  kpi.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                  kpi.color === 'purple' ? 'from-purple-500 to-violet-600' :
                  'from-gray-500 to-gray-600'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Updated: {new Date(kpi.updatedAt).toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToggleKPI(kpi.id)}
              className={`p-2 rounded-lg transition-colors ${
                kpi.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {kpi.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setSelectedKPI(kpi);
                setShowEditModal(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteKPI(kpi.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'p-8'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KPI System</h1>
            <p className="text-gray-600">Create, manage, and monitor Key Performance Indicators</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Live Demo Toggle */}
            <button
              onClick={() => setIsLiveDemo(!isLiveDemo)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isLiveDemo 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isLiveDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLiveDemo ? 'Stop Demo' : 'Start Demo'}</span>
            </button>

            {/* Preview Mode Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                isPreviewMode 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreviewMode ? 'Exit Preview' : 'Preview Mode'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            {/* Export/Import */}
            <button
              onClick={handleExportKPIs}
              className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <label className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportKPIs} className="hidden" />
            </label>

            {/* Create KPI Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create KPI</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'display', label: 'Live Display', icon: BarChart3 },
            { id: 'manage', label: 'Manage KPIs', icon: Settings },
            { id: 'templates', label: 'Templates', icon: Copy }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDemo(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeDemo === tab.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeDemo === 'overview' && (
        <div className="space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8" />
                <span className="text-2xl font-bold">{createdKPIs.length}</span>
              </div>
              <h3 className="text-lg font-semibold">Total KPIs</h3>
              <p className="text-blue-100">Created and configured</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8" />
                <span className="text-2xl font-bold">{createdKPIs.filter(k => k.isActive).length}</span>
              </div>
              <h3 className="text-lg font-semibold">Active KPIs</h3>
              <p className="text-green-100">Currently monitoring</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8" />
                <span className="text-2xl font-bold">{demoModules.length}</span>
              </div>
              <h3 className="text-lg font-semibold">Modules</h3>
              <p className="text-purple-100">With KPI integration</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8" />
                <span className="text-2xl font-bold">{visualTypes.length}</span>
              </div>
              <h3 className="text-lg font-semibold">Visual Types</h3>
              <p className="text-amber-100">Available options</p>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Integration */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {demoModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div key={module.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-gray-600" />
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {module.kpiCount} KPIs
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visualization Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visualization Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visualTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-sm text-gray-600">{type.preview}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'display' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Live KPI Display</h2>
              <p className="text-gray-600">Real-time monitoring of your key performance indicators</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLiveDemo && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Updates Active</span>
                </div>
              )}
              {isPreviewMode && (
                <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Preview Mode</span>
                </div>
              )}
            </div>
          </div>

          {createdKPIs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdKPIs.filter(kpi => kpi.isActive).map(renderKPICard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No KPIs Created</h3>
              <p className="text-gray-600 mb-6">Create your first KPI to start monitoring your performance</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Create Your First KPI
              </button>
            </div>
          )}
        </div>
      )}

      {activeDemo === 'manage' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manage KPIs</h2>
              <p className="text-gray-600">Edit, configure, and organize your KPIs</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create KPI</span>
              </button>
            </div>
          </div>

          {createdKPIs.length > 0 ? (
            <div className="space-y-6">
              {createdKPIs.map(renderKPICard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No KPIs to Manage</h3>
              <p className="text-gray-600 mb-6">Create your first KPI to start managing your performance metrics</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Create Your First KPI
              </button>
            </div>
          )}
        </div>
      )}

      {activeDemo === 'templates' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">KPI Templates</h2>
              <p className="text-gray-600">Pre-built templates to get you started quickly</p>
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Copy className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {template.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Visual: {template.kpiConfig.visualType}
                  </div>
                  <button
                    onClick={() => {
                      const templateKPI = {
                        ...template.kpiConfig,
                        name: template.name,
                        description: template.description
                      };
                      handleCreateKPI(templateKPI);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

             {/* Create KPI Modal */}
       {showCreateModal && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex min-h-full items-center justify-center p-4">
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
             <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-semibold text-gray-900">Create New KPI</h3>
                 <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                   <X className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">KPI Name *</label>
                     <input
                       type="text"
                       placeholder="e.g., Monthly Revenue"
                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Module *</label>
                     <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                       <option>Dashboard</option>
                       <option>Properties</option>
                       <option>Deals</option>
                       <option>Financial</option>
                     </select>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                   <textarea
                     rows={3}
                     placeholder="Describe what this KPI measures..."
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Visual Type</label>
                     <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                       <option>Card</option>
                       <option>Number</option>
                       <option>Gauge</option>
                       <option>Line Chart</option>
                       <option>Bar Chart</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                     <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                       <option value="$">Currency ($)</option>
                       <option value="%">Percentage (%)</option>
                       <option value="">Number</option>
                       <option value=" days">Days</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                     <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                       <option value="green">Green</option>
                       <option value="blue">Blue</option>
                       <option value="purple">Purple</option>
                       <option value="amber">Amber</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Target Value (Optional)</label>
                     <input
                       type="number"
                       placeholder="e.g., 100000"
                       className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Rate (seconds)</label>
                     <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                       <option value="300">5 minutes</option>
                       <option value="600">10 minutes</option>
                       <option value="900">15 minutes</option>
                       <option value="1800">30 minutes</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="flex space-x-3 pt-6 border-t border-gray-200">
                   <button
                     onClick={() => setShowCreateModal(false)}
                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={() => {
                       // Simple KPI creation with mock data
                       const mockKPI = {
                         name: 'Sample KPI',
                         description: 'Sample description',
                         module: 'dashboard',
                         visualType: 'card' as const,
                         unit: '$',
                         color: 'blue',
                         currentValue: Math.floor(Math.random() * 100000),
                         target: 100000
                       };
                       handleCreateKPI(mockKPI);
                     }}
                     className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                   >
                     Create KPI
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit KPI Modal */}
       {showEditModal && selectedKPI && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex min-h-full items-center justify-center p-4">
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
             <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-semibold text-gray-900">Edit KPI: {selectedKPI.name}</h3>
                 <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                   <X className="w-6 h-6" />
                 </button>
               </div>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Current Value</label>
                   <input
                     type="number"
                     defaultValue={selectedKPI.currentValue}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                   <input
                     type="number"
                     defaultValue={selectedKPI.target}
                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                   <select defaultValue={selectedKPI.isActive ? 'active' : 'inactive'} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>
                   </select>
                 </div>
                 
                 <div className="flex space-x-3 pt-6 border-t border-gray-200">
                   <button
                     onClick={() => setShowEditModal(false)}
                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={() => {
                       const updatedKPI = {
                         ...selectedKPI,
                         updatedAt: new Date().toISOString()
                       };
                       handleEditKPI(updatedKPI);
                     }}
                     className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all"
                   >
                     Save Changes
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
} 