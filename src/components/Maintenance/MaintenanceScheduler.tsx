import React, { useState } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { appContent } from '../../content/app.content';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Filter, 
  Search,
  Building,
  Home,
  Zap,
  Droplets,
  Thermometer,
  Shield,
  Camera,
  FileText,
  Bell,
  RefreshCw
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  type: 'plumbing' | 'electrical' | 'hvac' | 'general' | 'landscaping' | 'security' | 'cleaning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  propertyId: string;
  propertyAddress: string;
  scheduledDate: string;
  estimatedDuration: number; // in hours
  assignedVendor?: Vendor;
  cost?: number;
  notes?: string;
  createdBy: string;
  createdDate: string;
  completedDate?: string;
  photos: string[];
  recurring?: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDue: string;
  };
}

interface Vendor {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
  hourlyRate: number;
  isPreferred: boolean;
  lastUsed?: string;
}

export function MaintenanceScheduler() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      title: 'HVAC System Inspection',
      description: 'Annual HVAC system inspection and filter replacement',
      type: 'hvac',
      priority: 'medium',
      status: 'scheduled',
      propertyId: 'prop-123',
      propertyAddress: '123 Oak Street, Springfield',
      scheduledDate: '2024-01-20',
      estimatedDuration: 2,
      assignedVendor: {
        id: 'v1',
        name: 'John Smith',
        company: 'Climate Control Pro',
        phone: '(555) 123-4567',
        email: 'john@climatecontrolpro.com',
        specialties: ['HVAC', 'Air Conditioning'],
        rating: 4.8,
        hourlyRate: 85,
        isPreferred: true,
        lastUsed: '2023-12-15'
      },
      cost: 170,
      createdBy: 'Property Manager',
      createdDate: '2024-01-15',
      photos: [],
      recurring: {
        frequency: 'yearly',
        nextDue: '2025-01-20'
      }
    },
    {
      id: '2',
      title: 'Plumbing Leak Repair',
      description: 'Fix leaking faucet in master bathroom',
      type: 'plumbing',
      priority: 'high',
      status: 'in-progress',
      propertyId: 'prop-456',
      propertyAddress: '456 Pine Avenue, Springfield',
      scheduledDate: '2024-01-18',
      estimatedDuration: 1.5,
      assignedVendor: {
        id: 'v2',
        name: 'Mike Johnson',
        company: 'Quick Fix Plumbing',
        phone: '(555) 987-6543',
        email: 'mike@quickfixplumbing.com',
        specialties: ['Plumbing', 'Emergency Repairs'],
        rating: 4.6,
        hourlyRate: 75,
        isPreferred: true,
        lastUsed: '2024-01-10'
      },
      cost: 112.50,
      createdBy: 'Tenant Request',
      createdDate: '2024-01-17',
      photos: ['leak-photo-1.jpg']
    }
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: 'v1',
      name: 'John Smith',
      company: 'Climate Control Pro',
      phone: '(555) 123-4567',
      email: 'john@climatecontrolpro.com',
      specialties: ['HVAC', 'Air Conditioning'],
      rating: 4.8,
      hourlyRate: 85,
      isPreferred: true,
      lastUsed: '2023-12-15'
    },
    {
      id: 'v2',
      name: 'Mike Johnson',
      company: 'Quick Fix Plumbing',
      phone: '(555) 987-6543',
      email: 'mike@quickfixplumbing.com',
      specialties: ['Plumbing', 'Emergency Repairs'],
      rating: 4.6,
      hourlyRate: 75,
      isPreferred: true,
      lastUsed: '2024-01-10'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'vendors' | 'reports'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <Trash2 className="w-3 h-3" />;
      case 'overdue': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plumbing': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'electrical': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'hvac': return <Thermometer className="w-5 h-5 text-purple-600" />;
      case 'general': return <Wrench className="w-5 h-5 text-gray-600" />;
      case 'landscaping': return <Home className="w-5 h-5 text-green-600" />;
      case 'security': return <Shield className="w-5 h-5 text-red-600" />;
      case 'cleaning': return <RefreshCw className="w-5 h-5 text-teal-600" />;
      default: return <Wrench className="w-5 h-5 text-gray-600" />;
    }
  };

  const taskStats = {
    total: tasks.length,
    scheduled: tasks.filter(t => t.status === 'scheduled').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(appContent.maintenance.maintenanceScheduler)}</h1>
        <p className="text-gray-600">{t(appContent.maintenance.managePropertyTasks)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{taskStats.scheduled}</p>
              <p className="text-sm text-gray-600">{t(appContent.maintenance.maintenanceScheduled)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{taskStats.inProgress}</p>
              <p className="text-sm text-gray-600">{t(appContent.maintenance.inProgress)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{taskStats.completed}</p>
              <p className="text-sm text-gray-600">{t(appContent.maintenance.maintenanceCompleted)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{taskStats.urgent}</p>
              <p className="text-sm text-gray-600">{t(appContent.maintenance.urgent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 mb-8">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'tasks', label: t('maintenance.maintenanceTasks'), icon: Wrench },
            { id: 'calendar', label: t('maintenance.calendarView'), icon: Calendar },
            { id: 'vendors', label: t('maintenance.vendors'), icon: User },
            { id: 'reports', label: t('maintenance.reports'), icon: FileText }
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
      {activeTab === 'tasks' && (
        <div className="space-y-8">
          {/* Controls */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('maintenance.searchTasks')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t('maintenance.allTypes')}</option>
                  <option value="plumbing">{t('maintenance.plumbing')}</option>
                  <option value="electrical">{t('maintenance.electrical')}</option>
                  <option value="hvac">{t('maintenance.hvac')}</option>
                  <option value="general">{t('maintenance.general')}</option>
                  <option value="landscaping">{t('maintenance.landscaping')}</option>
                  <option value="security">{t('maintenance.security')}</option>
                  <option value="cleaning">{t('maintenance.cleaning')}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">{t('maintenance.allStatus')}</option>
                  <option value="scheduled">{t('maintenance.maintenanceScheduled')}</option>
                  <option value="in-progress">{t('maintenance.inProgress')}</option>
                  <option value="completed">{t('maintenance.maintenanceCompleted')}</option>
                  <option value="overdue">{t('maintenance.overdue')}</option>
                </select>
              </div>

              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                {t('maintenance.newTask')}
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {tasks.map(task => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(task.type)}
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      </div>
                      
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">{t('maintenance.property')}</p>
                          <p className="font-medium text-gray-900">{task.propertyAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('maintenance.scheduledDate')}</p>
                          <p className="font-medium text-gray-900">{new Date(task.scheduledDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('maintenance.duration')}</p>
                          <p className="font-medium text-gray-900">{task.estimatedDuration}h</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('maintenance.cost')}</p>
                          <p className="font-medium text-gray-900">
                            {task.cost ? `$${task.cost.toFixed(2)}` : t('maintenance.tbd')}
                          </p>
                        </div>
                      </div>
                      
                      {task.assignedVendor && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {task.assignedVendor.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{task.assignedVendor.name}</p>
                                <p className="text-sm text-gray-600">{task.assignedVendor.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-900">{task.assignedVendor.rating}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                  <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                                  <Mail className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {task.recurring && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <RefreshCw className="w-4 h-4" />
                          <span>{t('maintenance.recurring')} {t(`maintenance.${task.recurring.frequency}`)} • {t('maintenance.nextDue')}: {new Date(task.recurring.nextDue).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t('maintenance.vendorDirectory')}</h3>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
              <Plus className="w-4 h-4 mr-2 inline" />
              {t('maintenance.addVendor')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <div key={vendor.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {vendor.name.charAt(0)}
                  </div>
                  {vendor.isPreferred && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {t('maintenance.preferred')}
                    </span>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{vendor.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{vendor.company}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{vendor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{vendor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">${vendor.hourlyRate}/hour</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                  </div>
                  {vendor.lastUsed && (
                    <span className="text-xs text-gray-500">
                      {t('maintenance.lastUsed')}: {new Date(vendor.lastUsed).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {vendor.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
                    <Phone className="w-3 h-3 mr-1 inline" />
                    {t('maintenance.call')}
                  </button>
                  <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
                    <Mail className="w-3 h-3 mr-1 inline" />
                    {t('maintenance.maintenanceEmail')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {(activeTab === 'calendar' || activeTab === 'reports') && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'calendar' ? (
              <Calendar className="w-8 h-8 text-amber-600" />
            ) : (
              <FileText className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {activeTab === 'calendar' ? t('maintenance.calendarView') : t('maintenance.reports')}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'calendar' 
              ? t('maintenance.calendarInterface')
              : t('maintenance.detailedReports')
            }
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
            {t('maintenance.comingSoon')}
          </button>
        </div>
      )}
    </div>
  );
} 