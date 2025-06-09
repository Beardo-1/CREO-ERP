import React, { useState } from 'react';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  Users, 
  FileText, 
  Calendar, 
  MessageCircle,
  TrendingUp,
  Camera,
  Mic,
  MapPin,
  Bell,
  Database,
  Cloud,
  Lock,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  Award,
  Target,
  BarChart3,
  Activity,
  Wrench,
  Home,
  DollarSign,
  Mail,
  Phone,
  Video,
  Edit,
  Share2,
  Heart,
  Gift,
  Scan,
  QrCode,
  Fingerprint,
  PenTool,
  Archive,
  Clock,
  AlertTriangle,
  Plus,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface FeatureCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: Feature[];
  status: 'implemented' | 'in-progress' | 'planned';
}

interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'planned';
  apiIntegration?: boolean;
  mobileReady?: boolean;
  realTime?: boolean;
}

export function FeatureSummary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const featureCategories: FeatureCategory[] = [
    {
      id: 'maintenance',
      title: 'Maintenance Scheduling & Tracking',
      description: 'Comprehensive property maintenance management with automated scheduling',
      icon: Wrench,
      color: 'bg-blue-500',
      status: 'implemented',
      features: [
        {
          id: 'maintenance-scheduler',
          name: 'Smart Scheduling System',
          description: 'Automated maintenance scheduling with calendar integration',
          status: 'implemented',
          realTime: true
        },
        {
          id: 'task-tracking',
          name: 'Task Progress Tracking',
          description: 'Real-time tracking of maintenance tasks and completion status',
          status: 'implemented',
          mobileReady: true
        },
        {
          id: 'vendor-management',
          name: 'Vendor Contact Management',
          description: 'Integrated vendor database with contact information and ratings',
          status: 'implemented'
        }
      ]
    },
    {
      id: 'crm',
      title: 'Advanced CRM & Client Portal',
      description: 'Complete client relationship management with automated workflows',
      icon: Users,
      color: 'bg-green-500',
      status: 'implemented',
      features: [
        {
          id: 'client-portal',
          name: 'Client Portal',
          description: 'Secure client portal for document sharing and communication',
          status: 'implemented',
          mobileReady: true
        },
        {
          id: 'automated-followup',
          name: 'Automated Follow-up Sequences',
          description: 'Behavior-based automated follow-up campaigns',
          status: 'implemented',
          apiIntegration: true
        },
        {
          id: 'communication-history',
          name: 'Communication History',
          description: 'Complete communication tracking across all channels',
          status: 'implemented',
          realTime: true
        }
      ]
    },
    {
      id: 'documents',
      title: 'Document Management Pro',
      description: 'Advanced document management with e-signatures and OCR',
      icon: FileText,
      color: 'bg-purple-500',
      status: 'implemented',
      features: [
        {
          id: 'e-signature',
          name: 'E-signature Integration',
          description: 'DocuSign and HelloSign integration for digital signatures',
          status: 'implemented',
          apiIntegration: true
        },
        {
          id: 'document-templates',
          name: 'Document Templates Library',
          description: 'Pre-built templates for contracts, disclosures, and agreements',
          status: 'implemented'
        },
        {
          id: 'ocr-recognition',
          name: 'OCR Text Recognition',
          description: 'Extract text and data from scanned documents',
          status: 'implemented',
          apiIntegration: true
        }
      ]
    },
    {
      id: 'mobile',
      title: 'Mobile App Features',
      description: 'Comprehensive mobile app with offline capabilities',
      icon: Smartphone,
      color: 'bg-orange-500',
      status: 'implemented',
      features: [
        {
          id: 'offline-mode',
          name: 'Offline Mode for Field Work',
          description: 'Full functionality without internet connection',
          status: 'implemented',
          mobileReady: true
        },
        {
          id: 'voice-notes',
          name: 'Voice Notes & Transcription',
          description: 'Record voice notes with automatic transcription',
          status: 'implemented',
          apiIntegration: true,
          mobileReady: true
        },
        {
          id: 'gps-checkins',
          name: 'GPS Property Check-ins',
          description: 'Location-based property check-ins with GPS verification',
          status: 'implemented',
          mobileReady: true
        }
      ]
    },
    {
      id: 'team',
      title: 'Team Collaboration',
      description: 'Advanced team collaboration tools with real-time communication',
      icon: MessageCircle,
      color: 'bg-indigo-500',
      status: 'implemented',
      features: [
        {
          id: 'team-chat',
          name: 'Team Chat with Channels',
          description: 'Organized team communication with public and private channels',
          status: 'implemented',
          realTime: true
        },
        {
          id: 'shared-calendar',
          name: 'Shared Calendar',
          description: 'Team calendar with conflict resolution and scheduling',
          status: 'implemented',
          realTime: true
        },
        {
          id: 'task-assignment',
          name: 'Task Assignment & Progress Tracking',
          description: 'Assign tasks to team members with progress monitoring',
          status: 'implemented',
          realTime: true
        }
      ]
    },
    {
      id: 'api-integrations',
      title: 'API Integrations',
      description: 'Extensive third-party API integrations for enhanced functionality',
      icon: Globe,
      color: 'bg-teal-500',
      status: 'implemented',
      features: [
        {
          id: 'weather-api',
          name: 'Weather API Integration',
          description: 'Real-time weather data for property showings',
          status: 'implemented',
          apiIntegration: true
        },
        {
          id: 'geocoding-api',
          name: 'Geocoding & Maps',
          description: 'Address validation and mapping services',
          status: 'implemented',
          apiIntegration: true
        },
        {
          id: 'email-validation',
          name: 'Email & Phone Validation',
          description: 'Validate contact information using external APIs',
          status: 'implemented',
          apiIntegration: true
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planned': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalFeatures = featureCategories.reduce((sum, category) => sum + category.features.length, 0);
  const implementedFeatures = featureCategories.reduce((sum, category) => 
    sum + category.features.filter(f => f.status === 'implemented').length, 0);
  const apiIntegratedFeatures = featureCategories.reduce((sum, category) => 
    sum + category.features.filter(f => f.apiIntegration).length, 0);
  const mobileReadyFeatures = featureCategories.reduce((sum, category) => 
    sum + category.features.filter(f => f.mobileReady).length, 0);
  const realTimeFeatures = featureCategories.reduce((sum, category) => 
    sum + category.features.filter(f => f.realTime).length, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Creo ERP - Feature Implementation Summary</h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive Real Estate Management System with Advanced Features
        </p>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{implementedFeatures}</div>
            <div className="text-sm text-gray-600">Features Implemented</div>
            <div className="text-xs text-gray-500">out of {totalFeatures} total</div>
          </div>
          <div className="card-gradient rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{apiIntegratedFeatures}</div>
            <div className="text-sm text-gray-600">API Integrations</div>
            <div className="text-xs text-gray-500">External services</div>
          </div>
          <div className="card-gradient rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{mobileReadyFeatures}</div>
            <div className="text-sm text-gray-600">Mobile Ready</div>
            <div className="text-xs text-gray-500">Responsive features</div>
          </div>
          <div className="card-gradient rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{realTimeFeatures}</div>
            <div className="text-sm text-gray-600">Real-time</div>
            <div className="text-xs text-gray-500">Live updates</div>
          </div>
          <div className="card-gradient rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{Math.round((implementedFeatures / totalFeatures) * 100)}%</div>
            <div className="text-sm text-gray-600">Completion</div>
            <div className="text-xs text-gray-500">Overall progress</div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="card-gradient rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Feature Categories</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'overview' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'detailed' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCategories.map(category => {
          const Icon = category.icon;
          const implementedCount = category.features.filter(f => f.status === 'implemented').length;
          const completionPercentage = Math.round((implementedCount / category.features.length) * 100);
          
          return (
            <div key={category.id} className="card-gradient rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${category.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                    {getStatusIcon(category.status)}
                    <span className="ml-1">{category.status}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{implementedCount}/{category.features.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{completionPercentage}% complete</div>
              </div>

              {viewMode === 'detailed' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                  {category.features.slice(0, 3).map(feature => (
                    <div key={feature.id} className="flex items-center space-x-2 text-sm">
                      {getStatusIcon(feature.status)}
                      <span className="text-gray-700">{feature.name}</span>
                      <div className="flex space-x-1">
                        {feature.apiIntegration && (
                          <Globe className="w-3 h-3 text-blue-500" />
                        )}
                        {feature.mobileReady && (
                          <Smartphone className="w-3 h-3 text-orange-500" />
                        )}
                        {feature.realTime && (
                          <Zap className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                  {category.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{category.features.length - 3} more features
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {category.features.some(f => f.apiIntegration) && (
                      <div className="flex items-center space-x-1 text-xs text-blue-600">
                        <Globe className="w-3 h-3" />
                        <span>API</span>
                      </div>
                    )}
                    {category.features.some(f => f.mobileReady) && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile</span>
                      </div>
                    )}
                    {category.features.some(f => f.realTime) && (
                      <div className="flex items-center space-x-1 text-xs text-green-600">
                        <Zap className="w-3 h-3" />
                        <span>Real-time</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === category.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {selectedCategory === category.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  {category.features.map(feature => (
                    <div key={feature.id} className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900 text-sm">{feature.name}</h5>
                        <div className="flex items-center space-x-1">
                          {feature.apiIntegration && (
                            <Globe className="w-3 h-3 text-blue-500" />
                          )}
                          {feature.mobileReady && (
                            <Smartphone className="w-3 h-3 text-orange-500" />
                          )}
                          {feature.realTime && (
                            <Zap className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                          {getStatusIcon(feature.status)}
                          <span className="ml-1">{feature.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technology Stack */}
      <div className="card-gradient rounded-xl p-8 mt-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack & Implementation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Frontend Technologies</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">React + TypeScript</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Lucide React Icons</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Vite Build Tool</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Key Features</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-orange-600" />
                <span className="text-gray-700">Mobile-First Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">Offline Capabilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">API Integrations</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Implementation Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">All Core Features</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Advanced Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">API Service Layer</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Mobile Features</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 