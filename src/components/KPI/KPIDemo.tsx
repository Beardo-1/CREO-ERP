import React, { useState } from 'react';
import { KPIBuilder } from './KPIBuilder';
import { KPIDisplay } from './KPIDisplay';
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
  Handshake
} from 'lucide-react';

export function KPIDemo() {
  const [activeDemo, setActiveDemo] = useState<'builder' | 'display' | 'overview'>('overview');
  const [isLiveDemo, setIsLiveDemo] = useState(false);

  const demoModules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      description: 'Main overview with key metrics',
      kpiCount: 2
    },
    {
      id: 'properties',
      name: 'Properties',
      icon: Home,
      description: 'Property portfolio metrics',
      kpiCount: 1
    },
    {
      id: 'deals',
      name: 'Deals',
      icon: Handshake,
      description: 'Sales pipeline tracking',
      kpiCount: 0
    },
    {
      id: 'financial',
      name: 'Financial',
      icon: DollarSign,
      description: 'Revenue and expense tracking',
      kpiCount: 0
    }
  ];

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
      icon: Target,
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
      description: '9 different chart types and display options'
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

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KPI System Demo</h1>
            <p className="text-gray-600">Interactive demonstration of the custom KPI builder and display system</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live Demo</span>
            </div>
            <button
              onClick={() => setIsLiveDemo(!isLiveDemo)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                isLiveDemo ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isLiveDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLiveDemo ? 'Pause' : 'Start'} Demo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'builder', label: 'KPI Builder', icon: Settings },
            { id: 'display', label: 'Live Display', icon: BarChart3 }
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

      {/* Content */}
      {activeDemo === 'overview' && (
        <div className="space-y-8">
          {/* Features Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Visualizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visualTypes.map((visual) => {
                const Icon = visual.icon;
                return (
                  <div key={visual.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-105">
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className="w-4 h-4 text-amber-600" />
                      <h3 className="font-semibold text-gray-900 text-sm">{visual.name}</h3>
                    </div>
                    <p className="text-gray-600 text-xs mb-3">{visual.description}</p>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <span className="text-xs text-gray-500">{visual.preview}</span>
                    </div>
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
                  <div key={module.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.name}</h3>
                        <p className="text-xs text-gray-500">{module.kpiCount} KPIs configured</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        module.kpiCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {module.kpiCount > 0 ? 'Active' : 'Available'}
                      </span>
                      <button
                        onClick={() => setActiveDemo('display')}
                        className="text-amber-600 hover:text-amber-700 text-xs font-medium"
                      >
                        View KPIs →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Start Guide</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4">
                <div className="text-amber-600 font-bold text-lg mb-2">1. Create</div>
                <p className="text-gray-600 text-sm">Use the KPI Builder to create custom metrics with your preferred visualization</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-amber-600 font-bold text-lg mb-2">2. Configure</div>
                <p className="text-gray-600 text-sm">Set data sources, calculations, targets, and choose where to display your KPIs</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-amber-600 font-bold text-lg mb-2">3. Monitor</div>
                <p className="text-gray-600 text-sm">View real-time updates across all modules with automatic data refresh</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setActiveDemo('builder')}
                className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-semibold"
              >
                Try KPI Builder
              </button>
              <button
                onClick={() => setActiveDemo('display')}
                className="bg-white text-amber-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold border border-amber-200"
              >
                View Live Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'builder' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">KPI Builder</h2>
            <p className="text-gray-600">Create and configure custom KPIs for your dashboard</p>
          </div>
          <KPIBuilder />
        </div>
      )}

      {activeDemo === 'display' && (
        <div className="space-y-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Live KPI Display</h2>
            <p className="text-gray-600">See how your KPIs appear in different modules</p>
          </div>

          {/* Dashboard KPIs */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dashboard KPIs</h3>
            </div>
            <KPIDisplay module="dashboard" />
          </div>

          {/* Properties KPIs */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Home className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Properties KPIs</h3>
            </div>
            <KPIDisplay module="properties" />
          </div>

          {/* Empty State for other modules */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Handshake className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Deals KPIs</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No KPIs Configured</h4>
              <p className="text-gray-500 mb-4">Create your first KPI for the Deals module</p>
              <button
                onClick={() => setActiveDemo('builder')}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Create KPI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 